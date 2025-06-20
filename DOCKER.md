# Docker Setup Guide

This guide explains how to run the Gemini Chat App using Docker and Docker Compose.

## 🐳 Quick Start

### Prerequisites
- Docker Desktop installed
- Docker Compose installed
- Gemini API key

### 1. Environment Setup

Create your environment file:
\`\`\`bash
cp .env.docker .env.local
\`\`\`

Edit `.env.local` and add your Gemini API key:
\`\`\`env
GOOGLE_GENERATIVE_AI_API_KEY=your_actual_gemini_api_key_here
\`\`\`

### 2. Production Deployment

\`\`\`bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
\`\`\`

### 3. Development Mode

\`\`\`bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f app-dev

# Stop development environment
docker-compose -f docker-compose.dev.yml down
\`\`\`

## 🌐 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Chat App** | http://localhost:3000 | Main application |
| **MongoDB** | localhost:27017 | Database (admin/password123) |
| **Mongo Express** | http://localhost:8081 | Database admin UI |

## 🔧 Docker Services

### Production Services

- **app**: Next.js application (optimized build)
- **mongodb**: MongoDB 7.0 database
- **mongo-express**: Database admin interface (optional)

### Development Services

- **app-dev**: Next.js development server with hot reload
- **mongodb**: MongoDB database
- **mongo-express**: Database admin interface

## 📊 Service Management

### View Service Status
\`\`\`bash
docker-compose ps
\`\`\`

### View Logs
\`\`\`bash
# All services
docker-compose logs

# Specific service
docker-compose logs app
docker-compose logs mongodb

# Follow logs
docker-compose logs -f app
\`\`\`

### Restart Services
\`\`\`bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart app
\`\`\`

### Scale Services
\`\`\`bash
# Run multiple app instances
docker-compose up -d --scale app=3
\`\`\`

## 🗄️ Database Management

### Access MongoDB Shell
\`\`\`bash
# Connect to MongoDB container
docker-compose exec mongodb mongosh

# Or with authentication
docker-compose exec mongodb mongosh -u admin -p password123 --authenticationDatabase admin
\`\`\`

### Database Backup
\`\`\`bash
# Create backup
docker-compose exec mongodb mongodump --uri="mongodb://admin:password123@localhost:27017/gemini-chat?authSource=admin" --out=/tmp/backup

# Copy backup from container
docker cp gemini-chat-mongodb:/tmp/backup ./backup
\`\`\`

### Database Restore
\`\`\`bash
# Copy backup to container
docker cp ./backup gemini-chat-mongodb:/tmp/backup

# Restore database
docker-compose exec mongodb mongorestore --uri="mongodb://admin:password123@localhost:27017/gemini-chat?authSource=admin" /tmp/backup/gemini-chat
\`\`\`

## 🔍 Health Checks

### Application Health
\`\`\`bash
curl http://localhost:3000/api/health
\`\`\`

### MongoDB Health
\`\`\`bash
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
\`\`\`

## 🛠️ Development Workflow

### Hot Reload Development
\`\`\`bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Your code changes will automatically reload the app
# Edit files in your local directory
\`\`\`

### Debugging
\`\`\`bash
# Access app container shell
docker-compose exec app-dev sh

# View app logs in real-time
docker-compose -f docker-compose.dev.yml logs -f app-dev
\`\`\`

## 🚀 Production Deployment

### Environment Variables
Update these for production:

\`\`\`env
# Strong JWT secret
JWT_SECRET=your-super-strong-production-secret-key

# Production MongoDB URI (if using external MongoDB)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/gemini-chat

# Gemini API key
GOOGLE_GENERATIVE_AI_API_KEY=your_production_api_key
\`\`\`

### Security Considerations

1. **Change default passwords**:
   - MongoDB admin password
   - JWT secret key

2. **Use external MongoDB** for production:
   - MongoDB Atlas
   - Managed MongoDB service

3. **Enable authentication** on MongoDB:
   - Already configured in docker-compose

4. **Use HTTPS** in production:
   - Add reverse proxy (nginx, traefik)
   - SSL certificates

### Production Compose Override
\`\`\`yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    environment:
      - NODE_ENV=production
      - JWT_SECRET=your-production-secret
    restart: always
    
  mongodb:
    environment:
      MONGO_INITDB_ROOT_PASSWORD: your-strong-password
    restart: always
\`\`\`

Run with:
\`\`\`bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
\`\`\`

## 🧹 Cleanup

### Remove All Services and Data
\`\`\`bash
# Stop and remove containers, networks
docker-compose down

# Remove volumes (⚠️ This deletes all data!)
docker-compose down -v

# Remove images
docker-compose down --rmi all
\`\`\`

### Remove Development Environment
\`\`\`bash
docker-compose -f docker-compose.dev.yml down -v
\`\`\`

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use**
\`\`\`bash
# Check what's using the port
lsof -i :3000
lsof -i :27017

# Kill the process or change ports in docker-compose.yml
\`\`\`

**MongoDB Connection Issues**
\`\`\`bash
# Check MongoDB logs
docker-compose logs mongodb

# Test connection
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
\`\`\`

**App Won't Start**
\`\`\`bash
# Check app logs
docker-compose logs app

# Rebuild the image
docker-compose build --no-cache app
\`\`\`

**Permission Issues**
\`\`\`bash
# Fix file permissions
sudo chown -R $USER:$USER .
\`\`\`

### Performance Optimization

**Increase MongoDB Memory**
\`\`\`yaml
# In docker-compose.yml
mongodb:
  deploy:
    resources:
      limits:
        memory: 1G
      reservations:
        memory: 512M
\`\`\`

**App Resource Limits**
\`\`\`yaml
app:
  deploy:
    resources:
      limits:
        memory: 512M
        cpus: '0.5'
\`\`\`

## 📝 Notes

- MongoDB data persists in Docker volumes
- Admin user (admin/admin123) is created automatically
- Mongo Express provides a web UI for database management
- Health checks ensure services are running properly
- Development mode includes hot reload for faster development
