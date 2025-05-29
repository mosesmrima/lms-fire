"use client"

import { useAuthClaims } from "@/hooks/use-auth-claims"
import { ROLES } from "@/lib/types/roles"
import { PermissionGate } from "@/components/permission-gate"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export default function TestPermissions() {
  const { user } = useAuth()
  const { hasRole, isAdmin, isInstructor, isStudent } = useAuthClaims()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Test Permissions</h1>
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Role Checks</h2>
            <ul className="list-disc pl-5">
            <li>Is Admin: {isAdmin ? "Yes" : "No"}</li>
            <li>Is Instructor: {isInstructor ? "Yes" : "No"}</li>
            <li>Is Student: {isStudent ? "Yes" : "No"}</li>
            </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Individual Role Checks</h2>
            <ul className="list-disc pl-5">
            <li>Has Admin Role: {hasRole(ROLES.ADMIN) ? "Yes" : "No"}</li>
            <li>Has Instructor Role: {hasRole(ROLES.INSTRUCTOR) ? "Yes" : "No"}</li>
            <li>Has Student Role: {hasRole(ROLES.STUDENT) ? "Yes" : "No"}</li>
            </ul>
        </div>
      </div>

        <div className="space-y-6 mt-8">
          <div className="p-4 border rounded">
            <h2 className="font-semibold mb-2">Student Content</h2>
            <PermissionGate role={ROLES.STUDENT} fallback={<p>You need student role to see this</p>}>
              <p className="text-green-500">This content is visible to students</p>
            </PermissionGate>
          </div>

          <div className="p-4 border rounded">
            <h2 className="font-semibold mb-2">Instructor Content</h2>
            <PermissionGate role={ROLES.INSTRUCTOR} fallback={<p>You need instructor role to see this</p>}>
              <p className="text-blue-500">This content is visible to instructors</p>
            </PermissionGate>
          </div>

          <div className="p-4 border rounded">
            <h2 className="font-semibold mb-2">Admin Content</h2>
            <PermissionGate role={ROLES.ADMIN} fallback={<p>You need admin role to see this</p>}>
              <p className="text-purple-500">This content is visible to admins</p>
            </PermissionGate>
          </div>

          <div className="p-4 border rounded">
            <h2 className="font-semibold mb-2">Multiple Roles Content</h2>
            <PermissionGate
              roles={[ROLES.INSTRUCTOR, ROLES.ADMIN]}
              fallback={<p>You need instructor or admin role to see this</p>}
            >
              <p className="text-yellow-500">This content is visible to instructors and admins</p>
            </PermissionGate>
        </div>
      </div>
    </div>
  )
}
