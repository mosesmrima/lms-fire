"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Role } from "@/lib/types/roles"

export function useAuthClaims() {
  const { user } = useAuth()
  const [roles, setRoles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getClaims = async () => {
    if (!user) {
      setRoles([])
        setLoading(false)
      return
    }

    try {
        const idTokenResult = await user.getIdTokenResult()
        const userRoles = idTokenResult.claims.roles as string[] || []
      setRoles(userRoles)
    } catch (error) {
        console.error("Error getting user roles:", error)
      setRoles([])
      } finally {
        setLoading(false)
  }
    }

    getClaims()
  }, [user])

  const hasRole = (role: Role) => roles.includes(role)
  const isAdmin = roles.includes("admin")
  const isInstructor = roles.includes("instructor")
  const isStudent = roles.includes("student")

  return {
    roles,
    loading,
    hasRole,
    isAdmin,
    isInstructor,
    isStudent,
  }
}
