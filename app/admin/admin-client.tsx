"use client"

import { useQuery } from "@tanstack/react-query"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import { Card, CardBody, CardHeader, CardTitle } from "@heroui/react"
import { Users, BookOpen, GraduationCap, Award } from "lucide-react"

interface AdminStats {
  totalUsers: number
  totalCourses: number
  totalEnrollments: number
  totalCompletions: number
}

export default function AdminClientPage() {
  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [usersSnapshot, coursesSnapshot, enrollmentsSnapshot, completionsSnapshot] = await Promise.all([
        getDocs(collection(db, "users")),
        getDocs(collection(db, "courses")),
        getDocs(collection(db, "enrollments")),
        getDocs(query(collection(db, "enrollments"), where("completed", "==", true)))
      ])

      return {
        totalUsers: usersSnapshot.size,
        totalCourses: coursesSnapshot.size,
        totalEnrollments: enrollmentsSnapshot.size,
        totalCompletions: completionsSnapshot.size
      }
    }
  })

  if (isLoading) {
    return <div>Loading admin statistics...</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardBody>
          <div className="text-2xl font-bold">{stats?.totalUsers}</div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardBody>
          <div className="text-2xl font-bold">{stats?.totalCourses}</div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardBody>
          <div className="text-2xl font-bold">{stats?.totalEnrollments}</div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Course Completions</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardBody>
          <div className="text-2xl font-bold">{stats?.totalCompletions}</div>
        </CardBody>
      </Card>
    </div>
  )
}
