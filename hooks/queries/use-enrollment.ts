import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { isUserEnrolledInCourse, enrollUserInCourse, unenrollUserFromCourse } from "@/lib/firebase"

export function useEnrollmentStatus(userId: string, courseId: string) {
  return useQuery({
    queryKey: ["enrollment", userId, courseId],
    queryFn: () => isUserEnrolledInCourse(userId, courseId),
    enabled: !!userId && !!courseId
  })
}

export function useEnrollmentMutations() {
  const queryClient = useQueryClient()

  const enrollMutation = useMutation({
    mutationFn: ({ userId, courseId }: { userId: string; courseId: string }) =>
      enrollUserInCourse(userId, courseId),
    onSuccess: (_, { userId, courseId }) => {
      queryClient.invalidateQueries({ queryKey: ["enrollment", userId, courseId] })
      queryClient.invalidateQueries({ queryKey: ["course", courseId] })
    }
  })

  const unenrollMutation = useMutation({
    mutationFn: ({ userId, courseId }: { userId: string; courseId: string }) =>
      unenrollUserFromCourse(userId, courseId),
    onSuccess: (_, { userId, courseId }) => {
      queryClient.invalidateQueries({ queryKey: ["enrollment", userId, courseId] })
      queryClient.invalidateQueries({ queryKey: ["course", courseId] })
    }
  })

  return {
    enroll: enrollMutation.mutate,
    unenroll: unenrollMutation.mutate,
    isEnrolling: enrollMutation.isPending,
    isUnenrolling: unenrollMutation.isPending
  }
} 