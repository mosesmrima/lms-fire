"use client"

import { useState } from "react"
import { Card, CardBody, CardFooter, CardHeader, Button, Badge, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Spinner, addToast } from "@heroui/react"
import { Edit, Trash, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useInstructorCourses } from "@/hooks/queries/use-courses"
import { useCourseMutations } from "@/hooks/queries/use-courses"
import type { Course } from "@/lib/types"

export function InstructorCoursesList() {
  const { user } = useAuthStore()
  const { data: courses, isLoading } = useInstructorCourses(user?.uid || "")
  const { deleteCourse, isDeleting } = useCourseMutations()
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)

  const handleDelete = async () => {
    if (!courseToDelete) return
    try {
      await deleteCourse(courseToDelete.id)
      setCourseToDelete(null)
      addToast({
        title: "Success",
        description: "Course deleted successfully",
        color: "success",
        timeout: 5000,
        shouldShowTimeoutProgress: true
      })
    } catch (error) {
      console.error("Error deleting course:", error)
      addToast({
        title: "Error",
        description: "Failed to delete course. Please try again.",
        color: "danger",
        timeout: 5000,
        shouldShowTimeoutProgress: true
      })
    }
  }

  if (isLoading) {
    return <Spinner />
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold mb-2">No Courses Created</h3>
        <p className="text-gray-400 mb-6">Create your first course to get started!</p>
        <Link href="/instructor/courses/new">
          <Button>Create Course</Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <Image
                  src={course.image || `/placeholder.svg?height=200&width=400&query=${encodeURIComponent(course.title)}`}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              </div>
            </CardHeader>
            <CardBody>
              <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
              <div className="flex items-center text-sm text-gray-400">
                <Users className="w-4 h-4 mr-2" />
                {course.enrolledStudents || 0} students
              </div>
            </CardBody>
            <CardFooter className="flex justify-between">
              <Button asChild>
                <Link href={`/instructor/courses/${course.id}/edit`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <Button
                color="danger"
                onPress={() => setCourseToDelete(course)}
                isDisabled={isDeleting}
              >
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Modal isOpen={!!courseToDelete} onClose={() => setCourseToDelete(null)}>
        <ModalContent>
          <ModalHeader>Delete Course</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete this course? This action cannot be undone.</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="bordered" onPress={() => setCourseToDelete(null)}>
              Cancel
            </Button>
            <Button color="danger" onPress={handleDelete} isDisabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
