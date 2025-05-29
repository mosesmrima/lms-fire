"use client"

import { useState, useEffect } from "react"
import { Card, CardBody, Progress, Button } from "@heroui/react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useStore } from "@/lib/store"
import { LoadingSpinner } from "@/components/loading-spinner"
import { CheckCircle, Circle } from "lucide-react"

interface CourseProgressProps {
  courseId: string
  totalLessons: number
}

export function CourseProgress({ courseId, totalLessons }: CourseProgressProps) {
  const [progress, setProgress] = useState(0)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuthStore()
  const { getCompletedLessons, markLessonComplete, markLessonIncomplete } = useStore()

  useEffect(() => {
    if (user) {
      loadProgress()
    }
  }, [user, courseId])

  const loadProgress = async () => {
    try {
      const completed = await getCompletedLessons(user!.uid, courseId)
      setCompletedLessons(completed)
      setProgress((completed.length / totalLessons) * 100)
    } catch (error) {
      console.error("Error loading progress:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleLessonCompletion = async (lessonId: string) => {
    if (!user) return

    try {
      if (completedLessons.includes(lessonId)) {
        await markLessonIncomplete(user.uid, courseId, lessonId)
        setCompletedLessons(completedLessons.filter((id) => id !== lessonId))
      } else {
        await markLessonComplete(user.uid, courseId, lessonId)
        setCompletedLessons([...completedLessons, lessonId])
      }
      setProgress((completedLessons.length / totalLessons) * 100)
    } catch (error) {
      console.error("Error toggling lesson completion:", error)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <Card className="bg-[#1e1e1e] border-[#333333]">
      <CardBody>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Course Progress</h3>
            <Progress
              value={progress}
              color="primary"
              className="h-2"
              aria-label="Course progress"
            />
            <p className="text-sm text-gray-400 mt-2">
              {Math.round(progress)}% Complete
            </p>
          </div>

          <div className="space-y-2">
            {Array.from({ length: totalLessons }).map((_, index) => {
              const lessonId = `lesson-${index + 1}`
              const isCompleted = completedLessons.includes(lessonId)

              return (
                <Button
                  key={lessonId}
                  color={isCompleted ? "success" : "default"}
                  variant="flat"
                  className="w-full justify-start"
                  onClick={() => toggleLessonCompletion(lessonId)}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 mr-2 text-gray-400" />
                  )}
                  Lesson {index + 1}
                </Button>
              )
            })}
          </div>
        </div>
      </CardBody>
    </Card>
  )
} 