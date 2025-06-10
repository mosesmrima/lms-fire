"use client"

import { useRouter } from "next/navigation"
import { Button, addToast } from "@heroui/react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useEnrollmentStatus, useEnrollmentMutations } from "@/hooks/queries/use-enrollment"

interface EnrollButtonProps {
  courseId: string
  className?: string
}

export function EnrollButton({ courseId, className = "" }: EnrollButtonProps) {
  const router = useRouter()
  const { user } = useAuthStore()
  const { data: isEnrolled, isLoading: isCheckingEnrollment } = useEnrollmentStatus(user?.uid || "", courseId)
  const { enroll, unenroll, isEnrolling, isUnenrolling } = useEnrollmentMutations()

  const handleEnrollment = async () => {
    if (!user) {
      router.push(`/signin?callbackUrl=/courses/${courseId}`)
      return
    }

    try {
      if (isEnrolled) {
        await unenroll({ userId: user.uid, courseId })
        addToast({
          title: "Success",
          description: "Successfully unenrolled from the course.",
          color: "success",
          timeout: 5000,
          shouldShowTimeoutProgress: true
        })
      } else {
        await enroll({ userId: user.uid, courseId })
        addToast({
          title: "Success",
          description: "Successfully enrolled in the course.",
          color: "success",
          timeout: 5000,
          shouldShowTimeoutProgress: true
        })
        router.push(`/courses/${courseId}`)
      }
    } catch (error) {
      console.error("Error handling enrollment:", error)
      addToast({
        title: "Error",
        description: "Failed to process enrollment. Please try again.",
        color: "danger",
        timeout: 5000,
        shouldShowTimeoutProgress: true
      })
    }
  }

  if (isCheckingEnrollment) {
    return <Button isLoading className={className} />
  }

  return (
    <Button
      onPress={handleEnrollment}
      isLoading={isEnrolling || isUnenrolling}
      className={className}
    >
      {isEnrolled ? "Unenroll" : "Enroll Now"}
    </Button>
  )
}
