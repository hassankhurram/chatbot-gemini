const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")

async function setupDatabase() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/gemini-chat"
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("✅ Connected to MongoDB")

    const db = client.db("gemini-chat")

    // Create users collection with admin user
    const usersCollection = db.collection("users")

    // Check if admin user exists
    const existingAdmin = await usersCollection.findOne({ username: "admin" })

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10)

      await usersCollection.insertOne({
        username: "admin",
        email: "admin@example.com",
        name: "Administrator",
        password: hashedPassword,
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      console.log("✅ Created admin user (admin/admin123)")
    } else {
      console.log("ℹ️ Admin user already exists")
    }

    // Create indexes for better performance
    await usersCollection.createIndex({ username: 1 }, { unique: true })
    await usersCollection.createIndex({ email: 1 }, { unique: true })

    const messagesCollection = db.collection("messages")
    await messagesCollection.createIndex({ userId: 1, timestamp: -1 })

    const sessionsCollection = db.collection("sessions")
    await sessionsCollection.createIndex({ userId: 1, updatedAt: -1 })

    console.log("✅ Database indexes created")
    console.log("🎉 Database setup complete!")
  } catch (error) {
    console.error("❌ Database setup error:", error)
  } finally {
    await client.close()
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase()
}

module.exports = { setupDatabase }
