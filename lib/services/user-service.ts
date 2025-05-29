"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createUserProfile, getUserProfile, updateUserProfile } from "@/lib/firebase"

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId
  })
}

export function useUserMutations() {
  const queryClient = useQueryClient()

  const createUserMutation = useMutation({
    mutationFn: ({ userId, userData }: { userId: string; userData: any }) =>
      createUserProfile(userId, userData),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] })
    }
  })

  const updateUserMutation = useMutation({
    mutationFn: ({ userId, userData }: { userId: string; userData: any }) =>
      updateUserProfile(userId, userData),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] })
    }
  })

  return {
    createUser: createUserMutation.mutate,
    updateUser: updateUserMutation.mutate,
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending
  }
} 