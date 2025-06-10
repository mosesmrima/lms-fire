import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import { Progress, ProgressSchema } from "@/lib/types"
import { addToast } from "@heroui/react"

interface ProgressData {
  [lessonId: string]: {
    completed: boolean
    lastAccessed?: Date
  }
}

interface UpdateProgressParams {
  userId: string
  courseId: string
  lessonId: string
  completed: boolean
}

export function useCourseProgress(userId: string, courseId: string) {
  return useQuery<Progress[]>({
    queryKey: ["course-progress", userId, courseId],
    queryFn: async () => {
      if (!userId || !courseId) return []
      const progressRef = doc(db, "users", userId, "progress", courseId)
      const progressDoc = await getDoc(progressRef)
      if (!progressDoc.exists()) return []
      
      const progressData = progressDoc.data() as ProgressData
      return Object.entries(progressData).map(([lessonId, data]) => 
        ProgressSchema.parse({
          userId,
          courseId,
          lessonId,
          completed: data.completed,
          lastAccessed: data.lastAccessed?.toISOString() || new Date().toISOString()
        })
      )
    },
    enabled: !!userId && !!courseId
  })
}

export function useProgressMutations() {
  const queryClient = useQueryClient()

  const updateProgress = useMutation({
    mutationFn: async ({ userId, courseId, lessonId, completed }: UpdateProgressParams) => {
      const progressRef = doc(db, "users", userId, "progress", courseId)
      const progressDoc = await getDoc(progressRef)
      
      const currentProgress = progressDoc.exists() 
        ? progressDoc.data() as ProgressData 
        : {}

      const progress = {
        [lessonId]: {
          completed,
          lastAccessed: new Date()
        },
        ...currentProgress
      }

      await updateDoc(progressRef, progress)
    },
    onSuccess: (_, { userId, courseId }) => {
      queryClient.invalidateQueries({ queryKey: ["course-progress", userId, courseId] })
      addToast({
        title: "Success",
        description: "Progress updated successfully",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
    },
    onError: (error) => {
      console.error("Error updating progress:", error)
      addToast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
    }
  })

  return {
    updateProgress: updateProgress.mutate,
    isUpdating: updateProgress.isPending
  }
} 