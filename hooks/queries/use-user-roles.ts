import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import { Role } from "@/lib/rbac"
import { addToast } from "@heroui/react"

interface UserRoles {
  roles: string[]
  hasRole: (role: Role) => boolean
  hasAnyRole: (roles: Role[]) => boolean
  hasAllRoles: (roles: Role[]) => boolean
}

export function useUserRoles(userId: string) {
  const queryClient = useQueryClient()

  const { data: roles, isLoading } = useQuery<UserRoles>({
    queryKey: ["user-roles", userId],
    queryFn: async () => {
      const userDoc = await getDoc(doc(db, "users", userId))
      if (!userDoc.exists()) {
        throw new Error("User not found")
      }

      const userData = userDoc.data()
      const userRoles = userData.roles || []

      return {
        roles: userRoles,
        hasRole: (role: Role) => userRoles.includes(role),
        hasAnyRole: (roles: Role[]) => roles.some(role => userRoles.includes(role)),
        hasAllRoles: (roles: Role[]) => roles.every(role => userRoles.includes(role))
      }
    },
    enabled: !!userId
  })

  const { mutate: updateRoles, isPending: isUpdating } = useMutation({
    mutationFn: async ({ roles }: { roles: string[] }) => {
      const userRef = doc(db, "users", userId)
      await updateDoc(userRef, { roles })
      return roles
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-roles", userId] })
      addToast({
        title: "Success",
        description: "User roles updated successfully",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
    },
    onError: (error) => {
      console.error("Error updating user roles:", error)
      addToast({
        title: "Error",
        description: "Failed to update user roles. Please try again.",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
    }
  })

  return {
    roles,
    isLoading,
    updateRoles,
    isUpdating
  }
} 