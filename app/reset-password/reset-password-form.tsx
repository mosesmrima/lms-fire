"use client"

import { useState, useEffect } from "react"
import { Button, Input, addToast, Spinner } from "@heroui/react"

import { ArrowLeft, CheckCircle, Eye, EyeOff, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePasswordResetMutations } from "@/lib/services/auth"

interface ResetPasswordFormProps {
  oobCode?: string
}

export function ResetPasswordForm({ oobCode }: ResetPasswordFormProps) {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [email, setEmail] = useState("")
  const { verifyToken, completeReset, isVerifying, isCompleting } = usePasswordResetMutations()

  // Verify the reset token when the component mounts
  useEffect(() => {
    if (!oobCode) return

    verifyToken(oobCode, {
      onSuccess: (userEmail) => {
        setEmail(userEmail)
      },
      onError: (error) => {
        console.error("Invalid or expired reset token:", error)
        addToast({
          title: "Error",
          description: "This password reset link is invalid or has expired. Please request a new one.",
          timeout: 3000,
          shouldShowTimeoutProgress: true
        })
      }
    })
  }, [oobCode, verifyToken])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate passwords
    if (password !== confirmPassword) {
      addToast({
        title: "Error",
        description: "Passwords don't match",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
      return
    }

    if (password.length < 8) {
      addToast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
      return
    }

    if (!oobCode) {
      addToast({
        title: "Error",
        description: "Reset code is missing",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
      return
    }

    completeReset(
      { actionCode: oobCode, newPassword: password },
      {
        onSuccess: () => {
          setIsSuccess(true)
          addToast({
            title: "Success",
            description: "Password has been reset successfully!",
            timeout: 3000,
            shouldShowTimeoutProgress: true
          })
        },
        onError: (error) => {
          console.error("Password reset error:", error)
          addToast({
            title: "Error",
            description: "Failed to reset password. Please try again.",
            timeout: 3000,
            shouldShowTimeoutProgress: true
          })
        }
      }
    )
  }

  if (isVerifying) {
    return (
      <div className="bg-[#111111] border border-[#333333] rounded-lg p-6 flex flex-col items-center justify-center min-h-[300px]">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-400">Verifying your reset link...</p>
      </div>
    )
  }

  if (!oobCode) {
    return (
      <div className="bg-[#111111] border border-[#333333] rounded-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-16 w-16 text-yellow-500" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Invalid Reset Link</h2>
        <p className="text-gray-400 mb-6">
          This password reset link is invalid or has expired. Please request a new one.
        </p>
        <Link href="/forgot-password" className="block">
          <Button type="button" color="primary" className="w-full">
            Request New Reset Link
          </Button>
        </Link>
        <div className="mt-4">
          <Link
            href="/signin"
            className="text-sm text-gray-400 hover:text-white flex items-center justify-center gap-1"
          >
            <ArrowLeft size={16} />
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="bg-[#111111] border border-[#333333] rounded-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Password Reset Complete</h2>
        <p className="text-gray-400 mb-6">
          Your password has been reset successfully. You can now sign in with your new password.
        </p>
        <Link href="/signin" className="block">
          <Button type="button" color="primary" className="w-full">
            Sign In
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-[#111111] border border-[#333333] rounded-lg p-6">
      {email && (
        <div className="mb-4 p-3 bg-[#1a1a1a] rounded-md">
          <p className="text-sm text-gray-300">
            Resetting password for <span className="font-medium text-white">{email}</span>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            New Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
            Confirm New Password
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button type="submit" isLoading={isCompleting} className="w-full">
          Reset Password
        </Button>
      </form>
    </div>
  )
}
