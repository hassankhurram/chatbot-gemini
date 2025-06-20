# Cloud Run Deployment Guide

This guide will help you deploy the Gemini Chat application to Google Cloud Run using GitHub Actions.

## Prerequisites

1. **Google Cloud Account**: You need a Google Cloud account with billing enabled
2. **Google Cloud SDK**: Install the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
3. **GitHub Repository**: Your code should be in a GitHub repository
4. **MongoDB Database**: A MongoDB instance (Atlas, self-hosted, or other provider)

## Quick Setup

### 1. Run the Setup Script

```bash
# Navigate to the project directory
cd gemini-chat

# Run the setup script
./scripts/setup-cloud-run.sh
```

This script will:
- Enable required Google Cloud APIs
- Create a service account for GitHub Actions
- Grant necessary permissions
- Generate a service account key file

### 2. Configure GitHub Secrets

Add the following secrets to your GitHub repository (Settings → Secrets and variables → Actions):

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `GCP_PROJECT_ID` | Your Google Cloud Project ID | `my-project-123456` |
| `GCP_SA_KEY` | Content of the service account key file | `{"type": "service_account", ...}` |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Your Gemini API key | `AIzaSyC...` |
| `JWT_SECRET` | A secure random string for JWT signing | `your-super-secret-jwt-key-here` |
| `MONGODB_URI` | Your MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `ADMIN_USERNAME` | Initial admin username | `admin` |
| `ADMIN_PASSWORD` | Initial admin password | `secure-password-123` |
| `ADMIN_EMAIL` | Initial admin email | `admin@example.com` |
| `ADMIN_NAME` | Initial admin display name | `Administrator` |

### 3. Deploy

Push your code to the `main` or `master` branch:

```bash
git add .
git commit -m "Add Cloud Run deployment"
git push origin main
```

The GitHub Actions workflow will automatically:
1. Run tests and linting
2. Build the Docker image
3. Push to Google Container Registry
4. Deploy to Cloud Run

## Manual Deployment

If you prefer to deploy manually:

### 1. Build and Push the Image

```bash
# Set your project ID
export PROJECT_ID="your-project-id"

# Build the image
docker build -f Dockerfile.cloudrun -t gcr.io/$PROJECT_ID/gemini-chat:latest .

# Push to Container Registry
docker push gcr.io/$PROJECT_ID/gemini-chat:latest
```

### 2. Deploy to Cloud Run

```bash
# Deploy the service
gcloud run deploy gemini-chat \
  --image gcr.io/$PROJECT_ID/gemini-chat:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --max-instances 10 \
  --timeout 300 \
  --concurrency 80 \
  --set-env-vars NODE_ENV=production \
  --set-env-vars GOOGLE_GENERATIVE_AI_API_KEY=your-api-key \
  --set-env-vars JWT_SECRET=your-jwt-secret \
  --set-env-vars MONGODB_URI=your-mongodb-uri \
  --set-env-vars ADMIN_USERNAME=admin \
  --set-env-vars ADMIN_PASSWORD=admin123 \
  --set-env-vars ADMIN_EMAIL=admin@example.com \
  --set-env-vars ADMIN_NAME=Administrator
```

## Configuration

### Environment Variables

The application uses the following environment variables:

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `NODE_ENV` | No | Environment mode | `production` |
| `PORT` | No | Port to listen on | `8080` |
| `HOSTNAME` | No | Host to bind to | `0.0.0.0` |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Yes | Gemini API key | - |
| `JWT_SECRET` | Yes | JWT signing secret | - |
| `MONGODB_URI` | Yes | MongoDB connection string | - |
| `ADMIN_USERNAME` | No | Initial admin username | `admin` |
| `ADMIN_PASSWORD` | No | Initial admin password | `admin123` |
| `ADMIN_EMAIL` | No | Initial admin email | `admin@example.com` |
| `ADMIN_NAME` | No | Initial admin name | `Administrator` |

### Cloud Run Configuration

The service is configured with:

- **Memory**: 2GB
- **CPU**: 2 vCPUs
- **Max Instances**: 10
- **Timeout**: 300 seconds
- **Concurrency**: 80 requests per instance
- **Execution Environment**: Gen2
- **CPU Throttling**: Disabled
- **Startup CPU Boost**: Enabled

### Health Checks

The service includes health checks at `/api/health` that:
- Verify the application is running
- Check database connectivity
- Return appropriate HTTP status codes

## Monitoring and Logs

### View Logs

```bash
# View recent logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=gemini-chat" --limit=50

# Stream logs in real-time
gcloud logging tail "resource.type=cloud_run_revision AND resource.labels.service_name=gemini-chat"
```

### Monitor Performance

1. Go to [Cloud Run Console](https://console.cloud.google.com/run)
2. Select your service
3. View metrics, logs, and revisions

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all required secrets are set in GitHub
   - Verify the Dockerfile.cloudrun is being used
   - Ensure all dependencies are properly installed

2. **Runtime Errors**
   - Check Cloud Run logs for error details
   - Verify environment variables are set correctly
   - Ensure MongoDB is accessible from Cloud Run

3. **Database Connection Issues**
   - Verify MongoDB URI is correct
   - Check network connectivity
   - Ensure MongoDB allows connections from Cloud Run IPs

4. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check that admin credentials are properly configured
   - Ensure the database initialization script runs successfully

### Debug Commands

```bash
# Check service status
gcloud run services describe gemini-chat --region=us-central1

# View service configuration
gcloud run services describe gemini-chat --region=us-central1 --format="export"

# Test the service
curl https://gemini-chat-xxxxx-uc.a.run.app/api/health
```

## Security Considerations

1. **Secrets Management**: Use Google Secret Manager for sensitive data
2. **Network Security**: Configure VPC connector if needed
3. **Authentication**: Implement proper authentication mechanisms
4. **HTTPS**: Cloud Run automatically provides HTTPS
5. **CORS**: Configure CORS settings for your domain

## Cost Optimization

1. **Min Instances**: Set to 0 for cost savings (cold starts)
2. **Max Instances**: Limit based on expected load
3. **Memory/CPU**: Right-size based on actual usage
4. **Region**: Choose closest to your users

## Scaling

Cloud Run automatically scales based on:
- Number of incoming requests
- CPU and memory usage
- Concurrency settings

To adjust scaling:

```bash
gcloud run services update gemini-chat \
  --region=us-central1 \
  --min-instances=0 \
  --max-instances=20 \
  --concurrency=100
```

## Updates and Rollbacks

### Update Service

```bash
# Deploy new version
gcloud run deploy gemini-chat --image gcr.io/$PROJECT_ID/gemini-chat:new-tag

# Rollback to previous version
gcloud run revisions list --service=gemini-chat --region=us-central1
gcloud run services update-traffic gemini-chat --to-revisions=REVISION_NAME=100
```

The GitHub Actions workflow automatically handles updates when you push to the main branch. 