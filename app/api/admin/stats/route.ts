import { NextResponse } from "next/server"
import { adminAuth, adminDb } from "@/lib/firebase/admin"

export async function GET() {
  try {
    const { auth } = adminAuth()
    
    // Get all users
    const listUsersResult = await auth.listUsers(1000)
    const users = listUsersResult.users

    // Calculate stats
    const stats = {
      totalUsers: users.length,
      totalCourses: 0, // TODO: Implement course counting
      totalEnrollments: 0, // TODO: Implement enrollment counting
      lastSignInTimes: users.map(user => ({
        uid: user.uid,
        lastSignInTime: user.metadata.lastSignInTime
      }))
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("[STATS_GET]", error)
    return NextResponse.json(
      { error: "Internal Error" },
      { status: 500 }
    )
  }
} 