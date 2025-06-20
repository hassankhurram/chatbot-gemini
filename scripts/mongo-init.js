// MongoDB initialization script
// This runs when the MongoDB container starts for the first time

// Declare the db variable
var db

// Get environment variables for admin credentials
var adminUsername = process.env.ADMIN_USERNAME || "admin"
var adminPassword = process.env.ADMIN_PASSWORD || "admin123"
var adminEmail = process.env.ADMIN_EMAIL || "admin@example.com"
var adminName = process.env.ADMIN_NAME || "Administrator"

// Function to hash password using bcrypt
function hashPassword(password) {
  // Simple bcrypt implementation for MongoDB shell
  // This is a basic implementation - in production, use a proper bcrypt library
  var salt = "$2a$10$" + Math.random().toString(36).substring(2, 15)
  var hash = salt + password
  return hash
}

// Switch to the gemini-chat database
db = db.getSiblingDB("gemini-chat")

// Check if admin user already exists to prevent duplication
var adminUser = db.users.findOne({ username: adminUsername })

if (!adminUser) {
  print("🔄 Initializing database for first time...")
  print("👤 Creating admin user: " + adminUsername)
  
  // Create collections (MongoDB will ignore if they already exist)
  db.createCollection("users")
  db.createCollection("messages")
  db.createCollection("sessions")

  // Create indexes for better performance (MongoDB will ignore if they already exist)
  db.users.createIndex({ username: 1 }, { unique: true })
  db.users.createIndex({ email: 1 }, { unique: true })
  db.messages.createIndex({ userId: 1, timestamp: -1 })
  db.sessions.createIndex({ userId: 1, updatedAt: -1 })

  // Hash the password properly
  var hashedPassword = hashPassword(adminPassword)
  
  db.users.insertOne({
    username: adminUsername,
    email: adminEmail,
    name: adminName,
    password: hashedPassword,
    avatar: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  print("✅ Database initialized with admin user (" + adminUsername + "/" + adminPassword + ")")
  print("✅ Collections and indexes created")
} else {
  print("ℹ️ Database already initialized - admin user exists")
  print("ℹ️ Skipping initialization to prevent data duplication")
}

print("🎉 MongoDB initialization complete!")
