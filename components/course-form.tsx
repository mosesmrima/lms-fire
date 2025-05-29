"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button, Input, Textarea, Select, SelectItem, addToast } from "@heroui/react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useCourseMutations } from "@/hooks/queries/use-courses"
import type { Course } from "@/lib/types"

interface CourseFormProps {
  initialData?: Course
  onSubmit?: (data: Partial<Course>) => Promise<void>
  isLoading?: boolean
}

type CourseLevel = "beginner" | "intermediate" | "advanced"

interface CourseFormData {
  title: string
  description: string
  level: CourseLevel
  image: string
}

export function CourseForm({ initialData, onSubmit, isLoading: externalLoading }: CourseFormProps) {
  const router = useRouter()
  const { user } = useAuthStore()
  const { createCourse, updateCourse, isCreating, isUpdating } = useCourseMutations()
  const [formData, setFormData] = useState<CourseFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    level: (initialData?.level as CourseLevel) || "beginner",
    image: initialData?.image || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      addToast({
        title: "Authentication Required",
        description: "Please sign in to create or update courses",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
      return
    }

    try {
      if (onSubmit) {
        await onSubmit(formData)
      } else if (initialData) {
        await updateCourse({
          courseId: initialData.id,
          courseData: {
            ...formData,
            instructorId: user.uid
          }
        })
        addToast({
          title: "Success",
          description: "Course updated successfully",
          timeout: 3000,
          shouldShowTimeoutProgress: true
        })
        router.push("/instructor/courses")
      } else {
        await createCourse({
          userId: user.uid,
          courseData: formData
        })
        addToast({
          title: "Success",
          description: "Course created successfully",
          timeout: 3000,
          shouldShowTimeoutProgress: true
        })
        router.push("/instructor/courses")
      }
    } catch (error) {
      console.error("Error saving course:", error)
      addToast({
        title: "Error",
        description: "Failed to save course. Please try again.",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
    }
  }

  const isLoading = externalLoading || isCreating || isUpdating

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Course Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
        disabled={isLoading}
      />
      <Textarea
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        required
        disabled={isLoading}
      />
      <div className="space-y-2">
        <label htmlFor="level" className="block text-sm font-medium">
          Level
        </label>
        <select
          id="level"
          value={formData.level}
          onChange={(e) => setFormData({ ...formData, level: e.target.value as CourseLevel })}
          required
          disabled={isLoading}
          className="w-full rounded-md border border-[#333333] bg-background px-3 py-2 text-sm"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
      <Input
        label="Image URL"
        value={formData.image}
        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        placeholder="https://example.com/image.jpg"
        disabled={isLoading}
      />
      <Button
        type="submit"
        color="primary"
        isLoading={isLoading}
        disabled={isLoading}
      >
        {initialData ? "Update Course" : "Create Course"}
      </Button>
    </form>
  )
}
