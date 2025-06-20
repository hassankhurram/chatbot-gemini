#!/bin/bash

# Cloud Run Setup Script for Gemini Chat
# This script helps set up the necessary Google Cloud resources and secrets

set -e

echo "🚀 Setting up Cloud Run deployment for Gemini Chat..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud SDK is not installed. Please install it first:"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ Not authenticated with Google Cloud. Please run:"
    echo "   gcloud auth login"
    exit 1
fi

# Get project ID
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo "❌ No project ID set. Please set it with:"
    echo "   gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo "📋 Using project: $PROJECT_ID"

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Create service account for GitHub Actions
echo "👤 Creating service account for GitHub Actions..."
SA_NAME="github-actions-sa"
SA_EMAIL="$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"

# Check if service account already exists
if ! gcloud iam service-accounts describe "$SA_EMAIL" &>/dev/null; then
    gcloud iam service-accounts create "$SA_NAME" \
        --display-name="GitHub Actions Service Account"
fi

# Grant necessary permissions
echo "🔐 Granting permissions..."
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/storage.admin"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/cloudbuild.builds.builder"

# Create and download service account key
echo "🔑 Creating service account key..."
KEY_FILE="gcp-service-account-key.json"
gcloud iam service-accounts keys create "$KEY_FILE" \
    --iam-account="$SA_EMAIL"

echo "✅ Service account key created: $KEY_FILE"
echo ""
echo "📝 Next steps:"
echo "1. Add the following secrets to your GitHub repository:"
echo "   - GCP_PROJECT_ID: $PROJECT_ID"
echo "   - GCP_SA_KEY: (content of $KEY_FILE)"
echo "   - GOOGLE_GENERATIVE_AI_API_KEY: (your Gemini API key)"
echo "   - JWT_SECRET: (a secure random string)"
echo "   - MONGODB_URI: (your MongoDB connection string)"
echo "   - ADMIN_USERNAME: (initial admin username)"
echo "   - ADMIN_PASSWORD: (initial admin password)"
echo "   - ADMIN_EMAIL: (initial admin email)"
echo "   - ADMIN_NAME: (initial admin name)"
echo ""
echo "2. Push your code to the main branch to trigger deployment"
echo ""
echo "3. The service will be available at:"
echo "   https://gemini-chat-xxxxx-uc.a.run.app"
echo ""
echo "⚠️  IMPORTANT: Keep the service account key file secure and don't commit it to version control!" 