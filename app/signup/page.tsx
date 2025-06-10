"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardBody, CardFooter, Form, Input, Button, Link } from "@heroui/react"
import { useAuthStore } from "@/lib/stores/auth-store"

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()
  const { signUp } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    // Validate passwords match
    if (password !== confirmPassword) {
      setErrors({
        confirmPassword: "Passwords do not match"
      })
      setIsLoading(false)
      return
    }

    try {
      await signUp(email, password)
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Sign up error:", error)
      setErrors({
        email: error.message || "Failed to sign up. Please try again."
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111111] p-4">
      <Card className="w-full max-w-md bg-[#1e1e1e] border-[#333333]">
        <CardHeader className="flex flex-col gap-1 text-center">
          <h1 className="text-2xl font-bold text-white">Create an account</h1>
          <p className="text-gray-400">Sign up to get started</p>
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
            <Input
              type="password"
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Confirm your password"
              isRequired
              errorMessage="Please confirm your password"
              labelPlacement="outside"
              className="bg-[#2a2a2a] border-[#333333] text-white"
            />
            <Button
              type="submit"
              color="primary"
              className="w-full bg-[#f90026] hover:bg-[#d10021]"
              isLoading={isLoading}
            >
              Sign Up
            </Button>
          </Form>
        </CardBody>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link as={Link} href="/signin" className="text-[#f90026] hover:text-[#d10021]">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
