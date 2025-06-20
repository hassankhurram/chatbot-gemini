"use client"

import { useChat as useAIChat } from "@ai-sdk/react"
import { useAuth } from "./useAuth"

export function useChat(options: { token: string | null }) {
  return useAIChat({
    api: "/api/chat",
    headers: {
      ...(options.token && { Authorization: `Bearer ${options.token}` }),
    },
  })
}
