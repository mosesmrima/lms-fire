"use client"

import { Spinner } from "@heroui/react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useCourseProgress, useProgressMutations } from "@/hooks/queries/use-progress"

interface CourseProgressProps {
  courseId: string
  totalLessons: number
}

export function CourseProgress({ courseId, totalLessons }: CourseProgressProps) {
  const { user } = useAuthStore()
  const { data: progress, isLoading } = useCourseProgress(user?.uid || "", courseId)
  const { updateProgress, isUpdating } = useProgressMutations()

  const completedLessons = Object.entries(progress || {})
    .filter(([_, { completed }]) => completed)
    .map(([lessonId]) => lessonId)

  const progressPercentage = (completedLessons.length / totalLessons) * 100

  const toggleLessonCompletion = async (lessonId: string) => {
    if (!user) return

    try {
      const isCompleted = completedLessons.includes(lessonId)
      await updateProgress({
        userId: user.uid,
        courseId,
        lessonId,
        completed: !isCompleted
      })
    } catch (error) {
      console.error("Error toggling lesson completion:", error)
    }
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">Course Progress</span>
        <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
      </div>
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#f90026] transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="text-sm text-gray-400">
        {completedLessons.length} of {totalLessons} lessons completed
      </div>
    </div>
  )
} 