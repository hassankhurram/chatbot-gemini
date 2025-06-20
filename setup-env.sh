#!/bin/bash

# Create .env file with required environment variables
cat > .env << 'EOF'
# Required Environment Variables
# Get your Gemini API key from: https://makersuite.google.com/app/apikey
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here

# JWT Secret - Change this in production!
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Optional Admin Credentials (defaults shown)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_EMAIL=admin@example.com
ADMIN_NAME=Administrator
EOF

echo "✅ Created .env file with default values"
echo "📝 Please edit .env file and set your actual values:"
echo "   - GOOGLE_GENERATIVE_AI_API_KEY: Get from https://makersuite.google.com/app/apikey"
echo "   - JWT_SECRET: Change to a secure random string"
echo "   - ADMIN_USERNAME/ADMIN_PASSWORD: Customize if needed"
echo ""
echo "🚀 Then run: docker-compose up --build" 