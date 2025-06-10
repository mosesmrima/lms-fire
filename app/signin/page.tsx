"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardBody, CardFooter, Form, Input, Button, Link, Divider } from "@heroui/react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { AuthUser } from "@/lib/types"
import { ROLES } from "@/lib/rbac/types"

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()
  const { signIn, signInWithGoogle, isAdmin, isInstructor } = useAuthStore()

  const handleRoleBasedRedirect = (user: AuthUser) => {
    if (!user.roles) return

    if (isAdmin()) {
      router.push("/admin")
    } else if (isInstructor()) {
      router.push("/instructor")
    } else {
      router.push("/dashboard")
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const user = await signIn(email, password)
      handleRoleBasedRedirect(user)
    } catch (error: any) {
      console.error("Sign in error:", error)
      setErrors({
        email: error.message || "Failed to sign in. Please try again."
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const user = await signInWithGoogle()
      handleRoleBasedRedirect(user)
    } catch (error: any) {
      console.error("Google sign in error:", error)
      setErrors({
        email: error.message || "Failed to sign in with Google. Please try again."
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111111] p-4">
      <Card className="w-full max-w-md bg-[#1e1e1e] border-[#333333]">
        <CardHeader className="flex flex-col gap-1 text-center">
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-gray-400">Sign in to your account</p>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <Form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            validationErrors={errors}
          >
            <Input
              type="email"
              label="Email"
              name="email"
              placeholder="Enter your email"
              isRequired
              errorMessage="Please enter a valid email"
              labelPlacement="outside"
              className="bg-[#2a2a2a] border-[#333333] text-white"
            />
            <Input
              type="password"
              label="Password"
              name="password"
              placeholder="Enter your password"
              isRequired
              errorMessage="Password is required"
              labelPlacement="outside"
              className="bg-[#2a2a2a] border-[#333333] text-white"
            />
            <Button
              type="submit"
              color="primary"
              className="w-full bg-[#f90026] hover:bg-[#d10021]"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </Form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#333333]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#1e1e1e] px-2 text-gray-400">Or continue with</span>
            </div>
          </div>

          <Button
            variant="bordered"
            className="w-full border-[#333333] hover:border-[#f90026]"
            onPress={handleGoogleSignIn}
            isLoading={isLoading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </Button>
        </CardBody>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <Link as={Link} href="/signup" className="text-[#f90026] hover:text-[#d10021]">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
