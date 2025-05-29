import { NextResponse } from "next/server"
import { getUserByEmail, setAdminRole } from "../_lib/firebase-admin-minimal"

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    // Get user by email
    const user = await getUserByEmail(email)

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Set admin role
    await setAdminRole(user.uid)

    return NextResponse.json({
      success: true,
      message: `Admin role granted to ${email}`,
    })
  } catch (error: any) {
    console.error("Error in simple setup:", error)

    return NextResponse.json({
      success: false,
      error: error.message || "An error occurred",
      stack: error.stack,
    })
  }
}
