"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button, Input, Textarea, Select, SelectItem } from "@heroui/react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useCourseMutations } from "@/hooks/queries/use-courses"
import type { Course } from "@/lib/types"

interface CourseFormProps {
  course?: Course
}

export function CourseForm({ course }: CourseFormProps) {
  const router = useRouter()
  const { user } = useAuthStore()
  const { createCourse, updateCourse, isCreating, isUpdating } = useCourseMutations()
  const [formData, setFormData] = useState({
    title: course?.title || "",
    description: course?.description || "",
    level: course?.level || "beginner",
    image: course?.image || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      if (course) {
        await updateCourse({
          id: course.id,
          ...formData,
          instructorId: user.uid,
        })
      } else {
        await createCourse({
          ...formData,
          instructorId: user.uid,
        })
      }
      router.push("/instructor/courses")
    } catch (error) {
      console.error("Error saving course:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Course Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />
      <Textarea
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        required
      />
      <Select
        label="Level"
        value={formData.level}
        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
        required
      >
        <SelectItem value="beginner">Beginner</SelectItem>
        <SelectItem value="intermediate">Intermediate</SelectItem>
        <SelectItem value="advanced">Advanced</SelectItem>
      </Select>
      <Input
        label="Image URL"
        value={formData.image}
        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        placeholder="https://example.com/image.jpg"
      />
      <Button
        type="submit"
        color="primary"
        isLoading={isCreating || isUpdating}
        disabled={isCreating || isUpdating}
      >
        {course ? "Update Course" : "Create Course"}
      </Button>
    </form>
  )
} 