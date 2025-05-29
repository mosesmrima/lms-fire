import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getCourse, updateLesson } from "@/lib/firebase"
import type { Course, Lesson, Timestamp } from "@/lib/types"

export function useLesson(courseId: string, lessonId: string) {
  return useQuery({
    queryKey: ["lesson", courseId, lessonId],
    queryFn: async () => {
      const course = await getCourse(courseId)
      if (!course) return null
      return course.lessons.find((l) => l.id === lessonId) || null
    }
  })
}

export function useLessonMutations() {
  const queryClient = useQueryClient()

  const updateLessonMutation = useMutation({
    mutationFn: async ({ courseId, lessonId, lessonData }: { 
      courseId: string
      lessonId: string
      lessonData: Partial<Lesson>
    }) => {
      await updateLesson(courseId, lessonId, lessonData)
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ["course", courseId] })
      queryClient.invalidateQueries({ queryKey: ["lessons", courseId] })
    }
  })

  return {
    updateLesson: updateLessonMutation.mutateAsync,
    isUpdating: updateLessonMutation.isPending
  }
} 