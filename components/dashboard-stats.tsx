"use client"

import { useEffect, useState } from "react"
import { Card, CardBody, Button } from "@heroui/react"
import { BookOpen, Award, Clock } from "lucide-react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { getAllUserProgress, getUserEnrollments, getCourses } from "@/lib/firebase"
import { LoadingSpinner } from "@/components/loading-spinner"

export function DashboardStats() {
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedLessons: 0,
    totalHours: 0,
  })

  useEffect(() => {
    if (user) {
      fetchStats()
    }
  }, [user])

  const fetchStats = async () => {
    try {
      const [progress, enrollments, courses] = await Promise.all([
        getAllUserProgress(user!.uid),
        getUserEnrollments(user!.uid),
        getCourses(),
      ])

      const enrolledCourses = enrollments.length
      const completedLessons = Object.values(progress).reduce(
        (total, courseProgress) => total + (courseProgress.completedLessons?.length || 0),
        0
      )

      // Calculate total hours from enrolled courses
      const totalHours = enrollments.reduce((total, enrollment) => {
        const course = courses.find((c) => c.id === enrollment.courseId)
        return total + (course?.duration ? parseInt(course.duration) : 0)
      }, 0)

      setStats({
        enrolledCourses,
        completedLessons,
        totalHours,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="bg-[#1e1e1e] border-[#333333]">
        <CardBody>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-[#f90026]/10">
              <BookOpen className="h-6 w-6 text-[#f90026]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Enrolled Courses</p>
              <p className="text-2xl font-bold">{stats.enrolledCourses}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="bg-[#1e1e1e] border-[#333333]">
        <CardBody>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-[#f90026]/10">
              <Award className="h-6 w-6 text-[#f90026]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Completed Lessons</p>
              <p className="text-2xl font-bold">{stats.completedLessons}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="bg-[#1e1e1e] border-[#333333]">
        <CardBody>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-[#f90026]/10">
              <Clock className="h-6 w-6 text-[#f90026]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Hours</p>
              <p className="text-2xl font-bold">{stats.totalHours}</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
