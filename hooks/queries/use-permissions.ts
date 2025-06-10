import { useQuery } from "@tanstack/react-query"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import type { Permission } from "@/lib/rbac/types"
import { hasPermission, hasAllPermissions, hasAnyPermission } from "@/lib/rbac/permissions"

export function usePermissions(userId: string | undefined) {
  return useQuery({
    queryKey: ["permissions", userId],
    queryFn: async () => {
      if (!userId) return []
      const userRef = doc(db, "users", userId)
      const userDoc = await getDoc(userRef)
      return userDoc.data()?.roles || []
    },
    enabled: !!userId,
    select: (roles) => ({
      roles,
      can: (permission: Permission) => hasPermission(roles, permission),
      canAll: (permissions: Permission[]) => hasAllPermissions(roles, permissions),
      canAny: (permissions: Permission[]) => hasAnyPermission(roles, permissions),
      isAdmin: roles.includes("admin"),
      isInstructor: roles.includes("instructor") || roles.includes("admin"),
      isStudent: roles.includes("student") || roles.length === 0
    })
  })
} 