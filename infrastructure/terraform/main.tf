terraform {

  backend "s3" {
    bucket         = "lolwrapped-terraform-state"
    key            = "lolwrapped/terraform.tfstate"
    region         = "us-east-1"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  required_version = ">= 1.5.0"
}

provider "aws" {
  region = var.region
}

# -----------------------------
# Default VPC + Subnet Discovery
# -----------------------------
# Automatically finds your default VPC and a subnet to use
data "aws_vpc" "default" {
  default = true
}

data "aws_subnet" "default" {
  availability_zone = "us-east-1a"
  default_for_az    = true
}

# -----------------------------
# IAM Role + Policies for EC2
# -----------------------------
resource "aws_iam_role" "lolec2_role" {
  name = "app-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

# DynamoDB Access Policy
resource "aws_iam_policy" "ec2_dynamodb_policy" {
  name        = "EC2DynamoDBAccess"
  description = "Allow EC2 instance to read/write to the app DynamoDB table"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:UpdateItem"
        ]
        Resource = "*"
      }
    ]
  })
}

# SSM Parameter for Riot API Key
resource "aws_ssm_parameter" "riot_api_key" {
  name  = "RIOT_API_KEY"
  type  = "SecureString"
  value = var.riot_api_key
}

# Policy to read SSM parameter
resource "aws_iam_policy" "ec2_ssm_policy" {
  name        = "EC2SSMParameterAccess"
  description = "Allow EC2 instance to read Riot API key from SSM"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssm:GetParameter"
        ]
        Resource = aws_ssm_parameter.riot_api_key.arn
      }
    ]
  })
}

# Attach policies
resource "aws_iam_role_policy_attachment" "ec2_attach_dynamo" {
  role       = aws_iam_role.lolec2_role.name
  policy_arn = aws_iam_policy.ec2_dynamodb_policy.arn
}

resource "aws_iam_role_policy_attachment" "ec2_attach_ssm" {
  role       = aws_iam_role.lolec2_role.name
  policy_arn = aws_iam_policy.ec2_ssm_policy.arn
}

# Managed policy attachments for ECR + SSM
resource "aws_iam_role_policy_attachment" "ec2_attach_ecr" {
  role       = aws_iam_role.lolec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_iam_role_policy_attachment" "ec2_attach_ssm_managed" {
  role       = aws_iam_role.lolec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# Instance profile
resource "aws_iam_instance_profile" "ec2_profile" {
  name = "app-ec2-profile"
  role = aws_iam_role.lolec2_role.name
}

# -----------------------------
# DynamoDB Table
# -----------------------------
resource "aws_dynamodb_table" "lolwrapped_cache" {
  name         = "lolwrapped_cache"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "puuid"
  range_key    = "season"

  attribute {
    name = "puuid"
    type = "S"
  }

  attribute {
    name = "season"
    type = "S"
  }
}

# -----------------------------
# Security Group (in default VPC)
# -----------------------------
resource "aws_security_group" "app_sg" {
  name        = "lolwrapped-sg"
  description = "Allow HTTP, HTTPS, and SSH access"
  vpc_id      = data.aws_vpc.default.id

  # Allow HTTP (port 80)
  ingress {
    description = "Allow HTTP traffic"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow HTTPS (port 443)
  ingress {
    description = "Allow HTTPS traffic"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow SSH (port 22) — restrict to your IP for security
  ingress {
    description = "Allow SSH access"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] 
  }

    # ✅ Allow direct backend API access (for debugging / testing)
  ingress {
    description = "Backend API direct access"
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "lolwrapped-sg"
  }
}


# -----------------------------
# EC2 Instance
# -----------------------------

resource "aws_instance" "app_server" {
  ami                         = var.ami_id
  instance_type               = "t3.micro"
  subnet_id                   = data.aws_subnet.default.id
  vpc_security_group_ids      = [aws_security_group.app_sg.id]
  iam_instance_profile        = aws_iam_instance_profile.ec2_profile.name
  associate_public_ip_address = true

  user_data = <<-EOF
    #!/bin/bash
    set -e

    # Update and install dependencies
    yum update -y
    yum install -y aws-cli docker git -y

    # Enable and start Docker
    systemctl enable docker
    systemctl start docker

    # ✅ Add ec2-user to Docker group
    usermod -aG docker ec2-user

    # Install Docker Compose v2
    curl -SL https://github.com/docker/compose/releases/download/v2.27.1/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose

    # Create deployment script for multi-container setup
    cat <<'SCRIPT' > /usr/local/bin/deploy-lolwrapped.sh
    #!/bin/bash
    set -e

    FRONTEND_IMAGE=$1
    BACKEND_IMAGE=$2
    NGINX_IMAGE=$3

    # ✅ Use AWS_REGION env var (fallback to us-east-1)
    REGION=$${AWS_REGION:-us-east-1}

    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

    echo "🔐 Logging in to ECR..."
    aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

    # 🔑 Fetch Riot API key from SSM *before* writing docker-compose.yml
    echo "🔑 Fetching Riot API key from SSM..."
    RIOT_API_KEY=$(aws ssm get-parameter --name "RIOT_API_KEY" --with-decryption --query "Parameter.Value" --output text)
    export RIOT_API_KEY

    echo "⬇️ Pulling latest images..."
    docker pull $FRONTEND_IMAGE
    docker pull $BACKEND_IMAGE
    docker pull $NGINX_IMAGE

    echo "🧹 Stopping old containers (if any)..."
    docker-compose -f /home/ec2-user/docker-compose.yml down || true

    echo "🧱 Writing docker-compose.yml..."
    cat <<EOF2 > /home/ec2-user/docker-compose.yml
    version: "3.8"
    services:
      frontend:
        image: $FRONTEND_IMAGE
        restart: always
        ports:
          - "3000:3000"

      backend:
        image: $BACKEND_IMAGE
        restart: always
        environment:
          - AWS_REGION=$REGION
          - DYNAMODB_TABLE=lolwrapped_cache
          - RIOT_API_KEY=$RIOT_API_KEY
        ports:
          - "5000:5000"

      nginx:
        image: $NGINX_IMAGE
        restart: always
        ports:
          - "80:80"
        depends_on:
          - frontend
          - backend
    EOF2

    echo "🚀 Starting new containers..."
    cd /home/ec2-user
    docker-compose up -d

    echo "✅ Deployment complete."
    SCRIPT

    chmod +x /usr/local/bin/deploy-lolwrapped.sh

    echo "EC2 instance ready for multi-container deployments."
  EOF

  tags = {
    Name = "app-server"
    App  = "lolwrapped"
  }
}




# -----------------------------
# ECR Repository
# -----------------------------
resource "aws_ecr_repository" "frontend" {
  name                 = "lolwrapped-frontend"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "backend" {
  name                 = "lolwrapped-backend"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "nginx" {
  name                 = "lolwrapped-nginx"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
}
