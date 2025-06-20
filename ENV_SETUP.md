# Environment Variables Setup

## Admin User Credentials

You can customize the initial admin user credentials by setting these environment variables:

### Required Environment Variables

```bash
# Gemini AI API Key (Required)
export GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here

# JWT Secret (Required for production)
export JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### Optional Admin Credentials

```bash
# Admin user credentials (optional - defaults shown)
export ADMIN_USERNAME=admin
export ADMIN_PASSWORD=admin123
export ADMIN_EMAIL=admin@example.com
export ADMIN_NAME=Administrator
```

## Usage Examples

### 1. Using Default Credentials
```bash
# Just set the required variables
export GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
export JWT_SECRET=your-secret-here

# Start with default admin/admin123
docker-compose up --build
```

### 2. Using Custom Admin Credentials
```bash
# Set custom admin credentials
export ADMIN_USERNAME=myadmin
export ADMIN_PASSWORD=mypassword123
export ADMIN_EMAIL=myadmin@company.com
export ADMIN_NAME="My Admin"

# Start with custom credentials
docker-compose up --build
```

### 3. Using a .env File
Create a `.env` file in the project root:

```env
# Required
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Optional - Admin credentials
ADMIN_USERNAME=myadmin
ADMIN_PASSWORD=mypassword123
ADMIN_EMAIL=myadmin@company.com
ADMIN_NAME="My Admin"
```

Then run:
```bash
docker-compose up --build
```

## Default Values

If you don't set the optional variables, these defaults will be used:

- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@example.com`
- **Name**: `Administrator`

## Security Features

✅ **Proper Password Hashing**: 
- All passwords are properly hashed using bcrypt with 10 salt rounds
- Custom passwords work correctly and are securely stored
- No hardcoded password hashes

✅ **Environment-Based Configuration**:
- All credentials come from environment variables
- Sensible defaults if variables aren't set
- Production-ready configuration

✅ **No Data Duplication**:
- Checks for existing admin user before creating
- Safe to run multiple times
- Database persistence with Docker volumes

## Login Credentials

After the first startup, you can login with:
- **Username**: The value of `ADMIN_USERNAME` (default: `admin`)
- **Password**: The value of `ADMIN_PASSWORD` (default: `admin123`)

## Database Initialization Process

1. **MongoDB starts** → Waits for health check
2. **DB Init service runs** → Creates admin user with properly hashed password
3. **App starts** → Waits for DB init to complete
4. **Ready to use** → Login with your configured credentials

## Database Persistence

- The admin user is created only once when the database is first initialized
- Subsequent container restarts will not recreate the admin user
- Data persists in the `mongodb_data` Docker volume
- Safe to restart containers without losing data 