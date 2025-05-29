"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardBody, CardHeader } from "@heroui/react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useInstructorCourses } from "@/hooks/queries/use-courses"
import { LoadingSpinner } from "@/components/loading-spinner"
import { toast } from "sonner"

export default function InstructorDashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuthStore()
  const { data: courses, isLoading: coursesLoading } = useInstructorCourses(user?.uid || "")

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please log in to access your dashboard")
      router.push("/login")
    }
  }, [user, authLoading, router])

  if (authLoading || coursesLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return null
  }

  const calculateTotalStudents = () => {
    if (!courses) return 0
    return courses.reduce((acc, course) => acc + (course.students || 0), 0)
  }

  const calculateAverageStudents = () => {
    if (!courses || courses.length === 0) return 0
    return Math.round(calculateTotalStudents() / courses.length)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Total Courses</h3>
          </CardHeader>
          <CardBody>
            <div className="text-3xl font-bold">{courses?.length || 0}</div>
            <p className="text-sm text-gray-400">courses created</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Total Students</h3>
          </CardHeader>
          <CardBody>
            <div className="text-3xl font-bold">{calculateTotalStudents()}</div>
            <p className="text-sm text-gray-400">enrolled students</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Average Students</h3>
          </CardHeader>
          <CardBody>
            <div className="text-3xl font-bold">{calculateAverageStudents()}</div>
            <p className="text-sm text-gray-400">per course</p>
          </CardBody>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-6">Your Courses</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses?.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <h3 className="text-lg font-semibold">{course.title}</h3>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-gray-400 mb-4">{course.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">{course.students || 0} students</span>
                <span className="text-sm text-gray-400">{course.lessons?.length || 0} lessons</span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  )
} 