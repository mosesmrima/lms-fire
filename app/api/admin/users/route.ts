import { NextRequest, NextResponse } from "next/server"
import { initFirebaseAdmin } from "@/lib/firebase/firebase-admin-init"
import { isAdmin } from "@/lib/auth-utils"


export async function GET() {
  try {
    const { auth } = initFirebaseAdmin()
    
    // Get all users
    const listUsersResult = await auth.listUsers(1000)
    const users = listUsersResult.users.map(user => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      roles: user.customClaims?.roles || [],
    }))

    return NextResponse.json(users)
  } catch (error) {
    console.error("[USERS_GET]", error)
    return NextResponse.json(
      { error: "Internal Error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    if (!isAdmin(request)) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { email, password, displayName, roles } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Initialize Firebase Admin
    const { auth } = initFirebaseAdmin()

    // Create user
    const userRecord = await auth.createUser({
      email,
      password,
      displayName,
    })

    // Set roles if provided
    if (roles && Array.isArray(roles)) {
      await auth.setCustomUserClaims(userRecord.uid, { roles })
    }

    return NextResponse.json({
      success: true,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        roles: userRecord.customClaims?.roles || [],
      },
    })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
