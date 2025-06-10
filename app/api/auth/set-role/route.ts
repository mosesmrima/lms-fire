import { NextResponse } from "next/server"
import { initFirebaseAdmin, ROLES } from "@/app/api/_lib/firebase-admin"

export async function POST(request: Request) {
  try {
    const { auth } = initFirebaseAdmin()
    const body = await request.json()
    const { uid } = body

    if (!uid) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 })
    }

    try {
      // Set student role for new users
      await auth.setCustomUserClaims(uid, { 
        roles: [ROLES.STUDENT],
        rolesUpdatedAt: Date.now()
      })

      return NextResponse.json({
        success: true,
        message: `Student role set for user: ${uid}`,
      })
    } catch (error: any) {
      console.error("Error setting user role:", error)

      return NextResponse.json(
        {
          success: false,
          error: error.message || "Failed to set user role",
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("Unexpected error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
} 