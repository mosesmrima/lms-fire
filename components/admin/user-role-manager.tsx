"use client"

import { useState } from "react"
import { Card, CardHeader, CardBody, Button, Input, Select, SelectItem } from "@heroui/react"
import { ROLES } from "@/lib/roles"
import { useAuthStore } from "@/lib/stores/auth-store"
import { Loader2, Plus } from "lucide-react"

const roleOptions = [
  { key: ROLES.ADMIN, label: "Admin" },
  { key: ROLES.INSTRUCTOR, label: "Instructor" },
  { key: ROLES.STUDENT, label: "Student" },
]

export function UserRoleManager() {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<typeof ROLES[keyof typeof ROLES]>(ROLES.STUDENT)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuthStore()

  const handleAssignRole = async () => {
    if (!email || !role) {
      // Use HeroUI's toast or alert component here
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/assign-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, role }),
      })

      if (!response.ok) {
        throw new Error("Failed to assign role")
      }

      // Use HeroUI's toast or alert component here
      setEmail("")
    } catch (error) {
      console.error("Error assigning role:", error)
      // Use HeroUI's toast or alert component here
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">User Role Management</h2>
        <p className="text-sm text-gray-400">Manage user roles and permissions</p>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Current User:</span>
            <span className="text-sm text-gray-400">{user?.email}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Current Role:</span>
            <span className="text-sm text-gray-400">{role}</span>
            </div>
          <div className="flex flex-col gap-4 sm:flex-row">
              <Input
              type="email"
              placeholder="User email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Select
              selectedKeys={[role]}
              onSelectionChange={(keys) => {
                const newRole = Array.from(keys)[0] as typeof ROLES[keyof typeof ROLES]
                setRole(newRole)
              }}
              className="flex-1"
            >
              {roleOptions.map((option) => (
                <SelectItem key={option.key}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>
            <Button 
              onClick={handleAssignRole} 
              disabled={isLoading}
              startContent={isLoading ? <Loader2 className="animate-spin" /> : <Plus />}
            >
              {isLoading ? "Assigning..." : "Assign Role"}
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Current Roles:</h3>
              <div className="flex flex-wrap gap-2">
              {/* Add user role list here */}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
