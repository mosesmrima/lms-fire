import { NextResponse } from "next/server"
import { initializeFirebaseAdmin } from "../firebase-admin-init"
import { ROLES } from "@/lib/firebase-admin"

export async function POST() {
  try {
    const { auth, db } = initializeFirebaseAdmin()

    // Get all users
    const listUsersResult = await auth.listUsers()
    const users = listUsersResult.users

    // Count of users updated
    let updatedCount = 0

    // Process each user
    for (const user of users) {
      try {
        // Check if user has a role in Firestore
        const userDoc = await db.collection("users").doc(user.uid).get()

        if (userDoc.exists) {
          const userData = userDoc.data()
          const role = userData?.role

          // If user has a role in Firestore but not in auth claims
          if (role && (!user.customClaims?.roles || user.customClaims.roles.length === 0)) {
            // Map old role to new roles array
            let roles = []

            if (role === "admin") {
              roles = [ROLES.ADMIN]
            } else if (role === "instructor") {
              roles = [ROLES.INSTRUCTOR]
            } else if (role === "student") {
              roles = [ROLES.STUDENT]
            }

            // Update user claims
            if (roles.length > 0) {
              await auth.setCustomUserClaims(user.uid, { roles })
              updatedCount++
            }
          }
        }
      } catch (error) {
        console.error(`Error processing user ${user.uid}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Migrated roles for ${updatedCount} users`,
    })
  } catch (error: any) {
    console.error("Error migrating roles:", error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to migrate roles",
      },
      { status: 500 },
    )
  }
}
