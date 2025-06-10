import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { 
  getCourses, 
  getCourse, 
  createCourse, 
  updateCourse, 
  deleteCourse,
  uploadCourseThumbnail,
  uploadLessonResource
} from "@/lib/firebase/client"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import { Course, CourseSchema, type Lesson } from "@/lib/types"
import { addToast } from "@heroui/react"

export function useCourses() {
  return useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: async () => {
      const courses = await getCourses()
      return courses.map(course => CourseSchema.parse(course))
    }
  })
}

export function useCourse(courseId: string) {
  return useQuery<Course>({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const course = await getCourse(courseId)
      if (!course) throw new Error("Course not found")
      return CourseSchema.parse(course)
    },
    enabled: !!courseId
  })
}

export function useInstructorCourses(instructorId: string) {
  return useQuery({
    queryKey: ["courses", "instructor", instructorId],
    queryFn: async () => {
      if (!instructorId) return []
      const coursesRef = collection(db, "courses")
      const q = query(coursesRef, where("instructor", "==", instructorId))
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    },
    enabled: !!instructorId
  })
}

export function useCourseMutations() {
  const queryClient = useQueryClient()

  const createCourseMutation = useMutation({
    mutationFn: async ({ userId, courseData }: { userId: string; courseData: Partial<Course> }) => {
      const validatedData = CourseSchema.partial().parse(courseData)
      return createCourse(userId, validatedData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] })
      addToast({
        title: "Success",
        description: "Course created successfully",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
    },
    onError: (error) => {
      console.error("Error creating course:", error)
      addToast({
        title: "Error",
        description: "Failed to create course. Please try again.",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
    }
  })

  const updateCourseMutation = useMutation({
    mutationFn: async ({ courseId, courseData }: { courseId: string; courseData: Partial<Course> }) => {
      const validatedData = CourseSchema.partial().parse(courseData)
      return updateCourse(courseId, validatedData)
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] })
      queryClient.invalidateQueries({ queryKey: ["course", courseId] })
      addToast({
        title: "Success",
        description: "Course updated successfully",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
    },
    onError: (error) => {
      console.error("Error updating course:", error)
      addToast({
        title: "Error",
        description: "Failed to update course. Please try again.",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
    }
  })

  const deleteCourseMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] })
      addToast({
        title: "Success",
        description: "Course deleted successfully",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
    },
    onError: (error) => {
      console.error("Error deleting course:", error)
      addToast({
        title: "Error",
        description: "Failed to delete course. Please try again.",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
    }
  })

  const uploadThumbnailMutation = useMutation({
    mutationFn: async ({ courseId, file }: { courseId: string; file: File }) => {
      return uploadCourseThumbnail(courseId, file)
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ["course", courseId] })
      addToast({
        title: "Success",
        description: "Thumbnail uploaded successfully",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
    },
    onError: (error) => {
      console.error("Error uploading thumbnail:", error)
      addToast({
        title: "Error",
        description: "Failed to upload thumbnail. Please try again.",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
    }
  })

  const uploadResourceMutation = useMutation({
    mutationFn: async ({ 
      courseId, 
      lessonId, 
      file 
    }: { 
      courseId: string; 
      lessonId: string; 
      file: File 
    }) => {
      return uploadLessonResource(courseId, lessonId, file)
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ["course", courseId] })
      addToast({
        title: "Success",
        description: "Resource uploaded successfully",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
    },
    onError: (error) => {
      console.error("Error uploading resource:", error)
      addToast({
        title: "Error",
        description: "Failed to upload resource. Please try again.",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
    }
  })

  return {
    createCourse: createCourseMutation.mutate,
    updateCourse: updateCourseMutation.mutate,
    deleteCourse: deleteCourseMutation.mutate,
    uploadThumbnail: uploadThumbnailMutation.mutate,
    uploadResource: uploadResourceMutation.mutate,
    isCreating: createCourseMutation.isPending,
    isUpdating: updateCourseMutation.isPending,
    isDeleting: deleteCourseMutation.isPending,
    isUploadingThumbnail: uploadThumbnailMutation.isPending,
    isUploadingResource: uploadResourceMutation.isPending
  }
} 