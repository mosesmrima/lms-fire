"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { CourseForm } from "@/components/course-form"
import { useCourse } from "@/hooks/queries/use-courses"
import { addToast } from "@heroui/react"
import type { Course } from "@/lib/types"

export default function EditCoursePage() {
  const params = useParams()
  const courseId = params.courseId as string
  const { data: course, isLoading, error } = useCourse(courseId)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (error) {
      addToast({
        title: "Error",
        description: "Failed to load course. Please try again.",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
    }
  }, [error])

  const handleSubmit = async (data: Partial<Course>) => {
    setIsSubmitting(true)
    try {
      // The actual update is handled by the CourseForm component
      // This is just for any additional logic we might want to add
      console.log("Course updated:", data)
    } catch (error) {
      console.error("Error updating course:", error)
      addToast({
        title: "Error",
        description: "Failed to update course. Please try again.",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-2 text-sm text-muted-foreground">Loading course...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Course Not Found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The course you're looking for doesn't exist or you don't have permission to edit it.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Edit Course</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Update your course information below. All fields marked with * are required.
        </p>
      </div>

      <div className="rounded-lg border border-[#333333] bg-card p-6">
        <CourseForm
          initialData={course}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  )
} 