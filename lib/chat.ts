import { getDatabase } from "./mongodb"
import type { ObjectId } from "mongodb"

export interface ChatMessage {
  _id?: ObjectId
  id: string
  userId: string
  username: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  attachments?: Array<{
    name: string
    contentType: string
    url: string
  }>
}

export interface ChatSession {
  _id?: ObjectId
  id: string
  userId: string
  title: string
  createdAt: Date
  updatedAt: Date
  messageCount: number
}

export class ChatService {
  // Save a message to the database
  static async saveMessage(message: Omit<ChatMessage, "_id">): Promise<ChatMessage> {
    try {
      const db = await getDatabase()
      const messagesCollection = db.collection("messages")

      const result = await messagesCollection.insertOne({
        ...message,
        timestamp: new Date(),
      })

      return {
        _id: result.insertedId,
        ...message,
      }
    } catch (error) {
      console.error("Error saving message:", error)
      throw error
    }
  }

  // Get chat history for a user
  static async getChatHistory(userId: string, limit = 50): Promise<ChatMessage[]> {
    try {
      const db = await getDatabase()
      const messagesCollection = db.collection("messages")

      const messages = await messagesCollection.find({ userId }).sort({ timestamp: -1 }).limit(limit).toArray()

      return messages
        .map((msg) => ({
          ...msg,
          id: msg._id?.toString() || msg.id,
        }))
        .reverse() // Reverse to show oldest first
    } catch (error) {
      console.error("Error getting chat history:", error)
      throw error
    }
  }

  // Create or update chat session
  static async updateChatSession(userId: string, sessionId?: string): Promise<ChatSession> {
    try {
      const db = await getDatabase()
      const sessionsCollection = db.collection("sessions")

      if (sessionId) {
        // Update existing session
        const result = await sessionsCollection.findOneAndUpdate(
          { id: sessionId, userId },
          {
            $set: { updatedAt: new Date() },
            $inc: { messageCount: 1 },
          },
          { returnDocument: "after" },
        )

        if (result) {
          return {
            ...result,
            id: result._id?.toString() || result.id,
          }
        }
      }

      // Create new session
      const newSession = {
        id: `session_${Date.now()}`,
        userId,
        title: "New Chat",
        createdAt: new Date(),
        updatedAt: new Date(),
        messageCount: 1,
      }

      const result = await sessionsCollection.insertOne(newSession)

      return {
        _id: result.insertedId,
        ...newSession,
      }
    } catch (error) {
      console.error("Error updating chat session:", error)
      throw error
    }
  }
}
