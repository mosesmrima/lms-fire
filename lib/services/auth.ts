import { useMutation } from "@tanstack/react-query"
import { sendPasswordResetEmail, verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth"
import { auth } from "@/lib/firebase/client"

export function usePasswordResetMutations() {
  const sendResetEmailMutation = useMutation({
    mutationFn: async (email: string) => {
      await sendPasswordResetEmail(auth, email)
    }
  })

  const verifyTokenMutation = useMutation({
    mutationFn: async (actionCode: string) => {
      const email = await verifyPasswordResetCode(auth, actionCode)
      return email
    }
  })

  const completeResetMutation = useMutation({
    mutationFn: async ({ actionCode, newPassword }: { actionCode: string; newPassword: string }) => {
      await confirmPasswordReset(auth, actionCode, newPassword)
    }
  })

  return {
    sendResetEmail: sendResetEmailMutation.mutate,
    verifyToken: verifyTokenMutation.mutate,
    completeReset: completeResetMutation.mutate,
    isSending: sendResetEmailMutation.isPending,
    isVerifying: verifyTokenMutation.isPending,
    isCompleting: completeResetMutation.isPending
  }
} 