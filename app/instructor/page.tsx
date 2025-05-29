"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button, addToast, Tabs, Tab, Card, CardBody } from "@heroui/react"
import { InstructorCoursesList } from "@/components/instructor-courses-list"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { useAuthStore } from "@/lib/stores/auth-store"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function InstructorDashboard() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuthStore()

  const tabs = [
    {
      id: "courses",
      label: "My Courses",
      content: <InstructorCoursesList />
    },
    {
      id: "analytics",
      label: "Analytics",
      content: (
        <div className="text-center py-8 sm:py-12">
          <h3 className="text-lg sm:text-xl font-bold mb-2">Analytics Coming Soon</h3>
          <p className="text-gray-300 text-sm sm:text-base">
            Course performance analytics will be available in the next update.
          </p>
        </div>
      )
    }
  ]

  useEffect(() => {
    if (!authLoading && !user) {
      addToast({
        title: "Authentication Required",
        description: "Please log in to access the instructor dashboard",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
      router.push("/login")
      return
    }

    if (!authLoading && user && !user.isAdmin && !user.isInstructor) {
      addToast({
        title: "Access Denied",
        description: "You don't have permission to access the instructor dashboard",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
      router.push("/dashboard")
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user || (!user.isAdmin && !user.isInstructor)) {
    return null
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Instructor Dashboard</h1>
        <Link href="/instructor/courses/new">
          <Button className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Course
          </Button>
        </Link>
      </div>

      <div className="flex w-full flex-col">
        <Tabs variant="underlined" aria-label="Instructor Dashboard" items={tabs}>
          {(item) => (
            <Tab key={item.id} title={item.label}>
              <Card>
                <CardBody>{item.content}</CardBody>
              </Card>
            </Tab>
          )}
        </Tabs>
      </div>
    </div>
  )
}
