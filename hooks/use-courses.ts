import { useQuery } from "@tanstack/react-query"
import { getCourses } from "@/lib/firebase"
import type { Course } from "@/lib/types"

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const coursesData = await getCourses()
      return coursesData.map(course => ({
        id: course.id,
        title: course.title || "",
        description: course.description || "",
        instructor: course.instructor || "",
        instructorId: course.instructorId,
        level: course.level || "",
        duration: course.duration || "",
        image: course.image || "",
        students: course.students || 0,
        certificate: course.certificate || false,
        lessons: course.lessons.map(lesson => ({
          id: lesson.id,
          title: "",
          description: "",
          duration: "",
          videoUrl: "",
          courseId: course.id
        })),
        createdAt: course.createdAt,
        updatedAt: course.updatedAt
      })) as Course[]
    }
  })
} 