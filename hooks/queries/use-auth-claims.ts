import { useQuery } from "@tanstack/react-query"
import { Role } from "@/lib/rbac"
import { useAuthStore } from "@/lib/stores/auth-store"

export function useAuthClaims() {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: ["auth-claims", user?.uid],
    queryFn: async () => {
      if (!user) return null

      const idTokenResult = await user.getIdTokenResult()
      const roles = (idTokenResult.claims.roles || []) as Role[]

      return {
        roles,
        hasRole: (role: Role) => roles.includes(role),
        isAdmin: roles.includes("admin"),
        isInstructor: roles.includes("instructor"),
        isStudent: roles.includes("student")
      }
    },
    enabled: !!user
  })
} 