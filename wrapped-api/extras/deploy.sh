#!/bin/bash
set -e  # exit immediately on error

# ===== CONFIGURATION =====
IMAGE_NAME="lolwrapped"
ACCOUNT_ID="851725383448"
REGION="us-east-1"
REPO_URL="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$IMAGE_NAME"

# ===== BUILD =====
echo "🚧 Building Docker image for $IMAGE_NAME..."
docker buildx build --platform linux/amd64 -t $IMAGE_NAME .

# ===== TAG =====
echo "🏷️ Tagging image as $REPO_URL:latest"
docker tag $IMAGE_NAME:latest $REPO_URL:latest

# ===== LOGIN =====
echo "🔐 Logging into AWS ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

# ===== PUSH =====
echo "📤 Pushing image to ECR..."
docker push $REPO_URL:latest

echo "✅ Done! Image pushed to: $REPO_URL:latest"
