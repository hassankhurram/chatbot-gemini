const { MongoClient } = require('mongodb');

async function debugAuth() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://admin:password123@localhost:27017/gemini-chat?authSource=admin";
  
  const client = new MongoClient(mongoUri);
  
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
    
    const db = client.db("gemini-chat");
    
    // Check if users collection exists
    const collections = await db.listCollections().toArray();
    console.log("📋 Collections:", collections.map(c => c.name));
    
    // Check if admin user exists
    const adminUser = await db.collection("users").findOne({ username: "admin" });
    
    if (adminUser) {
      console.log("✅ Admin user found:");
      console.log("  - _id:", adminUser._id);
      console.log("  - username:", adminUser.username);
      console.log("  - email:", adminUser.email);
      console.log("  - name:", adminUser.name);
      console.log("  - createdAt:", adminUser.createdAt);
      console.log("  - updatedAt:", adminUser.updatedAt);
      
      // Test the exact query that the auth service uses
      const userByUsername = await db.collection("users").findOne({ username: "admin" });
      console.log("🔍 User by username query result:", {
        found: !!userByUsername,
        username: userByUsername?.username,
        id: userByUsername?._id,
        idType: typeof userByUsername?._id,
        idString: userByUsername?._id?.toString()
      });
      
    } else {
      console.log("❌ Admin user not found");
      
      // List all users
      const allUsers = await db.collection("users").find({}).toArray();
      console.log("👥 All users in database:", allUsers.length);
      allUsers.forEach((user, index) => {
        console.log(`  User ${index + 1}:`, {
          _id: user._id,
          username: user.username,
          email: user.email,
          name: user.name
        });
      });
    }
    
  } catch (error) {
    console.error("❌ Debug error:", error);
  } finally {
    await client.close();
  }
}

// Run if called directly
if (require.main === module) {
  debugAuth();
}

module.exports = { debugAuth }; 