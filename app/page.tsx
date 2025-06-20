"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Send, ImageIcon, FileText, X } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/hooks/useAuth"
import { useChat } from "@/hooks/useChat"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"

export default function Chat() {
  const { user, isAuthenticated, isLoading: authLoading, logout, token } = useAuth()
  const [authMode, setAuthMode] = useState<"login" | "register">("login")

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({ token })

  const [files, setFiles] = useState<FileList | undefined>(undefined)
  const [previews, setPreviews] = useState<Array<{ file: File; preview: string; type: string }>>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (selectedFiles) {
      setFiles(selectedFiles)

      const newPreviews: Array<{ file: File; preview: string; type: string }> = []
      Array.from(selectedFiles).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          newPreviews.push({
            file,
            preview: e.target?.result as string,
            type: file.type,
          })
          if (newPreviews.length === selectedFiles.length) {
            setPreviews(newPreviews)
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeFile = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index)
    setPreviews(newPreviews)

    if (fileInputRef.current) {
      const dt = new DataTransfer()
      newPreviews.forEach((preview) => dt.items.add(preview.file))
      fileInputRef.current.files = dt.files
      setFiles(dt.files)
    }
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    handleSubmit(event, {
      experimental_attachments: files,
    })

    setFiles(undefined)
    setPreviews([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith("image/")) return <ImageIcon className="w-4 h-4" />
    if (contentType === "application/pdf") return <FileText className="w-4 h-4" />
    return <FileText className="w-4 h-4" />
  }

  console.log("🖥️ Rendering Chat component:", {
    isLoading: authLoading,
    isAuthenticated,
    hasUser: !!user,
    username: user?.username,
  })

  // Loading state
  if (authLoading) {
    console.log("⏳ Showing loading state")
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">G</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Not authenticated - show login/register
  if (!isAuthenticated) {
    console.log("🔓 Showing auth forms")
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        {authMode === "login" ? (
          <LoginForm onToggleMode={() => setAuthMode("register")} />
        ) : (
          <RegisterForm onToggleMode={() => setAuthMode("login")} />
        )}
      </div>
    )
  }

  // Authenticated - show chat
  console.log("✅ Showing chat interface")
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              GenZ Gemini Chat
            </h1>
            <p className="text-sm text-gray-600 mt-1">Welcome, {user?.name} • Upload images, documents, and more</p>
          </div>
          <Button onClick={logout} variant="outline" className="bg-white text-gray-700 hover:bg-gray-50">
            Sign Out
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome to GenZ Gemini Chat</h2>
              <p className="text-gray-600 mb-6">
                Start a conversation with GenZ Gemini AI. You can send text, upload images, or share documents.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <ImageIcon className="w-8 h-8 text-blue-500 mb-2" />
                  <h3 className="font-medium mb-1">Image Analysis</h3>
                  <p className="text-sm text-gray-600">Upload images for AI analysis and description</p>
                </Card>
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <FileText className="w-8 h-8 text-green-500 mb-2" />
                  <h3 className="font-medium mb-1">Document Chat</h3>
                  <p className="text-sm text-gray-600">Upload PDFs and ask questions about content</p>
                </Card>
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <Send className="w-8 h-8 text-purple-500 mb-2" />
                  <h3 className="font-medium mb-1">Text Conversation</h3>
                  <p className="text-sm text-gray-600">Have natural conversations with Gemini AI</p>
                </Card>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-3xl ${message.role === "user" ? "bg-blue-500 text-white" : "bg-white text-gray-800"} rounded-2xl px-4 py-3 shadow-sm`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>

                    {message.experimental_attachments && (
                      <div className="mt-3 space-y-2">
                        {message.experimental_attachments
                          .filter(
                            (attachment) =>
                              attachment?.contentType?.startsWith("image/") ||
                              attachment?.contentType?.startsWith("application/pdf"),
                          )
                          .map((attachment, index) => (
                            <div key={`${message.id}-${index}`} className="border rounded-lg overflow-hidden">
                              {attachment.contentType?.startsWith("image/") ? (
                                <Image
                                  src={attachment.url || "/placeholder.svg"}
                                  width={300}
                                  height={200}
                                  alt={attachment.name ?? `attachment-${index}`}
                                  className="rounded-lg object-cover"
                                />
                              ) : attachment.contentType?.startsWith("application/pdf") ? (
                                <div className="p-3 bg-gray-50 flex items-center gap-2">
                                  <FileText className="w-5 h-5 text-red-500" />
                                  <span className="text-sm font-medium">{attachment.name}</span>
                                </div>
                              ) : null}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">GenZ Gemini is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {previews.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2 pr-8">
                      {getFileIcon(preview.type)}
                      <span className="text-sm font-medium truncate max-w-32">{preview.file.name}</span>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={onSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <Textarea
                value={input}
                onChange={handleInputChange}
                placeholder="Message Gemini..."
                className="min-h-[50px] max-h-32 resize-none pr-12"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    onSubmit(e as any)
                  }
                }}
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept="image/*,application/pdf,.txt,.doc,.docx"
                className="hidden"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="absolute right-2 top-2 h-8 w-8 p-0"
              >
                <Upload className="w-4 h-4" />
              </Button>
            </div>
            <Button
              type="submit"
              disabled={isLoading || (!input.trim() && !files?.length)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>

          <p className="text-xs text-gray-500 mt-2 text-center">
           GenZ Gemini can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  )
}
