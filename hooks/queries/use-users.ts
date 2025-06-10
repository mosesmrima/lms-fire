import { useMutation, useQueryClient } from "@tanstack/react-query"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/client"

export function useUserMutations() {
  const queryClient = useQueryClient()

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, userData }: { userId: string; userData: any }) => {
      const userRef = doc(db, "users", userId)
      await updateDoc(userRef, {
        ...userData,
        updatedAt: new Date().toISOString()
      })
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] })
    }
  })

  return {
    updateUser: updateUserMutation.mutate,
    isUpdating: updateUserMutation.isPending
  }
} 