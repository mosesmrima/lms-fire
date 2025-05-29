import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getUserCourseProgress, updateLessonProgress } from "@/lib/firebase"

export function useCourseProgress(userId: string, courseId: string) {
  return useQuery({
    queryKey: ["progress", userId, courseId],
    queryFn: () => getUserCourseProgress(userId, courseId),
    enabled: !!userId && !!courseId
  })
}

export function useProgressMutations() {
  const queryClient = useQueryClient()

  const updateProgressMutation = useMutation({
    mutationFn: ({ 
      userId, 
      courseId, 
      lessonId, 
      completed 
    }: { 
      userId: string
      courseId: string
      lessonId: string
      completed: boolean 
    }) => updateLessonProgress(userId, courseId, lessonId, completed),
    onMutate: async ({ userId, courseId, lessonId, completed }) => {
      await queryClient.cancelQueries({ queryKey: ["progress", userId, courseId] })
      const previous = queryClient.getQueryData(["progress", userId, courseId])
      queryClient.setQueryData(["progress", userId, courseId], (old: any) => ({
        ...old,
        [lessonId]: { completed },
      }))
      return { previous }
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["progress", variables.userId, variables.courseId], context.previous)
      }
    },
    onSuccess: (_, { userId, courseId }) => {
      queryClient.invalidateQueries({ queryKey: ["progress", userId, courseId] })
    }
  })

  return {
    updateProgress: updateProgressMutation.mutate,
    isUpdating: updateProgressMutation.isPending
  }
} 