import { adminAuth } from "./firebase-admin"

// Get a user by email
export async function getUserByEmail(email: string) {
  if (!adminAuth) {
    throw new Error("Firebase Admin not initialized")
  }

  try {
    console.log(`Getting user by email: ${email}`)
    const user = await adminAuth.getUserByEmail(email)
    console.log(`User found: ${user.uid}`)
    return user
  } catch (error) {
    console.error(`Error getting user by email ${email}:`, error)
    throw error
  }
}

// Set admin role for a user
export async function setAdminRole(uid: string) {
  if (!adminAuth) {
    throw new Error("Firebase Admin not initialized")
  }

  try {
    console.log(`Setting admin role for user: ${uid}`)

    // Get current user
    const user = await adminAuth.getUser(uid)
    console.log(`Current user claims:`, user.customClaims || {})

    // Set custom claims
    const claims = {
      admin: true,
      role: "admin",
      roles: ["admin"],
    }

    console.log(`Setting claims:`, claims)
    await adminAuth.setCustomUserClaims(uid, claims)

    // Verify claims were set
    const updatedUser = await adminAuth.getUser(uid)
    console.log(`Updated user claims:`, updatedUser.customClaims || {})

    return true
  } catch (error) {
    console.error(`Error setting admin role for user ${uid}:`, error)
    throw error
  }
}
