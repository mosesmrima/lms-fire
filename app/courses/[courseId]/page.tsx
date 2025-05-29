"use client"

import { use } from 'react';
import { useRouter } from "next/navigation"
import { Card, CardBody,  Button, Tabs, Tab, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, addToast } from "@heroui/react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useCourse } from "@/hooks/queries/use-courses"
import { useEnrollmentStatus } from "@/hooks/queries/use-enrollment"
import { useEnrollmentMutations } from "@/hooks/queries/use-enrollment"
import { LoadingSpinner } from "@/components/loading-spinner"
import { CheckCircle } from "lucide-react"
import { useCourseProgress } from "@/hooks/queries/use-progress"

interface CoursePageProps {
  params: Promise<{
    courseId: string
  }>
}

export default function CoursePage({ params }: CoursePageProps) {
  const router = useRouter()
  const { user } = useAuthStore()
  const resolvedParams = use(params)
  const courseId = resolvedParams.courseId
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const { data: course, isLoading: isLoadingCourse } = useCourse(courseId)
  const { data: isEnrolled, isLoading: isLoadingEnrollment } = useEnrollmentStatus(user?.uid || "", courseId)
  const { data: progress, isLoading: isLoadingProgress } = useCourseProgress(user?.uid || "", courseId)
  const { enroll, unenroll, isEnrolling, isUnenrolling } = useEnrollmentMutations()


  // Example data for "What you'll learn" and requirements
  const whatYouWillLearn = [
    "Fundamentals of Data Security",
    "Encryption and Data Protection",
    "Incident Response and Recovery",
    "Compliance and Regulations",
    "Case Studies and Real-World Scenarios",
    "Threat Landscape Analysis",
    "Access Control and Identity Management",
    "Security Best Practices",
    "Data Security in the Cloud",
    "Hands-On Labs",
  ]
  const requirements = [
    "Internet Connection: A stable internet connection is essential for accessing course materials, participating in online discussions, and completing assessments.",
    "Basic Computer Knowledge: Familiarity with computers, tablets, or smartphones with the capability to run the required course software and view course content.",
  ]

  const handleEnroll = async () => {
    if (!user) {
      addToast({
        color: "danger",
        title: "Error",
        description: "You must be logged in to enroll in a course",
        icon: (
          <svg height={24} viewBox="0 0 24 24" width={24}>
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
            />
          </svg>
        ),
      })
      return
    }

    try {
      await enroll({ userId: user.uid, courseId })
      addToast({
        color: "success",
        title: "Success",
        description: "Successfully enrolled in course!",
        icon: (
          <svg height={24} viewBox="0 0 24 24" width={24}>
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            />
          </svg>
        ),
      })
      
      // Wait a short moment for the enrollment status to update
      setTimeout(() => {
        // Redirect to the first lesson if available
        if (course?.lessons && course.lessons.length > 0) {
          const firstLesson = course.lessons[0]
          router.push(`/courses/${courseId}/lessons/${firstLesson.id}`)
        }
      }, 1000) // Wait 1 second for the enrollment status to update
    } catch (error) {
      console.error("Error enrolling in course:", error)
      addToast({
        color: "danger",
        title: "Error",
        description: "Failed to enroll in course",
        icon: (
          <svg height={24} viewBox="0 0 24 24" width={24}>
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
            />
          </svg>
        ),
      })
    }
  }

  const handleUnenroll = async (onClose: () => void) => {
    if (!user) return

    try {
      await unenroll({ userId: user.uid, courseId })
      addToast({
        title: "Success",
        color: "success",
        description: "Successfully unenrolled from course",
        icon: (
          <svg height={24} viewBox="0 0 24 24" width={24}>
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            />
          </svg>
        ),
      })
      onClose() // Use the onClose from modal's render prop
    } catch (error) {
      console.error("Error unenrolling from course:", error)
      addToast({
        title: "Error",
        color: "danger",
        description: "Failed to unenroll from course",
        icon: (
          <svg height={24} viewBox="0 0 24 24" width={24}>
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
            />
          </svg>
        ),
      })
    }
  }

  if (isLoadingCourse || isLoadingEnrollment) {
    return (
      <div className="flex justify-center py-8 md:py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (!course) {
    return <div>Course not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <p className="text-gray-400 mb-4">{course.description}</p>
          <div className="flex items-center gap-2 mb-4">
            {/* Instructor avatar placeholder */}
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-white font-bold text-lg">{course.instructorName?.[0]}</span>
            </div>
            <span className="text-base">by <span className="text-primary font-semibold">{course.instructorName}</span></span>
          </div>
          <div className="flex items-center gap-6 text-gray-400 text-sm">
            <span>📚 {course.lessons.length} Lectures</span>
            <span>📝 40 Quizzes</span>
            <span>🌐 English</span>
          </div>
        </div>

        <Tabs aria-label="Course content" items={[
          {
            id: "overview",
            label: "Overview",
            content: (
              <div>
                <div className="bg-neutral-900 rounded-xl p-8 mb-8">
                  <h2 className="text-2xl font-bold mb-6">What you'll learn</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
                    {whatYouWillLearn.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-lg">
                        <CheckCircle className="text-green-500 w-5 h-5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-2">Requirements</h2>
                  <ul className="list-disc pl-6 space-y-1 text-base">
                    {requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          },
          {
            id: "curriculum",
            label: "Curriculum",
            content: (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Course Outline</h2>
                <div className="space-y-4">
                  {course.lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className={`border rounded-lg p-4 transition-colors ${
                        isEnrolled
                          ? ''
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">
                            {index + 1}. {lesson.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {lesson.description}
                          </p>
                        </div>
                        {isEnrolled ? (
                          <Button
                            color="primary"
                            onPress={() => router.push(`/courses/${courseId}/lessons/${lesson.id}`)}
                          >
                            Start Lesson
                          </Button>
                        ) : (
                          <div className="text-sm text-gray-500">
                            Enroll to access
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          },
          {
            id: "ratings",
            label: "Ratings",
            content: (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Ratings</h2>
                <p>Ratings and reviews go here.</p>
              </div>
            )
          }
        ]} radius='full' variant='light'>
          {(item) => (
            <Tab key={item.id} title={item.label}>
              <Card>
                <CardBody>{item.content}</CardBody>
              </Card>
            </Tab>
          )}
        </Tabs>
      </div>
      {/* Sidebar */}
      <div className="w-full lg:w-96 flex-shrink-0">
        <div className="bg-neutral-900 rounded-xl p-6 mb-6 flex flex-col items-center">
          {/* Video/Preview placeholder */}
          <div className="w-full h-48 bg-black rounded-lg flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M6.5 5.5v9l7-4.5-7-4.5z" /></svg>
            </div>
          </div>
          <div className="w-full">
            <h3 className="text-lg font-bold mb-4">This course includes:</h3>
            <ul className="space-y-2 text-base">
              <li className="flex items-center gap-2"><span className="text-pink-500">■</span> 10.5 hours on-demand video</li>
              <li className="flex items-center gap-2"><span className="text-yellow-400">▣</span> 84 downloadable resources</li>
              <li className="flex items-center gap-2"><span className="text-green-500">●</span> Full lifetime access</li>
              <li className="flex items-center gap-2"><span className="text-blue-400">▣</span> Certificate of completion</li>
              <li className="flex items-center gap-2"><span className="text-purple-400">▣</span> Access on mobile</li>
            </ul>
            {isEnrolled ? (
              <div className="space-y-4 mt-6">
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white text-lg font-semibold"
                  onPress={() => {
                    if (!course?.lessons || course.lessons.length === 0) return
                    
                    // Find the first incomplete lesson
                    const completedLessons: Record<string, boolean> = progress?.completedLessons || {}
                    const nextLesson = course.lessons.find(lesson => !completedLessons[lesson.id])
                    
                    // If all lessons are complete, go to the last lesson
                    // If no lessons are complete, go to the first lesson
                    const targetLesson = nextLesson || course.lessons[course.lessons.length - 1]
                    router.push(`/courses/${courseId}/lessons/${targetLesson.id}`)
                  }}
                >
                  Continue Learning
                </Button>
                <Button
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white text-lg font-semibold"
                  onPress={onOpen}
                  isLoading={isUnenrolling}
                  disabled={isUnenrolling}
                >
                  Unenroll
                </Button>
              </div>
            ) : (
              <Button
                className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white text-lg font-semibold"
                onPress={handleEnroll}
                isLoading={isEnrolling}
                disabled={isEnrolling}
              >
                Enroll
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Unenroll Confirmation Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Confirm Unenrollment</ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to unenroll from this course? You will lose access to all course materials and progress.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="danger" onPress={() => handleUnenroll(onClose)}>
                  Unenroll
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
} 