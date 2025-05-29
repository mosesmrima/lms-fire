"use client"

import { useState } from "react"
import { Modal, Button, Select } from "@heroui/react"
import { useAuthStore } from "@/lib/stores/auth-store"

interface UserRoleDialogProps {
  isOpen: boolean
  onClose: () => void
  user: {
    id: string
    email: string
    displayName?: string
    role?: string
  }
  onRoleChange: () => void
}

export function UserRoleDialog({ isOpen, onClose, user, onRoleChange }: UserRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState(user.role || "student")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user: currentUser } = useAuthStore()

  const handleRoleChange = async () => {
    if (!currentUser) return

    setIsLoading(true)
    setError(null)

    try {
      // Get the current user's ID token
      const idToken = await currentUser.getIdToken()

      // Call the API to update the role
      const response = await fetch("/api/admin/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          uid: user.id,
          role: selectedRole,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update user role")
      }

      // Notify parent component of the change
      onRoleChange()

      // Close the dialog
      onClose()
    } catch (err: any) {
      console.error("Error updating user role:", err)
      setError(err.message || "An error occurred while updating the user role")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 max-w-[425px]">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Change User Role</h2>
          <p className="text-gray-400 mt-1">Update the role for {user.displayName || user.email}</p>
        </div>
        <div className="py-4">
          <Select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full"
          >
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </Select>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button onPress={handleRoleChange} isLoading={isLoading}>
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  )
}
