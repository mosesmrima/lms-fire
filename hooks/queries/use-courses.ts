import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getCourses, getCourse, getInstructorCourses, createCourse, updateCourse, deleteCourse } from "@/lib/firebase"

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: getCourses
  })
}

export function useCourse(courseId: string) {
  return useQuery<Awaited<ReturnType<typeof getCourse>>>({
    queryKey: ["course", courseId],
    queryFn: () => getCourse(courseId),
    enabled: !!courseId
  })
}

export function useInstructorCourses(instructorId: string) {
  return useQuery({
    queryKey: ["instructor-courses", instructorId],
    queryFn: () => getInstructorCourses(instructorId),
    enabled: !!instructorId
  })
}

export function useCourseMutations() {
  const queryClient = useQueryClient()

  const createCourseMutation = useMutation({
    mutationFn: ({ userId, courseData }: { userId: string; courseData: any }) => 
      createCourse(userId, courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] })
    }
  })

  const updateCourseMutation = useMutation({
    mutationFn: ({ courseId, courseData }: { courseId: string; courseData: any }) =>
      updateCourse(courseId, courseData),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] })
      queryClient.invalidateQueries({ queryKey: ["course", courseId] })
    }
  })

  const deleteCourseMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] })
    }
  })

  return {
    createCourse: createCourseMutation.mutate,
    updateCourse: updateCourseMutation.mutate,
    deleteCourse: deleteCourseMutation.mutate,
    isCreating: createCourseMutation.isPending,
    isUpdating: updateCourseMutation.isPending,
    isDeleting: deleteCourseMutation.isPending
  }
} 