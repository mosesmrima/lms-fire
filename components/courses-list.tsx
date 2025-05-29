"use client"

import { CourseCard } from "@/components/course-card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useCourses } from "@/hooks/use-courses"

export function CoursesList() {
  const { data: courses, isLoading, error } = useCourses()

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-[#1e1e1e] rounded-lg">
        <h3 className="text-xl font-bold mb-2">Error</h3>
        <p className="text-gray-300 mb-6">Failed to load courses. Please try again later.</p>
      </div>
    )
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-12 bg-[#1e1e1e] rounded-lg">
        <h3 className="text-xl font-bold mb-2">No Courses Available</h3>
        <p className="text-gray-300 mb-6">Check back later for new courses.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}
