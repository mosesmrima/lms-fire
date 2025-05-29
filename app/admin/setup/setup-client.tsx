"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2, Shield } from "lucide-react"
import { ROLES } from "@/lib/types/roles"

export default function SetupClient() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [setupStatus, setSetupStatus] = useState<{
    isSetupComplete: boolean
    adminCount: number
  } | null>(null)
  const [checkingStatus, setCheckingStatus] = useState(true)

  // Check setup status on mount
  useEffect(() => {
    checkSetupStatus()
  }, [])

  const checkSetupStatus = async () => {
    try {
      const response = await fetch("/api/admin/setup")
      const data = await response.json()
      
      if (data.success) {
        setSetupStatus(data)
      } else {
        setError("Failed to check setup status")
      }
    } catch (error) {
      setError("Failed to check setup status")
    } finally {
      setCheckingStatus(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch("/api/admin/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
          setSuccess(true)
          setEmail("")
        setPassword("")
        // Refresh setup status
        checkSetupStatus()
        } else {
          setError(data.error || "Failed to set up admin user")
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (checkingStatus) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (setupStatus?.isSetupComplete) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <Shield className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Setup Complete</AlertTitle>
        <AlertDescription className="text-green-700">
          Admin setup is already complete. There {setupStatus.adminCount === 1 ? "is" : "are"} {setupStatus.adminCount} admin {setupStatus.adminCount === 1 ? "user" : "users"} in the system.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6 max-w-md">
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Important Note</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                This page is for setting up the first admin user. The email and password you enter will be used to create
                an admin account. Make sure to use a secure password and keep it safe.
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            required
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password (min 8 characters)"
            required
            minLength={8}
            className="mt-1"
          />
          <p className="mt-1 text-sm text-gray-500">
            Password must be at least 8 characters long
          </p>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Setting Up Admin...
            </>
          ) : (
            "Set Up Admin"
          )}
        </Button>
      </form>

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success!</AlertTitle>
          <AlertDescription className="text-green-700">
            Admin user has been created successfully. You can now sign in with this account to access admin features.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Error</AlertTitle>
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
