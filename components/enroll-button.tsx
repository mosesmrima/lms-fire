"use client"

import { useState, useEffect } from "react"
import { Button } from "@heroui/react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { enrollUserInCourse, unenrollUserFromCourse, isUserEnrolledInCourse } from "@/lib/firebase"

interface EnrollButtonProps {
  courseId: string
  isEnrolled?: boolean
  isCheckingEnrollment?: boolean
  className?: string
}

export function EnrollButton({
  courseId,
  isEnrolled = false,
  isCheckingEnrollment = false,
  className = "",
}: EnrollButtonProps) {
  const [enrolled, setEnrolled] = useState(isEnrolled)
  const [loading, setLoading] = useState(false)
  const { user } = useAuthStore()
  const router = useRouter()

  // Verify enrollment status on mount and when user changes
  useEffect(() => {
    const verifyEnrollment = async () => {
      if (!user) return
      try {
        const isEnrolled = await isUserEnrolledInCourse(user.uid, courseId)
        setEnrolled(isEnrolled)
      } catch (error) {
        console.error("Error verifying enrollment:", error)
      }
    }
    verifyEnrollment()
  }, [user, courseId])

  const handleEnrollment = async () => {
    if (!user) {
      router.push(`/signin?callbackUrl=/courses/${courseId}`)
      return
    }

    setLoading(true)

    try {
      if (enrolled) {
        await unenrollUserFromCourse(user.uid, courseId)
        setEnrolled(false)
        toast({
          title: "Success",
          description: "Successfully unenrolled from the course.",
        })
      } else {
        const success = await enrollUserInCourse(user.uid, courseId)
        if (success) {
          setEnrolled(true)
          toast({
            title: "Success",
            description: "Successfully enrolled in the course.",
          })
          router.push(`/courses/${courseId}`)
        }
      }
    } catch (error) {
      console.error("Error handling enrollment:", error)
      toast({
        title: "Error",
        description: "Failed to process enrollment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleEnrollment}
      isDisabled={loading || isCheckingEnrollment}
      color={enrolled ? "default" : "primary"}
      variant="flat"
      className={className}
      size="lg"
      fullWidth
    >
      {loading || isCheckingEnrollment ? "Processing..." : enrolled ? "Unenroll from Course" : "Enroll in Course"}
    </Button>
  )
}
