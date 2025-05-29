"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardBody, CardHeader } from "@heroui/react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useCourse } from "@/hooks/queries/use-courses"
import { useCourseMutations } from "@/hooks/queries/use-courses"
import { CourseForm } from "@/components/course-form"
import { LoadingSpinner } from "@/components/loading-spinner"
import { toast } from "sonner"

interface EditCoursePageProps {
  params: {
    courseId: string
  }
}

export default function EditCoursePage({ params }: EditCoursePageProps) {
  const router = useRouter()
  const { user, userRole } = useAuthStore()
  const { courseId } = params

  const { data: course, isLoading } = useCourse(courseId)
  const { updateCourse, isUpdating } = useCourseMutations()

  useEffect(() => {
    if (!user || userRole !== "instructor") {
      toast.error("You must be an instructor to edit courses")
      router.push("/courses")
    }
  }, [user, userRole, router])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!course) {
    return <div>Course not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <h1 className="text-3xl font-bold">Edit Course</h1>
        </CardHeader>
        <CardBody>
          <CourseForm
            initialData={course}
            onSubmit={async (data) => {
              try {
                await updateCourse({
                  courseId,
                  courseData: data
                })
                toast.success("Course updated successfully")
                router.push(`/courses/${courseId}`)
              } catch (error) {
                console.error("Error updating course:", error)
                toast.error("Failed to update course")
              }
            }}
            isLoading={isUpdating}
          />
        </CardBody>
      </Card>
    </div>
  )
}
