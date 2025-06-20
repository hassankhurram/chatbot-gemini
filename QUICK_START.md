# Quick Start Guide

## 1. Set Up Environment Variables

Copy the example environment file and customize it:

```bash
cp env.example .env
```

Then edit `.env` and set your actual values:

```env
# Required - Get your API key from: https://makersuite.google.com/app/apikey
GOOGLE_GENERATIVE_AI_API_KEY=your_actual_gemini_api_key_here

# Required - Change this in production!
JWT_SECRET=your_actual_secure_jwt_secret_here

# Optional - Admin credentials (defaults shown)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_EMAIL=admin@example.com
ADMIN_NAME=Administrator
```

## 2. Start the Application

```bash
docker-compose up --build
```

## 3. Access the Application

- **Frontend**: http://localhost:3000
- **MongoDB Admin**: http://localhost:8081 (optional)
- **Login Credentials**: Use the values from your `.env` file

## 4. Default Login

If you didn't change the admin credentials:
- **Username**: `admin`
- **Password**: `admin123`

## What Happens

1. **MongoDB starts** → Database server
2. **DB Init runs** → Creates admin user with your credentials
3. **App starts** → Next.js application
4. **Ready to use** → Login with your configured credentials

## Troubleshooting

### Missing .env file
```bash
cp env.example .env
# Edit .env with your values
```

### Build fails
```bash
docker-compose down
docker-compose up --build
```

### Database issues
```bash
docker-compose down -v  # Removes volumes
docker-compose up --build
``` 