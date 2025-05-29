import { NextResponse } from "next/server"
import { getFirebaseAuth } from "../_lib/firebase-admin-minimal"

export async function GET() {
  try {
    // Get Firebase Auth
    const auth = getFirebaseAuth()

    // Try a simple operation
    const listUsersResult = await auth.listUsers(1)

    return NextResponse.json({
      success: true,
      message: "Firebase Admin is working correctly",
      userCount: listUsersResult.users.length,
    })
  } catch (error: any) {
    console.error("Error in simple test:", error)

    return NextResponse.json({
      success: false,
      error: error.message || "An error occurred",
      stack: error.stack,
    })
  }
}
