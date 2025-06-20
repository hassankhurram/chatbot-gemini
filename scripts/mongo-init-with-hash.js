const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function initializeDatabase() {
  // Get environment variables for admin credentials
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminName = process.env.ADMIN_NAME || "Administrator";
  
  const mongoUri = process.env.MONGODB_URI || "mongodb://admin:password123@localhost:27017/gemini-chat?authSource=admin";
  
  const client = new MongoClient(mongoUri);
  
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
    
    const db = client.db("gemini-chat");

    // Hash the password properly with bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    // Upsert admin user
    const upsertResult = await db.collection("users").updateOne(
      { username: adminUsername },
      {
        $set: {
          username: adminUsername,
          email: adminEmail,
          name: adminName,
          password: hashedPassword,
          avatar: null,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        }
      },
      { upsert: true }
    );

    if (upsertResult.upsertedCount > 0) {
      console.log(`✅ Admin user created: ${adminUsername}`);
    } else if (upsertResult.modifiedCount > 0) {
      console.log(`✅ Admin user updated: ${adminUsername}`);
    } else {
      console.log(`ℹ️ Admin user already up-to-date: ${adminUsername}`);
    }

    // Ensure indexes
    await db.collection("users").createIndex({ username: 1 }, { unique: true });
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
    await db.collection("messages").createIndex({ userId: 1, timestamp: -1 });
    await db.collection("sessions").createIndex({ userId: 1, updatedAt: -1 });

    console.log("✅ Collections and indexes ensured");
    console.log("🎉 MongoDB initialization complete!");
  } catch (error) {
    console.error("❌ Database initialization error:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };