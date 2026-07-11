#!/bin/bash
set -e

# Load environment variables from Backend/.env for existing values
# This is mainly to retrieve existing MYSQL_PASSWORD and other values that terraform doesn't output.
if [ -f ../../Backend/.env ]; then
  export $(grep -v '^#' ../../Backend/.env | xargs)
fi

echo "--- Verifying AWS Infrastructure ---"

# 1. Confirm AWS CLI credentials
echo "1. Checking AWS CLI credentials..."
if aws sts get-caller-identity > /dev/null; then
  echo "   AWS CLI credentials are valid."
else
  echo "Error: AWS CLI credentials are not configured or invalid."
  exit 1
fi

# 2. Check EC2 instance state
echo "2. Checking EC2 instance state..."
EC2_ID=$(aws ec2 describe-instances \
  --filters "Name=tag:Project,Values=NoorPremierSchool" "Name=instance-state-name,Values=running" \
  --query "Reservations[0].Instances[0].InstanceId" --output text 2>/dev/null)

if [ "$EC2_ID" != "None" ] && [ -n "$EC2_ID" ]; then
  echo "   EC2 instance '$EC2_ID' is running."
else
  echo "Error: EC2 instance with tag Project=NoorPremierSchool not found or not running."
  exit 1
fi

# 3. Check RDS status
echo "3. Checking RDS instance status..."
RDS_STATUS=$(aws rds describe-db-instances --db-instance-identifier noor-premier-db \
  --query "DBInstances[0].DBInstanceStatus" --output text 2>/dev/null)

if [ "$RDS_STATUS" == "available" ]; then
  echo "   RDS instance 'noor-premier-db' is available."
else
  echo "Error: RDS instance 'noor-premier-db' not found or not available. Current status: $RDS_STATUS"
  exit 1
fi

# 4. Confirm CloudWatch alarm exists
echo "4. Confirming CloudWatch alarm 'noor-ec2-cpu-high' exists..."
ALARM_STATE=$(aws cloudwatch describe-alarms --alarm-names noor-ec2-cpu-high \
  --query "MetricAlarms[0].StateValue" --output text 2>/dev/null)

if [ "$ALARM_STATE" != "None" ] && [ -n "$ALARM_STATE" ]; then
  echo "   CloudWatch alarm 'noor-ec2-cpu-high' exists with state: $ALARM_STATE."
else
  echo "Error: CloudWatch alarm 'noor-ec2-cpu-high' not found."
  exit 1
fi

# 5. Confirm RDS backup_retention_period = 7
echo "5. Confirming RDS backup retention period is 7 days..."
RDS_RETENTION=$(aws rds describe-db-instances --db-instance-identifier noor-premier-db \
  --query "DBInstances[0].BackupRetentionPeriod" --output text 2>/dev/null)

if [ "$RDS_RETENTION" == "7" ]; then
  echo "   RDS backup retention period is 7 days."
else
  echo "Error: RDS backup retention period is not 7 days. Current: $RDS_RETENTION"
  exit 1
fi

# Get Terraform outputs for RDS_ENDPOINT and EC2_IP
echo "6. Retrieving Terraform outputs and updating Backend/.env..."
# These commands assume `terraform apply` has been run from infra/
# If terraform output fails, these variables will be empty, and subsequent checks will fail
RDS_ENDPOINT=$(terraform -chdir=../ output -raw rds_endpoint 2>/dev/null || echo "")
EC2_IP=$(terraform -chdir=../ output -raw ec2_public_ip 2>/dev/null || echo "")
RDS_PORT=$(terraform -chdir=../ output -raw rds_port 2>/dev/null || echo "")

if [ -z "$RDS_ENDPOINT" ] || [ -z "$EC2_IP" ] || [ -z "$RDS_PORT" ]; then
  echo "Warning: Could not retrieve all Terraform outputs. Ensure 'terraform apply' has run successfully in the 'infra/' directory."
  echo "RDS_ENDPOINT: $RDS_ENDPOINT"
  echo "EC2_IP: $EC2_IP"
  echo "RDS_PORT: $RDS_PORT"
  # Attempt to describe EC2 public IP if terraform output failed
  EC2_IP_DESCRIBE=$(aws ec2 describe-instances --instance-ids "$EC2_ID" --query "Reservations[0].Instances[0].PublicIpAddress" --output text 2>/dev/null)
  if [ -n "$EC2_IP_DESCRIBE" ] && [ "$EC2_IP_DESCRIBE" != "None" ]; then
    EC2_IP="$EC2_IP_DESCRIBE"
    echo "Using EC2_IP from describe-instances: $EC2_IP"
  fi
fi

# Update Backend/.env
ENV_FILE="../../Backend/.env"

# Create .env if it doesn't exist
touch "$ENV_FILE"

# Function to update or add an environment variable
update_env_var() {
  local key=$1
  local value=$2
  if grep -q "^${key}=" "$ENV_FILE"; then
    sed -i "s|^${key}=.*|${key}=${value}|" "$ENV_FILE"
  else
    echo "${key}=${value}" >> "$ENV_FILE"
  fi
}

if [ -n "$RDS_ENDPOINT" ]; then
  update_env_var "MYSQL_HOST" "$RDS_ENDPOINT"
fi
if [ -n "$RDS_PORT" ]; then
  update_env_var "MYSQL_PORT" "$RDS_PORT"
fi
if [ -n "$EC2_IP" ]; then
  update_env_var "FRONTEND_URL" "http://${EC2_IP}:5173" # Assuming frontend runs on EC2 public IP
fi

# Preserve existing MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE if they exist and are not placeholders
if grep -q "MYSQL_USER=<user will create>" "$ENV_FILE" || ! grep -q "^MYSQL_USER=" "$ENV_FILE"; then
    update_env_var "MYSQL_USER" "admin" # Default from prompt
fi
if grep -q "MYSQL_PASSWORD=<user will provide>" "$ENV_FILE" || grep -q "MYSQL_PASSWORD=your_password_here" "$ENV_FILE" || ! grep -q "^MYSQL_PASSWORD=" "$ENV_FILE"; then
    echo "Warning: MYSQL_PASSWORD is a placeholder or not set. Please update it in Backend/.env"
    update_env_var "MYSQL_PASSWORD" "your_secure_password_here" # Placeholder if not set
fi
if grep -q "MYSQL_DATABASE=<user will provide>" "$ENV_FILE" || ! grep -q "^MYSQL_DATABASE=" "$ENV_FILE"; then
    update_env_var "MYSQL_DATABASE" "noor_school_db" # Default from terraform variables
fi

# 7. Generate JWT_SECRET
echo "7. Generating JWT_SECRET and updating Backend/.env..."
JWT_SECRET_GEN=$(openssl rand -hex 32)
update_env_var "JWT_SECRET" "$JWT_SECRET_GEN"

echo "Backend/.env updated with latest infrastructure details and new JWT_SECRET."

echo "--- Infrastructure verification complete ---"

# Export variables for subsequent scripts if needed
export RDS_ENDPOINT
export EC2_IP
export RDS_PORT
export JWT_SECRET="$JWT_SECRET_GEN"

echo "Verification successful."
