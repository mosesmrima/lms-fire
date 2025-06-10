import { NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase/admin"
import { ROLES } from "@/lib/rbac"

export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = await params
    const { auth } = adminAuth()
    const { role, action } = await request.json()

    // Validate role
    if (!Object.values(ROLES).includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      )
    }

    // Get current user claims
    const user = await auth.getUser(userId)
    const currentRoles = user.customClaims?.roles || []

    // Update roles based on action
    let newRoles
    if (action === 'assign') {
      newRoles = [...new Set([...currentRoles, role])]
    } else if (action === 'revoke') {
      newRoles = currentRoles.filter((r: string) => r !== role)
    } else {
      return NextResponse.json(
        { error: "Invalid action. Must be 'assign' or 'revoke'" },
        { status: 400 }
      )
    }

    // Update user's roles
    await auth.setCustomUserClaims(userId, {
      roles: newRoles,
      isAdmin: newRoles.includes(ROLES.ADMIN)
    })

    return NextResponse.json({
      success: true,
      message: `Role ${action}ed successfully`,
      roles: newRoles
    })
  } catch (error) {
    console.error("[USER_ROLE_UPDATE]", error)
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    )
  }
} 