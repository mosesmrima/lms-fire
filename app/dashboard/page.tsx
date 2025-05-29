"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardBody, CardHeader, addToast } from "@heroui/react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useCourses } from "@/hooks/queries/use-courses"
import { useCourseProgress } from "@/hooks/queries/use-progress"
import { EnrolledCoursesList } from "@/components/enrolled-courses-list"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuthStore()
  const { data: courses, isLoading: coursesLoading } = useCourses()
  const { data: progress } = useCourseProgress(user?.uid || "", courses?.map(c => c.id).join(",") || "")

  useEffect(() => {
    if (!authLoading && !user) {
      addToast({
        title: "Authentication Required",
        description: "Please log in to access your dashboard",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
      router.push("/login")
    }
  }, [user, authLoading, router])

  if (authLoading || coursesLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return null
  }

  const calculateOverallProgress = () => {
    if (!courses || !progress) return 0
    let totalLessons = 0
    let completedLessons = 0

    courses.forEach(course => {
      if (course.lessons) {
        totalLessons += course.lessons.length
        const courseProgress = progress[course.id] || {}
        completedLessons += Object.values(courseProgress).filter(lesson => lesson.completed).length
      }
    })

    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Overall Progress</h3>
          </CardHeader>
          <CardBody>
            <div className="text-3xl font-bold">{calculateOverallProgress()}%</div>
            <p className="text-sm text-gray-400">of all lessons completed</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Enrolled Courses</h3>
          </CardHeader>
          <CardBody>
            <div className="text-3xl font-bold">{courses?.length || 0}</div>
            <p className="text-sm text-gray-400">active courses</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Completed Lessons</h3>
          </CardHeader>
          <CardBody>
            <div className="text-3xl font-bold">
              {progress ? Object.values(progress).reduce((acc, course) => 
                acc + Object.values(course).filter(lesson => lesson.completed).length, 0
              ) : 0}
            </div>
            <p className="text-sm text-gray-400">lessons completed</p>
          </CardBody>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-6">Your Courses</h2>
      <EnrolledCoursesList />
    </div>
  )
}
