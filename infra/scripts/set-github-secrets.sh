#!/bin/bash
set -e

echo "--- Setting GitHub Secrets ---"

# Ensure GitHub CLI is authenticated
if ! gh auth status > /dev/null; then
  echo "Error: GitHub CLI is not authenticated. Please run 'gh auth login' first."
  exit 1
fi

# Source environment variables from Backend/.env
if [ -f ../../Backend/.env ]; then
  export $(grep -v '^#' ../../Backend/.env | xargs)
fi

# Get EC2_HOST (public IP) from terraform outputs, or from existing environment variable if available
EC2_HOST="${EC2_IP:-$(terraform -chdir=../ output -raw ec2_public_ip 2>/dev/null)}"
if [ -z "$EC2_HOST" ]; then
  echo "Error: EC2_HOST (public IP) not found. Ensure 'terraform apply' has run successfully, or EC2_IP is set in environment."
  exit 1
fi

# Get EC2_USER (default to ec2-user as per prompt, user can override)
EC2_USER="${EC2_USER:-ec2-user}"

# Get EC2_SSH_KEY (sensitive, must be provided by user or exported as an environment variable)
# User needs to provide the *private* SSH key content directly or via a file.
# For example: export EC2_SSH_KEY="$(cat ~/.ssh/id_rsa)"
if [ -z "$EC2_SSH_KEY" ]; then
  echo "Error: EC2_SSH_KEY environment variable is not set. Please export your private SSH key content."
  echo "Example: export EC2_SSH_KEY=\"$(cat ~/.ssh/your_key_name.pem)\" "
  exit 1
fi

# Get MYSQL_PASSWORD from Backend/.env (as it's a sensitive value set by the user for RDS)
# Verify it's not the placeholder value
if grep -q "^MYSQL_PASSWORD=" "../../Backend/.env"; then
  MYSQL_PASSWORD=$(grep "^MYSQL_PASSWORD=" "../../Backend/.env" | cut -d '=' -f2-)
  if [ "$MYSQL_PASSWORD" == "<user will provide>" ] || [ "$MYSQL_PASSWORD" == "your_secure_password_here" ]; then
    echo "Error: MYSQL_PASSWORD in Backend/.env is a placeholder. Please update it with your actual RDS password."
    exit 1
  fi
else
  echo "Error: MYSQL_PASSWORD not found in Backend/.env. Please ensure it's configured."
  exit 1
fi

echo "Setting GitHub secret EC2_HOST..."
gh secret set EC2_HOST --body "$EC2_HOST"
echo "Setting GitHub secret EC2_USER..."
gh secret set EC2_USER --body "$EC2_USER"
echo "Setting GitHub secret EC2_SSH_KEY..."
gh secret set EC2_SSH_KEY --body "$EC2_SSH_KEY"
echo "Setting GitHub secret MYSQL_PASSWORD..."
gh secret set MYSQL_PASSWORD --body "$MYSQL_PASSWORD"

echo "--- GitHub Secrets set successfully ---"
