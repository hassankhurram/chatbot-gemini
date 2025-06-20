# Cloud Run Deployment Files Summary

This document provides an overview of all the files created for Cloud Run deployment.

## 📁 Files Created

### GitHub Actions Workflows

| File | Purpose |
|------|---------|
| `.github/workflows/deploy-cloud-run.yml` | Main deployment workflow for Cloud Run |
| `.github/workflows/test.yml` | Testing workflow for pull requests |

### Docker Configuration

| File | Purpose |
|------|---------|
| `Dockerfile.cloudrun` | Cloud Run optimized Dockerfile |
| `.dockerignore` | Optimized ignore file for faster builds |

### Cloud Run Configuration

| File | Purpose |
|------|---------|
| `cloud-run-service.yaml` | Cloud Run service configuration |
| `app/api/health/route.ts` | Health check endpoint for Cloud Run |

### Setup Scripts

| File | Purpose |
|------|---------|
| `scripts/setup-cloud-run.sh` | Google Cloud setup script |
| `scripts/setup-github-secrets.sh` | GitHub secrets configuration script |

### Documentation

| File | Purpose |
|------|---------|
| `CLOUD_RUN_DEPLOYMENT.md` | Comprehensive deployment guide |
| `CLOUD_RUN_SUMMARY.md` | This summary file |

## 🚀 Quick Start

1. **Setup Google Cloud**:
   ```bash
   ./scripts/setup-cloud-run.sh
   ```

2. **Configure GitHub Secrets**:
   ```bash
   ./scripts/setup-github-secrets.sh
   ```

3. **Deploy**:
   ```bash
   git push origin main
   ```

## 🔧 Configuration

### Environment Variables

The following environment variables are automatically configured in Cloud Run:

- `NODE_ENV=production`
- `PORT=8080`
- `HOSTNAME=0.0.0.0`
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `JWT_SECRET`
- `MONGODB_URI`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_EMAIL`
- `ADMIN_NAME`

### Cloud Run Settings

- **Memory**: 2GB
- **CPU**: 2 vCPUs
- **Max Instances**: 10
- **Timeout**: 300 seconds
- **Concurrency**: 80 requests per instance
- **Execution Environment**: Gen2
- **CPU Throttling**: Disabled
- **Startup CPU Boost**: Enabled

## 🔍 Monitoring

### Health Checks

The application includes health checks at `/api/health` that:
- Verify the application is running
- Check database connectivity
- Return appropriate HTTP status codes

### Logs

View logs using:
```bash
gcloud logging tail "resource.type=cloud_run_revision AND resource.labels.service_name=gemini-chat"
```

## 🔒 Security

### Required Permissions

The GitHub Actions service account needs:
- `roles/run.admin` - Deploy to Cloud Run
- `roles/storage.admin` - Push Docker images
- `roles/iam.serviceAccountUser` - Use service accounts
- `roles/cloudbuild.builds.builder` - Build Docker images

### Secrets Management

All sensitive data is stored as GitHub secrets and injected as environment variables in Cloud Run.

## 📊 Performance

### Optimization Features

- **Multi-stage Docker builds** for smaller images
- **Standalone Next.js output** for faster startup
- **Health checks** for better reliability
- **Auto-scaling** based on demand
- **CPU boost** for faster cold starts

### Cost Optimization

- **Scales to zero** when not in use
- **Configurable max instances** to control costs
- **Efficient resource allocation** with right-sized containers

## 🛠️ Troubleshooting

### Common Issues

1. **Build Failures**: Check GitHub Actions logs
2. **Runtime Errors**: Check Cloud Run logs
3. **Database Issues**: Verify MongoDB connectivity
4. **Authentication**: Check environment variables

### Debug Commands

```bash
# Check service status
gcloud run services describe gemini-chat --region=us-central1

# View logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=gemini-chat"

# Test health endpoint
curl https://gemini-chat-xxxxx-uc.a.run.app/api/health
```

## 📚 Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [MongoDB Atlas](https://www.mongodb.com/atlas) (Recommended for production) 