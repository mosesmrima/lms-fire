"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  enrollUserInCourse,
  unenrollUserFromCourse,
  getUserEnrollments,
  updateLessonProgress,
  getUserCourseProgress,
} from "@/lib/firebase"

interface StoreState {
  enrolledCourses: string[]
  courseProgress: Record<string, Record<string, { completed: boolean }>>
  enrollInCourse: (userId: string, courseId: string) => Promise<void>
  unenrollFromCourse: (userId: string, courseId: string) => Promise<void>
  fetchEnrolledCourses: (userId: string) => Promise<void>
  markLessonComplete: (userId: string, courseId: string, lessonId: string, completed: boolean) => Promise<void>
  fetchCourseProgress: (userId: string, courseId: string) => Promise<void>
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      enrolledCourses: [],
      courseProgress: {},

      enrollInCourse: async (userId: string, courseId: string) => {
        try {
          await enrollUserInCourse(userId, courseId)
          set((state) => ({
            enrolledCourses: [...state.enrolledCourses, courseId],
          }))
        } catch (error) {
          console.error("Error enrolling in course:", error)
          throw error
        }
      },

      unenrollFromCourse: async (userId: string, courseId: string) => {
        try {
          await unenrollUserFromCourse(userId, courseId)
          set((state) => ({
            enrolledCourses: state.enrolledCourses.filter((id) => id !== courseId),
          }))
        } catch (error) {
          console.error("Error unenrolling from course:", error)
          throw error
        }
      },

      fetchEnrolledCourses: async (userId: string) => {
        try {
          const enrolledCourses = await getUserEnrollments(userId)
          set({ enrolledCourses })
        } catch (error) {
          console.error("Error fetching enrolled courses:", error)
          throw error
        }
      },

      markLessonComplete: async (userId: string, courseId: string, lessonId: string, completed: boolean) => {
        try {
          await updateLessonProgress(userId, courseId, lessonId, completed)
          set((state) => ({
            courseProgress: {
              ...state.courseProgress,
              [courseId]: {
                ...state.courseProgress[courseId],
                [lessonId]: { completed },
              },
            },
          }))
        } catch (error) {
          console.error("Error marking lesson as complete:", error)
          throw error
        }
      },

      fetchCourseProgress: async (userId: string, courseId: string) => {
        try {
          const progress = await getUserCourseProgress(userId, courseId)
          set((state) => ({
            courseProgress: {
              ...state.courseProgress,
              [courseId]: progress,
            },
          }))
        } catch (error) {
          console.error("Error fetching course progress:", error)
          throw error
        }
      },
    }),
    {
      name: "lms-store",
    },
  ),
)
