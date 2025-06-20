"use client"

import { useState, useEffect, useCallback } from "react"
import { AuthServiceClient } from "@/lib/auth-client"
import type { LoginCredentials, RegisterCredentials, AuthState } from "@/types/auth"

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  })

  // Initialize auth state on mount
  useEffect(() => {
    console.log("🔄 Initializing auth...")

    if (typeof window !== "undefined") {
      const token = AuthServiceClient.getToken()
      const user = AuthServiceClient.getCurrentUser()

      console.log("📦 Found in localStorage:", { token: !!token, user: !!user })
      if (user) {
        console.log("👤 User details from localStorage:", { 
          id: user.id, 
          username: user.username, 
          email: user.email, 
          name: user.name 
        })
      }

      if (token && user) {
        console.log("✅ Restoring auth state for:", user.username)
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        })
      } else {
        console.log("🔓 No stored auth found")
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })
      }
    } else {
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    console.log("🔐 Login attempt:", credentials.username)

    try {
      const response = await AuthServiceClient.login(credentials)
      console.log("✅ Login successful:", response.user)
      console.log("🔍 Response user details:", {
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
        name: response.user.name,
      })

      // Show loader for 5 seconds after successful login
      setTimeout(() => {
        console.log("✅ Login successful, redirecting to dashboard...")
        const newState = {
          user: response.user,
          token: response.token,
          isAuthenticated: true,
          isLoading: false,
        }
        setAuthState(newState)
      }, 5000)

      return response
    } catch (error) {
      console.error("❌ Login failed:", error)
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }, [])

  const logout = useCallback(() => {
    console.log("🚪 Logging out...")
    AuthServiceClient.logout()
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }, [])

  const register = useCallback(async (credentials: RegisterCredentials) => {
    throw new Error("Registration not implemented")
  }, [])

  const refreshToken = useCallback(async () => {
    throw new Error("Token refresh not implemented")
  }, [])

  // Debug logging
  useEffect(() => {
    console.log("🔍 Auth state changed:", {
      isAuthenticated: authState.isAuthenticated,
      hasUser: !!authState.user,
      hasToken: !!authState.token,
      isLoading: authState.isLoading,
      username: authState.user?.username,
      userId: authState.user?.id,
    })
  }, [authState])

  return {
    ...authState,
    login,
    register,
    logout,
    refreshToken,
  }
}
