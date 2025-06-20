"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/useAuth"

interface LoginFormProps {
  onToggleMode: () => void
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const { login } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    console.log("📝 Form submitted with:", { username, password: "***" })

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password")
      return
    }
    
    setIsSubmitting(true)

    try {
      await login({ username: username.trim(), password })
      console.log("🎉 Login form submitted, waiting for redirect...")
    } catch (err) {
      console.error("💥 Login form error:", err)
      setError(err instanceof Error ? err.message : "Login failed")
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-xl">G</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h1>
        <p className="text-gray-600">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            disabled={isSubmitting}
            autoFocus
            autoComplete="off"
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            disabled={isSubmitting}
            autoComplete="off"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md border border-red-200">{error}</div>
        )}

        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {"Don't have an account? "}
          <button onClick={onToggleMode} className="text-blue-500 hover:text-blue-600 font-medium" type="button">
            Sign up
          </button>
        </p>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
        <p className="text-sm text-blue-800 font-medium mb-2">Demo Credentials:</p>
        <div className="text-sm text-blue-700 font-mono">admin / admin123</div>
      </div>
    </Card>
  )
}
