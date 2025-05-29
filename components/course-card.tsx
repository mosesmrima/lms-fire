import { Card, CardBody, CardFooter, CardHeader, Button, Chip } from "@heroui/react"
import type { Course } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  console.log(course)
  return (
    <Card className="bg-[#1e1e1e] border-[#333333] overflow-hidden flex flex-col h-full">
      <div className="relative aspect-video">
        <Image
          src={course.image || "/placeholder.svg"}
          alt={course.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
      <CardHeader className="pb-2 flex-col">
        <div className="flex flex-wrap gap-2 w-full justify-end">
        {course.duration && (
          <Chip size="sm" variant="bordered" className="text-xs">
            {course.duration}
          </Chip>
        )}
          <Chip size="sm" variant="bordered" className="text-xs">
            {course.lessons.length} lessons
          </Chip>
          <Chip
          className="text-xs"
          size="sm"
          variant="bordered"
          >
            {course.level}
          </Chip>
        </div>
        <div className="flex justify-between items-center w-full">
          <h3 className="text-lg sm:text-xl">{course.title}</h3>
        </div>
        <p className="text-xs sm:text-sm text-gray-300">{course.instructor}</p>
      </CardHeader>
      <CardBody className="flex-grow">
        <p className="text-gray-300 text-sm line-clamp-3">{course.description}</p>
        <div className="flex flex-wrap items-center gap-2 mt-4 self-end">
        </div>
      </CardBody>
      <CardFooter>
        <Link href={`/courses/${course.id}`} className="w-full">
          <Button
            color="primary"
            className="w-full hover:text-white text-sm"
          >
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
