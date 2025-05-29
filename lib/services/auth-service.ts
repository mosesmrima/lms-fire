import { useMutation } from "@tanstack/react-query"
import { sendPasswordResetRequest, verifyPasswordResetToken, completePasswordReset } from "@/lib/firebase"

export function usePasswordResetMutations() {
  const sendResetEmailMutation = useMutation({
    mutationFn: sendPasswordResetRequest
  })

  const verifyTokenMutation = useMutation({
    mutationFn: verifyPasswordResetToken
  })

  const completeResetMutation = useMutation({
    mutationFn: ({ actionCode, newPassword }: { actionCode: string; newPassword: string }) =>
      completePasswordReset(actionCode, newPassword)
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