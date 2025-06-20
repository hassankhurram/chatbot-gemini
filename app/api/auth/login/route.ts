import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const credentials = await request.json()
    console.log("🔐 Login request received:", { username: credentials.username, password: "***" })

    // Validate input
    if (!credentials.username || !credentials.password) {
      console.log("❌ Missing credentials:", { hasUsername: !!credentials.username, hasPassword: !!credentials.password })
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    console.log("✅ Credentials validated, calling AuthService.loginServer")
    const authResponse = await AuthService.loginServer(credentials)
    console.log("✅ AuthService.loginServer completed successfully")

    return NextResponse.json(authResponse)
  } catch (error) {
    console.error("❌ Login API error:", error)

    const message = error instanceof Error ? error.message : "Login failed"
    return NextResponse.json({ error: message }, { status: 401 })
  }
}
