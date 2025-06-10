"use client"

import { useUserRoles } from "@/hooks/queries/use-user-roles"
import { Role } from "@/lib/types/roles"
import { Card, CardHeader, CardBody, CardTitle, Form, Checkbox } from "@heroui/react"
import { UserCog } from "lucide-react"

interface UserRoleManagerProps {
  userId: string
  userName: string
}

export function UserRoleManager({ userId, userName }: UserRoleManagerProps) {
  const { roles, isLoading, updateRoles, isUpdating } = useUserRoles(userId)

  if (isLoading) {
    return <div>Loading user roles...</div>
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const selectedRoles = Object.values(Role).filter(role => 
      formData.get(role) === "on"
    )

    updateRoles({ roles: selectedRoles })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <UserCog className="h-4 w-4" />
          <CardTitle>Manage Roles: {userName}</CardTitle>
        </div>
      </CardHeader>
      <CardBody>
        <Form
          onSubmit={onSubmit}
          className="space-y-4"
        >
          {Object.values(Role).map((role) => (
            <div key={role} className="flex items-center gap-2">
              <Checkbox
                id={`role-${role}`}
                name={role}
                defaultSelected={roles?.hasRole(role) || false}
                isDisabled={isUpdating}
              />
              <label
                htmlFor={`role-${role}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {role}
              </label>
            </div>
          ))}
        </Form>
      </CardBody>
    </Card>
  )
}
