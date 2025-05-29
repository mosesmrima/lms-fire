"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Tabs, Tab, Card, Button, addToast } from "@heroui/react"
import { CourseForm } from "@/components/course-form"
import { LessonForm } from "@/components/lesson-form"
import { LessonList } from "@/components/lesson-list"
import { useCourse } from "@/hooks/queries/use-courses"
import type { Course, Lesson } from "@/lib/types"

export default function CourseManagementPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  const isNewCourse = courseId === "new"
  const { data: course, isLoading, error } = useCourse(courseId)
  const [activeTab, setActiveTab] = useState("details")
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  if (!isNewCourse && !course) {
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

  const handleSubmit = async (data: Partial<Course>) => {
    setIsSubmitting(true)
    try {
      // The actual update is handled by the CourseForm component
      console.log("Course updated:", data)
      addToast({
        title: "Success",
        description: isNewCourse ? "Course created successfully" : "Course updated successfully",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
      if (isNewCourse) {
        router.push(`/instructor/courses/${data.id}`)
      }
    } catch (error) {
      console.error("Error saving course:", error)
      addToast({
        title: "Error",
        description: "Failed to save course. Please try again.",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLessonSubmit = async (data: Partial<Lesson>) => {
    setIsSubmitting(true)
    try {
      // Handle lesson submission
      console.log("Lesson submitted:", data)
      addToast({
        title: "Success",
        description: "Lesson saved successfully",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
    } catch (error) {
      console.error("Error saving lesson:", error)
      addToast({
        title: "Error",
        description: "Failed to save lesson. Please try again.",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          {isNewCourse ? "Create New Course" : "Edit Course"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isNewCourse
            ? "Fill in the details below to create your new course."
            : "Update your course information and manage lessons below."}
        </p>
      </div>

      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        className="space-y-6"
      >
        <Tab key="details" title="Course Details">
          <Card className="p-6">
            <CourseForm
              initialData={course}
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
            />
          </Card>
        </Tab>

        {!isNewCourse && (
          <>
            <Tab key="lessons" title="Lessons">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Add New Lesson</h2>
                  <LessonForm
                    onSubmit={handleLessonSubmit}
                    isLoading={isSubmitting}
                  />
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Course Lessons</h2>
                  <LessonList
                    courseId={courseId}
                    lessons={course?.lessons || []}
                    isEnrolled={false}
                  />
                </Card>
              </div>
            </Tab>

            <Tab key="preview" title="Preview">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Course Preview</h2>
                <div className="aspect-video bg-[#1e1e1e] rounded-lg mb-4">
                  {course?.image && (
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2">{course?.title}</h3>
                <p className="text-muted-foreground mb-4">{course?.description}</p>
                <div className="flex gap-4">
                  <Button
                    color="primary"
                    onPress={() => router.push(`/courses/${courseId}`)}
                  >
                    View Public Page
                  </Button>
                  <Button
                    variant="bordered"
                    onPress={() => router.push(`/courses/${courseId}/preview`)}
                  >
                    Preview as Student
                  </Button>
                </div>
              </Card>
            </Tab>
          </>
        )}
      </Tabs>
    </div>
  )
} 