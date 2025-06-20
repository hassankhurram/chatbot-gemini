import type { User, LoginCredentials, AuthResponse } from "@/types/auth"

// Client-side only auth service
export class AuthServiceClient {
  private static readonly TOKEN_KEY = "auth_token"
  private static readonly USER_KEY = "auth_user"

  // Client-side login (calls API)
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log("AuthServiceClient.login called with:", credentials)

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || "Login failed")
      }

      const authResponse = await response.json()
      console.log("Login API response:", authResponse)

      // Store auth data
      if (typeof window !== "undefined") {
        console.log("💾 Storing auth data in localStorage...")
        localStorage.setItem(this.TOKEN_KEY, authResponse.token)
        localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user))
        
        // Verify storage
        const storedToken = localStorage.getItem(this.TOKEN_KEY)
        const storedUser = localStorage.getItem(this.USER_KEY)
        console.log("✅ Verification - Stored in localStorage:", { 
          token: !!storedToken, 
          user: !!storedUser,
          tokenLength: storedToken?.length,
          userData: storedUser ? JSON.parse(storedUser) : null
        })
      }

      return authResponse
    } catch (error) {
      console.error("AuthServiceClient login error:", error)
      throw error
    }
  }

  // Get current user from storage
  static getCurrentUser(): User | null {
    try {
      if (typeof window === "undefined") return null
      const userStr = localStorage.getItem(this.USER_KEY)
      return userStr ? JSON.parse(userStr) : null
    } catch {
      return null
    }
  }

  // Get current token
  static getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(this.TOKEN_KEY)
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const token = this.getToken()
    const user = this.getCurrentUser()
    return !!(token && user)
  }

  // Logout
  static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
  }
} 