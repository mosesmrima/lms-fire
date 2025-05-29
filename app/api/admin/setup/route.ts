import { NextRequest, NextResponse } from "next/server"
import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { ROLES } from "@/lib/types/roles"

// Initialize Firebase Admin
function initFirebaseAdmin() {
  if (getApps().length > 0) {
    return {
      auth: getAuth(),
    }
  }

  const app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })

  return {
    auth: getAuth(app),
  }
}

export async function GET() {
  try {
    const { auth } = initFirebaseAdmin()
    
    // Check if any admin users exist
    const listUsersResult = await auth.listUsers(1000)
    const hasAdmin = listUsersResult.users.some(user => 
      (user.customClaims?.roles as string[] || []).includes(ROLES.ADMIN)
    )

    return NextResponse.json({
      success: true,
      isSetupComplete: hasAdmin,
      adminCount: listUsersResult.users.filter(user => 
        (user.customClaims?.roles as string[] || []).includes(ROLES.ADMIN)
      ).length
    })
  } catch (error) {
    console.error("Error checking setup status:", error)
    return NextResponse.json(
      { error: "Failed to check setup status" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { auth } = initFirebaseAdmin()
    
    // Check if setup is already complete
    const listUsersResult = await auth.listUsers(1000)
    const hasAdmin = listUsersResult.users.some(user => 
      (user.customClaims?.roles as string[] || []).includes(ROLES.ADMIN)
    )

    if (hasAdmin) {
      return NextResponse.json(
        { error: "Admin setup is already complete" },
        { status: 400 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
        return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
        )
      }

    // Check if user exists
    let userRecord
    try {
      userRecord = await auth.getUserByEmail(email)
    } catch (error) {
      // User doesn't exist, create new user
      userRecord = await auth.createUser({
        email,
        password,
        emailVerified: true, // Auto-verify email for admin
      })
    }

        // Set admin role
    await auth.setCustomUserClaims(userRecord.uid, {
            roles: [ROLES.ADMIN],
      isAdmin: true,
          })

          return NextResponse.json({
            success: true,
      message: "Admin user created successfully",
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        roles: [ROLES.ADMIN],
      }
    })
  } catch (error) {
    console.error("Error in admin setup:", error)
    return NextResponse.json(
      { error: "Failed to set up admin user" },
      { status: 500 }
    )
  }
}
