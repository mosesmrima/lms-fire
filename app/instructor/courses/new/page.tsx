"use client"

import { useRouter } from "next/navigation"
import { Card, addToast } from "@heroui/react"
import { CourseForm } from "@/components/course-form"
import { useCourseMutations } from "@/hooks/queries/use-courses"
import { useAuthStore } from "@/lib/stores/auth-store"
import type { Course } from "@/lib/types"

export default function NewCoursePage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { createCourse, isCreating } = useCourseMutations()

  const handleSubmit = async (data: Partial<Course>) => {
    if (!user) {
      addToast({
        title: "Authentication Required",
        description: "Please sign in to create courses",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
      return
    }

    try {
      const courseId = await createCourse({
        userId: user.uid,
        courseData: {
          ...data,
          instructorId: user.uid,
          students: 0,
          certificate: false,
          lessons: []
        }
      })

      addToast({
        title: "Success",
        description: "Course created successfully",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })

      // Redirect to the course edit page to add lessons
      router.push(`/instructor/courses/${courseId}`)
    } catch (error) {
      console.error("Error creating course:", error)
      addToast({
        title: "Error",
        description: "Failed to create course. Please try again.",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
    }
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Create New Course</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Fill in the details below to create your new course. You'll be able to add lessons after creating the course.
        </p>
      </div>

      <Card className="p-6">
        <CourseForm
          onSubmit={handleSubmit}
          isLoading={isCreating}
        />
      </Card>
    </div>
  )
} 