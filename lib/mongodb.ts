import { MongoClient, type Db } from "mongodb"

let client: MongoClient
let clientPromise: Promise<MongoClient>

export async function getDatabase(): Promise<Db> {
  if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
  }

  if (!clientPromise) {
    const uri = process.env.MONGODB_URI
    const options = {}

    if (process.env.NODE_ENV === "development") {
      // In development mode, use a global variable so that the value
      // is preserved across module reloads caused by HMR (Hot Module Replacement).
      const globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>
      }

      if (!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(uri, options)
        globalWithMongo._mongoClientPromise = client.connect()
      }
      clientPromise = globalWithMongo._mongoClientPromise
    } else {
      // In production mode, it's best to not use a global variable.
      client = new MongoClient(uri, options)
      clientPromise = client.connect()
    }
  }

  const mongoClient = await clientPromise
  return mongoClient.db("gemini-chat")
}

// Export a module-scoped MongoClient promise for backward compatibility
export default getDatabase().then(db => db.client)
