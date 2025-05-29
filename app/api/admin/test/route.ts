import { NextResponse } from "next/server"
import { initFirebaseAdmin } from "../../_lib/firebase-admin"

export async function GET() {
  try {
    console.log("Testing Firebase Admin initialization")

    // Initialize Firebase Admin
    let auth
    try {
      const admin = initFirebaseAdmin()
      auth = admin.auth
      console.log("Firebase Admin initialized successfully in test route")
    } catch (initError) {
      console.error("Firebase initialization error:", initError)
      return NextResponse.json(
        {
          success: false,
          error: "Firebase Admin initialization failed",
          details: initError instanceof Error ? initError.message : String(initError),
        },
        { status: 500 },
      )
    }

    // Test if we can access Firebase Auth methods
    try {
      console.log("Testing Firebase Auth by listing users")
      const listUsersResult = await auth.listUsers(1)
      console.log(`Successfully listed ${listUsersResult.users.length} users`)

      return NextResponse.json({
        success: true,
        message: "Firebase Admin initialized and tested successfully",
        userCount: listUsersResult.users.length,
      })
    } catch (authError) {
      console.error("Firebase Auth operation error:", authError)
      return NextResponse.json(
        {
          success: false,
          error: "Firebase Auth operation failed",
          details: authError instanceof Error ? authError.message : String(authError),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Unexpected error in test route:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Unexpected error occurred",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
