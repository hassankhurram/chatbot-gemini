#!/bin/bash

# GitHub Secrets Setup Script for Cloud Run Deployment
# This script helps you set up the required GitHub secrets

set -e

echo "🔐 Setting up GitHub secrets for Cloud Run deployment..."
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI is not installed. Please install it first:"
    echo "   https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &>/dev/null; then
    echo "❌ Not authenticated with GitHub. Please run:"
    echo "   gh auth login"
    exit 1
fi

# Get repository name
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
echo "📋 Using repository: $REPO"
echo ""

# Function to set secret
set_secret() {
    local secret_name=$1
    local secret_value=$2
    local description=$3
    
    echo "Setting $secret_name..."
    echo "$secret_value" | gh secret set "$secret_name" --repo "$REPO"
    echo "✅ $secret_name set successfully"
    echo ""
}

# Generate JWT secret if not provided
if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -base64 32)
    echo "🔑 Generated JWT_SECRET: $JWT_SECRET"
    echo ""
fi

# Prompt for required secrets
echo "Please provide the following values:"
echo ""

read -p "Google Cloud Project ID: " GCP_PROJECT_ID
read -p "Google Generative AI API Key: " GOOGLE_GENERATIVE_AI_API_KEY
read -p "MongoDB URI: " MONGODB_URI
read -p "Admin Username [admin]: " ADMIN_USERNAME
ADMIN_USERNAME=${ADMIN_USERNAME:-admin}
read -p "Admin Password: " ADMIN_PASSWORD
read -p "Admin Email: " ADMIN_EMAIL
read -p "Admin Name [Administrator]: " ADMIN_NAME
ADMIN_NAME=${ADMIN_NAME:-Administrator}

# Read service account key
echo ""
echo "Please provide the path to your Google Cloud service account key file:"
read -p "Service Account Key File Path: " SA_KEY_FILE

if [ ! -f "$SA_KEY_FILE" ]; then
    echo "❌ Service account key file not found: $SA_KEY_FILE"
    exit 1
fi

GCP_SA_KEY=$(cat "$SA_KEY_FILE")

echo ""
echo "🚀 Setting up GitHub secrets..."

# Set all secrets
set_secret "GCP_PROJECT_ID" "$GCP_PROJECT_ID" "Google Cloud Project ID"
set_secret "GCP_SA_KEY" "$GCP_SA_KEY" "Google Cloud Service Account Key"
set_secret "GOOGLE_GENERATIVE_AI_API_KEY" "$GOOGLE_GENERATIVE_AI_API_KEY" "Google Generative AI API Key"
set_secret "JWT_SECRET" "$JWT_SECRET" "JWT Signing Secret"
set_secret "MONGODB_URI" "$MONGODB_URI" "MongoDB Connection String"
set_secret "ADMIN_USERNAME" "$ADMIN_USERNAME" "Initial Admin Username"
set_secret "ADMIN_PASSWORD" "$ADMIN_PASSWORD" "Initial Admin Password"
set_secret "ADMIN_EMAIL" "$ADMIN_EMAIL" "Initial Admin Email"
set_secret "ADMIN_NAME" "$ADMIN_NAME" "Initial Admin Name"

echo "✅ All secrets have been set successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Push your code to the main branch to trigger deployment"
echo "2. Monitor the deployment in the Actions tab"
echo "3. Your service will be available at: https://gemini-chat-xxxxx-uc.a.run.app"
echo ""
echo "🔍 To view your secrets (names only):"
echo "   gh secret list --repo $REPO" 