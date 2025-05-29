import { useQuery } from "@tanstack/react-query"
import { getCourse } from "@/lib/firebase"

export function useCourse(courseId: string) {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourse(courseId),
    enabled: !!courseId
  })
} 