"use client"
import { Card } from "@/components/ui/card"

interface RegisterFormProps {
  onToggleMode: () => void
}

export function RegisterForm({ onToggleMode }: RegisterFormProps) {
  return (
    <Card className="w-full max-w-md p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-xl">G</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h1>
        <p className="text-gray-600">Sign up for a new account</p>
      </div>

      {/* Coming Soon Message */}
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">🚧</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Coming Soon</h2>
        <p className="text-gray-500 mb-6">
          User registration is currently under development. Please use one of the demo accounts to get started.
        </p>

        <div className="p-4 bg-blue-50 rounded-md mb-6">
          <p className="text-sm text-blue-800 font-medium mb-2">Demo Credentials:</p>
          <div className="text-xs text-blue-600 space-y-1">
            <div>admin / admin123</div>
            <div>user / user123</div>
            <div>demo / demo123</div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <button onClick={onToggleMode} className="text-blue-500 hover:text-blue-600 font-medium">
            Sign in
          </button>
        </p>
      </div>
    </Card>
  )
}
