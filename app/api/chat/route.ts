import { google } from "@ai-sdk/google"
import { streamText } from "ai"
import { AuthService } from "@/lib/auth"
import { ChatService } from "@/lib/chat"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    // Get authorization header
    const authHeader = req.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json({ error: "Authentication required" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const user = await AuthService.verifyToken(token)

    if (!user) {
      return Response.json({ error: "Invalid token" }, { status: 401 })
    }

    const { messages } = await req.json()

    // Save user message to database
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && lastMessage.role === "user") {
      await ChatService.saveMessage({
        id: lastMessage.id || `msg_${Date.now()}`,
        userId: user.id,
        username: user.username,
        content: lastMessage.content,
        role: "user",
        timestamp: new Date(),
        attachments: lastMessage.experimental_attachments?.map((att: any) => ({
          name: att.name,
          contentType: att.contentType,
          url: att.url,
        })),
      })
    }

    // Use Gemini model from environment variables, with a fallback
    const modelName = process.env.GEMINI_MODEL_NAME || "gemini-2.0-flash-exp"
    
    const result = streamText({
      model: google(modelName),
      messages,
      maxTokens: 4000,
      temperature: 0.7,
      onFinish: async (result) => {
        // Save AI response to database
        await ChatService.saveMessage({
          id: `ai_${Date.now()}`,
          userId: user.id,
          username: "Gemini",
          content: result.text,
          role: "assistant",
          timestamp: new Date(),
        })
      },
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
