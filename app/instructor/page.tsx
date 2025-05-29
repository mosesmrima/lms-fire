"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@heroui/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InstructorCoursesList } from "@/components/instructor-courses-list"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { useAuthStore } from "@/lib/stores/auth-store"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ROLES } from "@/lib/types/roles"
import { toast } from "sonner"

export default function InstructorDashboard() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuthStore()

  useEffect(() => {
    console.log("[InstructorDashboard] Auth state:", {
      loading: authLoading,
      user: user ? {
        uid: user.uid,
        roles: user.roles,
        isAdmin: user.isAdmin,
        isInstructor: user.isInstructor
      } : null
    })

    if (!authLoading && !user) {
      console.log("[InstructorDashboard] No user found, redirecting to login")
      toast.error("Please log in to access the instructor dashboard")
      router.push("/login")
      return
    }

    // Check if user has admin role (admins should have access to everything)
    if (!authLoading && user && user.isAdmin) {
      console.log("[InstructorDashboard] Admin access granted")
      return
    }

    // Check if user has instructor role
    if (!authLoading && user && !user.isInstructor) {
      console.log("[InstructorDashboard] User is not an instructor, redirecting to dashboard")
      toast.error("You don't have permission to access the instructor dashboard")
      router.push("/dashboard")
    }
  }, [user, authLoading, router])

  if (authLoading) {
    console.log("[InstructorDashboard] Loading auth state")
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Allow access if user is admin or instructor
  if (!user || (!user.isAdmin && !user.isInstructor)) {
    console.log("[InstructorDashboard] Access denied, user roles:", user?.roles)
    return null
  }

  console.log("[InstructorDashboard] Rendering dashboard for user:", {
    uid: user.uid,
    roles: user.roles,
    isAdmin: user.isAdmin,
    isInstructor: user.isInstructor
  })

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Instructor Dashboard</h1>
        <Link href="/instructor/create">
          <Button className="bg-[#f90026] hover:bg-[#d10021] w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Course
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="bg-[#1e1e1e] mb-6 w-full">
          <TabsTrigger value="courses" className="flex-1">
            My Courses
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex-1">
            Analytics
          </TabsTrigger>
        </TabsList>
        <TabsContent value="courses">
          <InstructorCoursesList />
        </TabsContent>
        <TabsContent value="analytics">
          <div className="bg-[#1e1e1e] p-4 sm:p-6 rounded-lg border border-[#333333] text-center py-8 sm:py-12">
            <h3 className="text-lg sm:text-xl font-bold mb-2">Analytics Coming Soon</h3>
            <p className="text-gray-300 text-sm sm:text-base">
              Course performance analytics will be available in the next update.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
