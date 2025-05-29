"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardBody, Button, Select, SelectItem } from "@heroui/react"
import { Users, BookOpen, GraduationCap, Activity, UserCog } from "lucide-react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { ROLES } from "@/lib/roles"
import { PermissionGate } from "@/components/permission-gate"
import { UserRoleManager } from "@/components/admin/user-role-manager"

interface User {
  uid: string
  email: string
  displayName: string
  roles: string[]
}

export function AdminClientPage() {
  const { user, roles } = useAuthStore()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    activeUsers: 0,
  })
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch admin stats
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats")
        const data = await response.json()
        
        // Calculate active users on client side
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        
        const activeUsers = data.lastSignInTimes.filter(({ lastSignInTime }) => {
          if (!lastSignInTime) return false
          return new Date(lastSignInTime) > thirtyDaysAgo
        }).length

        setStats({
          totalUsers: data.totalUsers,
          totalCourses: data.totalCourses,
          totalEnrollments: data.totalEnrollments,
          activeUsers
        })
      } catch (error) {
        console.error("Error fetching admin stats:", error)
      }
    }

    // Fetch users
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/users")
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
    fetchUsers()
  }, [])

  const handleRoleChange = async (userId: string, role: string, action: 'assign' | 'revoke') => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role, action }),
      })

      if (!response.ok) throw new Error("Failed to update role")

      const data = await response.json()
      
      // Update local state
      setUsers(users.map(u => 
        u.uid === userId 
          ? { ...u, roles: data.roles }
          : u
      ))
    } catch (error) {
      console.error("Error updating user role:", error)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <h3 className="text-lg font-semibold">Total Users</h3>
            </div>
              </CardHeader>
          <CardBody>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
            <p className="text-sm text-gray-400">Total registered users</p>
          </CardBody>
            </Card>

            <Card>
              <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <h3 className="text-lg font-semibold">Total Courses</h3>
            </div>
              </CardHeader>
          <CardBody>
            <p className="text-2xl font-bold">{stats.totalCourses}</p>
            <p className="text-sm text-gray-400">Available courses</p>
          </CardBody>
            </Card>

            <Card>
              <CardHeader>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <h3 className="text-lg font-semibold">Total Enrollments</h3>
          </div>
            </CardHeader>
          <CardBody>
            <p className="text-2xl font-bold">{stats.totalEnrollments}</p>
            <p className="text-sm text-gray-400">Course enrollments</p>
          </CardBody>
          </Card>

          <Card>
            <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <h3 className="text-lg font-semibold">Active Users</h3>
            </div>
            </CardHeader>
          <CardBody>
            <p className="text-2xl font-bold">{stats.activeUsers}</p>
            <p className="text-sm text-gray-400">Users active in last 30 days</p>
          </CardBody>
          </Card>
      </div>

      <PermissionGate allowedRoles={[ROLES.ADMIN]}>
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              <h3 className="text-lg font-semibold">User Management</h3>
            </div>
          </CardHeader>
          <CardBody>
            {isLoading ? (
              <div className="text-center py-4">Loading users...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4">User</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Current Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, i) => (
                      <tr key={`${user.uid}-${i}`} className="border-b border-gray-700">
                        <td className="py-3 px-4">{user.displayName || "No name"}</td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-2">
                            {Object.values(ROLES).map((role) => (
                              <div key={role} className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={user.roles.includes(role)}
                                  onChange={(e) => {
                                    handleRoleChange(
                                      user.uid,
                                      role,
                                      e.target.checked ? 'assign' : 'revoke'
                                    )
                                  }}
                                  className="h-4 w-4 rounded border-gray-600 bg-gray-700"
                                />
                                <span className="text-sm capitalize">{role.toLowerCase()}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>

  
      </PermissionGate>
    </div>
  )
}
