"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardBody, CardFooter, Input, Button, Link, Select, SelectItem } from "@heroui/react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useToast } from "@/components/ui/use-toast"
import { Role } from "@/lib/types"

export default function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<Role>("student")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { signUp } = useAuthStore()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      await signUp(email, password, role)
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Sign up error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to sign up. Please try again.",
        variant: "destructive",
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
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-[#2a2a2a] border-[#333333] text-white"
            />
            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-[#2a2a2a] border-[#333333] text-white"
            />
            <Input
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="bg-[#2a2a2a] border-[#333333] text-white"
            />
            <Select
              label="Role"
              placeholder="Select your role"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              required
              className="bg-[#2a2a2a] border-[#333333] text-white"
            >
              <SelectItem key="student" value="student">
                Student
              </SelectItem>
              <SelectItem key="instructor" value="instructor">
                Instructor
              </SelectItem>
            </Select>
            <Button
              type="submit"
              color="primary"
              className="w-full bg-[#f90026] hover:bg-[#d10021]"
              isLoading={isLoading}
            >
              Sign Up
            </Button>
          </form>
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
