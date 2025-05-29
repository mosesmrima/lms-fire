import { create } from "zustand"
import { Course, Enrollment } from "@/lib/types"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore"

interface CourseState {
  enrolledCourses: string[]
  courseProgress: Record<string, Record<string, boolean>>
  enrollInCourse: (userId: string, courseId: string) => Promise<void>
  unenrollFromCourse: (userId: string, courseId: string) => Promise<void>
  fetchEnrolledCourses: (userId: string) => Promise<void>
  markLessonComplete: (userId: string, courseId: string, lessonId: string, completed: boolean) => Promise<void>
  getCourseDetails: (courseId: string) => Promise<Course | null>
}

export const useCourseStore = create<CourseState>((set, get) => ({
  enrolledCourses: [],
  courseProgress: {},

  enrollInCourse: async (userId: string, courseId: string) => {
    try {
      const enrollmentRef = doc(db, "enrollments", `${userId}_${courseId}`)
      await enrollmentRef.set({
        userId,
        courseId,
        enrolledAt: new Date(),
        completedLessons: [],
        progress: 0
      })

      set((state) => ({
        enrolledCourses: [...state.enrolledCourses, courseId]
      }))
    } catch (error) {
      console.error("Error enrolling in course:", error)
      throw error
    }
  },

  unenrollFromCourse: async (userId: string, courseId: string) => {
    try {
      const enrollmentRef = doc(db, "enrollments", `${userId}_${courseId}`)
      await enrollmentRef.delete()

      set((state) => ({
        enrolledCourses: state.enrolledCourses.filter((id) => id !== courseId)
      }))
    } catch (error) {
      console.error("Error unenrolling from course:", error)
      throw error
    }
  },

  fetchEnrolledCourses: async (userId: string) => {
    try {
      const enrollmentsRef = collection(db, "enrollments")
      const q = query(enrollmentsRef, where("userId", "==", userId))
      const querySnapshot = await getDocs(q)
      
      const enrolledCourses = querySnapshot.docs.map(doc => doc.data().courseId)
      set({ enrolledCourses })
    } catch (error) {
      console.error("Error fetching enrolled courses:", error)
      throw error
    }
  },

  markLessonComplete: async (userId: string, courseId: string, lessonId: string, completed: boolean) => {
    try {
      const enrollmentRef = doc(db, "enrollments", `${userId}_${courseId}`)
      const enrollmentDoc = await getDoc(enrollmentRef)
      
      if (enrollmentDoc.exists()) {
        const enrollment = enrollmentDoc.data() as Enrollment
        const completedLessons = completed
          ? [...new Set([...enrollment.completedLessons, lessonId])]
          : enrollment.completedLessons.filter(id => id !== lessonId)

        await enrollmentRef.update({
          completedLessons,
          progress: (completedLessons.length / enrollment.totalLessons) * 100
        })

        set((state) => ({
          courseProgress: {
            ...state.courseProgress,
            [courseId]: {
              ...state.courseProgress[courseId],
              [lessonId]: completed
            }
          }
        }))
      }
    } catch (error) {
      console.error("Error marking lesson as complete:", error)
      throw error
    }
  },

  getCourseDetails: async (courseId: string) => {
    try {
      const courseRef = doc(db, "courses", courseId)
      const courseDoc = await getDoc(courseRef)
      
      if (courseDoc.exists()) {
        return courseDoc.data() as Course
      }
      return null
    } catch (error) {
      console.error("Error fetching course details:", error)
      throw error
    }
  }
})) 