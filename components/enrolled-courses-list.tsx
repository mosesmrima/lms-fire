"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/stores/auth-store"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useCourses } from "@/hooks/queries/use-courses"
import { useEnrollmentStatus } from "@/hooks/queries/use-enrollment"
import { useCourseProgress } from "@/hooks/queries/use-progress"

export function EnrolledCoursesList() {
  const { user, loading: authLoading } = useAuthStore()
  const { data: courses, isLoading: coursesLoading } = useCourses()
  const { data: courseProgress } = useCourseProgress(user?.uid || "", courses?.map(c => c.id).join(",") || "")

  // Calculate progress percentage for a course
  const calculateProgress = (courseId: string) => {
    const course = courses?.find((c) => c.id === courseId)
    if (!course || !course.lessons || course.lessons.length === 0) return 0

    const progress = courseProgress?.[courseId] || {}
    const completedLessons = Object.values(progress).filter((lesson) => lesson.completed).length
    return Math.round((completedLessons / course.lessons.length) * 100)
  }

  if (authLoading || coursesLoading) {
    return (
      <div className="flex justify-center items-center py-8 sm:py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <h3 className="text-lg sm:text-xl font-semibold mb-2">You haven't enrolled in any courses yet</h3>
        <p className="text-gray-400 mb-6 text-sm sm:text-base">Browse our courses and start learning today!</p>
        <Button asChild>
          <Link href="/courses">Browse Courses</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <Card key={course.id}>
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
            <p className="text-gray-400 text-sm mb-4">{course.description}</p>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-[#f90026] h-2.5 rounded-full"
                style={{ width: `${calculateProgress(course.id)}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">
              {calculateProgress(course.id)}% Complete
            </p>
            </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href={`/courses/${course.id}`}>Continue Learning</Link>
              </Button>
            </CardFooter>
          </Card>
      ))}
    </div>
  )
}
