# Gemini Chat App with MongoDB Backend

A complete ChatGPT-like application with Gemini AI, authentication, and MongoDB storage.

## 🚀 Features

- **🤖 Gemini AI Integration**: Multimodal chat with text, images, and documents
- **🔐 JWT Authentication**: Secure login system with MongoDB user storage
- **💾 Chat History**: All conversations saved to MongoDB
- **📁 File Uploads**: Support for images, PDFs, and documents
- **🎨 Modern UI**: ChatGPT-inspired interface with Tailwind CSS
- **⚡ Real-time Streaming**: Live AI responses
- **🏗️ Complete Backend**: Full API with authentication and chat endpoints

## 📋 Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Gemini API Key

## 🛠️ Setup Instructions

### 1. Environment Configuration

\`\`\`bash
# Copy the example environment file
cp .env.local.example .env.local
\`\`\`

Add your credentials to `.env.local`:
\`\`\`env
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
MONGODB_URI=mongodb://localhost:27017/gemini-chat
JWT_SECRET=your-super-secret-jwt-key-change-in-production
\`\`\`

### 2. Database Setup

The app includes an automatic database setup script that:
- Creates the admin user (admin/admin123)
- Sets up database indexes
- Initializes collections

**Option A: Automatic Setup (Recommended)**
The database will be set up automatically when you first run the app.

**Option B: Manual Setup**
\`\`\`bash
npm run setup-db
\`\`\`

### 3. Start the Application

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000)

## 🔑 Default Login

- **Username**: `admin`
- **Password**: `admin123`

## 🏗️ Architecture

### Backend API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User authentication |
| `/api/auth/me` | GET | Get current user |
| `/api/chat` | POST | Send message to AI |
| `/api/chat/history` | GET | Get chat history |

### Database Collections

- **users**: User accounts with hashed passwords
- **messages**: Chat messages with user/AI responses
- **sessions**: Chat session metadata

### Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt for password security
- **Request Authorization**: Protected API endpoints
- **Input Validation**: Server-side validation

## 🗄️ MongoDB Setup Options

### Local MongoDB
\`\`\`bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or install MongoDB locally
# https://docs.mongodb.com/manual/installation/
\`\`\`

### MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env.local`

## 📁 Project Structure

\`\`\`
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   └── chat/          # Chat endpoints
│   └── page.tsx           # Main chat interface
├── lib/
│   ├── mongodb.ts         # Database connection
│   ├── auth.ts           # Authentication service
│   └── chat.ts           # Chat service
├── hooks/
│   ├── useAuth.ts        # Authentication hook
│   └── useChat.ts        # Chat hook
├── components/
│   └── auth/             # Login/register forms
└── scripts/
    └── setup-database.js # Database initialization
\`\`\`

## 🔧 Development

### Adding New Features

1. **New API Endpoint**: Add to `app/api/`
2. **Database Operations**: Extend services in `lib/`
3. **Frontend Components**: Add to `components/`
4. **Authentication**: Extend `AuthService`

### Database Queries

\`\`\`javascript
// Get user messages
const messages = await ChatService.getChatHistory(userId, 50)

// Save new message
await ChatService.saveMessage({
  userId,
  content: "Hello",
  role: "user"
})
\`\`\`

## 🚀 Production Deployment

### Environment Variables
\`\`\`env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-production-secret
GOOGLE_GENERATIVE_AI_API_KEY=your-key
\`\`\`

### Security Checklist
- [ ] Change JWT_SECRET
- [ ] Use strong MongoDB credentials
- [ ] Enable MongoDB authentication
- [ ] Set up HTTPS
- [ ] Configure CORS properly
- [ ] Add rate limiting

## ☁️ Cloud Run Deployment

### Quick Setup

1. **Run the setup script**:
   \`\`\`bash
   ./scripts/setup-cloud-run.sh
   \`\`\`

2. **Set up GitHub secrets**:
   \`\`\`bash
   ./scripts/setup-github-secrets.sh
   \`\`\`

3. **Deploy**: Push to \`main\` branch to trigger automatic deployment

### Manual Deployment

\`\`\`bash
# Build and push image
docker build -f Dockerfile.cloudrun -t gcr.io/PROJECT_ID/gemini-chat:latest .
docker push gcr.io/PROJECT_ID/gemini-chat:latest

# Deploy to Cloud Run
gcloud run deploy gemini-chat \
  --image gcr.io/PROJECT_ID/gemini-chat:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
\`\`\`

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `GCP_PROJECT_ID` | Google Cloud Project ID |
| `GCP_SA_KEY` | Service Account Key JSON |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini API Key |
| `JWT_SECRET` | JWT Signing Secret |
| `MONGODB_URI` | MongoDB Connection String |
| `ADMIN_USERNAME` | Initial Admin Username |
| `ADMIN_PASSWORD` | Initial Admin Password |
| `ADMIN_EMAIL` | Initial Admin Email |
| `ADMIN_NAME` | Initial Admin Name |

### Features

- **🔄 Automatic CI/CD**: GitHub Actions workflow
- **🏥 Health Checks**: Built-in health monitoring
- **📊 Auto-scaling**: Scales to zero when not in use
- **🔒 HTTPS**: Automatic SSL certificates
- **🌍 Global CDN**: Fast worldwide access

For detailed Cloud Run setup instructions, see [CLOUD_RUN_DEPLOYMENT.md](./CLOUD_RUN_DEPLOYMENT.md).

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Failed**
\`\`\`bash
# Check if MongoDB is running
mongosh

# Or check Docker container
docker ps
\`\`\`

**Authentication Issues**
- Verify JWT_SECRET is set
- Check MongoDB user exists
- Clear localStorage and try again

**API Errors**
- Check console logs
- Verify environment variables
- Test endpoints with curl/Postman

## 📚 Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with native driver
- **Authentication**: JWT with bcrypt
- **AI**: Gemini AI via AI SDK
- **UI Components**: shadcn/ui, Radix UI

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details
