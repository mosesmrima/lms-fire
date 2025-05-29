"use client"

import { Button } from "@heroui/react"
import Link from "next/link"
import { InstructorCoursesList } from "@/components/instructor-courses-list"

export default function InstructorCoursesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Courses</h1>
        <Button asChild>
          <Link href="/instructor/courses/new">Create New Course</Link>
        </Button>
      </div>
      <InstructorCoursesList />
    </div>
  )
} 