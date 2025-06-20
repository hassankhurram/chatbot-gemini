import type { User, LoginCredentials, AuthResponse } from "@/types/auth"
import { getDatabase } from "./mongodb"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

// Auth service for server-side operations
export class AuthService {
  // Server-side login (for API routes)
  static async loginServer(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const db = await getDatabase()
      const usersCollection = db.collection("users")

      // Find user by username
      const user = await usersCollection.findOne({ username: credentials.username })

      if (!user) {
        throw new Error("Invalid username or password")
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(credentials.password, user.password)

      if (!isValidPassword) {
        throw new Error("Invalid username or password")
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: "24h" })

      // Return user without password
      const { password, ...userWithoutPassword } = user

      // Ensure all required fields are present and properly formatted
      const userResponse: User = {
        id: user._id.toString(),
        username: user.username || "",
        email: user.email || "",
        name: user.name || "",
        avatar: user.avatar || undefined,
        createdAt: user.createdAt || new Date(),
        updatedAt: user.updatedAt || undefined,
      }

      console.log("🔍 User response object:", userResponse)

      return {
        user: userResponse,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }
    } catch (error) {
      console.error("AuthService server login error:", error)
      throw error
    }
  }

  // Verify JWT token and get user (server-side)
  static async verifyToken(token: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      if (!decoded.userId) {
        return null
      }
      
      const db = await getDatabase()
      const usersCollection = db.collection("users")

      const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) })

      if (!user) return null

      // Ensure 'id' is a string
      const userResponse: User = {
        id: user._id.toString(),
        username: user.username || "",
        email: user.email || "",
        name: user.name || "",
        avatar: user.avatar || undefined,
        createdAt: user.createdAt || new Date(),
        updatedAt: user.updatedAt || undefined,
      }
      return userResponse
    } catch {
      return null
    }
  }
}
