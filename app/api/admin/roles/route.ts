import { NextResponse } from "next/server"
import { initFirebaseAdmin } from "../../_lib/firebase-admin"
import { ROLES, type Role } from "@/lib/constants"

export async function GET(request: Request) {
  try {
    const { auth } = initFirebaseAdmin()
    const url = new URL(request.url)
    const uid = url.searchParams.get("uid")

    if (!uid) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 })
    }

    try {
      const user = await auth.getUser(uid)
      const claims = user.customClaims || {}
      const roles = (claims.roles || []) as Role[]

      return NextResponse.json({
        success: true,
        roles,
      })
    } catch (error: any) {
      console.error("Error getting user roles:", error)

      return NextResponse.json(
        {
          success: false,
          error: error.message || "Failed to get user roles",
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

export async function POST(request: Request) {
  try {
    const { auth } = initFirebaseAdmin()
    const body = await request.json()
    const { uid, roles } = body

    if (!uid) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 })
    }

    if (!roles || !Array.isArray(roles)) {
      return NextResponse.json({ success: false, error: "Roles must be an array" }, { status: 400 })
    }

    // Validate roles
    const validRoles = Object.values(ROLES)
    const invalidRoles = roles.filter((role) => !validRoles.includes(role))

    if (invalidRoles.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid roles: ${invalidRoles.join(", ")}`,
        },
        { status: 400 },
      )
    }

    try {
      await auth.setCustomUserClaims(uid, { roles })

      return NextResponse.json({
        success: true,
        message: `Roles updated for user: ${uid}`,
      })
    } catch (error: any) {
      console.error("Error setting user roles:", error)

      return NextResponse.json(
        {
          success: false,
          error: error.message || "Failed to set user roles",
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
