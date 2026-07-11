variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "my_ip_cidr" {
  description = "Your IP CIDR for SSH access (e.g. 1.2.3.4/32)"
  type        = string
}

variable "ec2_public_key" {
  description = "SSH public key content for EC2 access"
  type        = string
}

variable "db_name" {
  description = "RDS database name"
  type        = string
  default     = "noor_school"
}

variable "db_username" {
  description = "RDS master username"
  type        = string
  default     = "admin"
}

variable "db_password" {
  description = "RDS master password"
  type        = string
  sensitive   = true
}
