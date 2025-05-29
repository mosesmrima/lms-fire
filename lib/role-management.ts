import { adminAuth } from "./firebase-admin-init"
import { ROLES, type Role } from "./roles"

// Role management functions
export async function setUserRoles(uid: string, roles: Role[]): Promise<void> {
  if (!adminAuth) {
    throw new Error("Firebase Admin Auth not initialized")
  }

  // Validate roles
  roles.forEach((role) => {
    if (!Object.values(ROLES).includes(role)) {
      throw new Error(`Invalid role: ${role}`)
    }
  })

  // Set custom claims
  await adminAuth.setCustomUserClaims(uid, { roles })
}

export async function getUserRoles(uid: string): Promise<Role[]> {
  if (!adminAuth) {
    throw new Error("Firebase Admin Auth not initialized")
  }

  const user = await adminAuth.getUser(uid)
  const claims = user.customClaims || {}
  return (claims.roles || []) as Role[]
}

export async function addUserRole(uid: string, role: Role): Promise<void> {
  if (!adminAuth) {
    throw new Error("Firebase Admin Auth not initialized")
  }

  // Validate role
  if (!Object.values(ROLES).includes(role)) {
    throw new Error(`Invalid role: ${role}`)
  }

  // Get current roles
  const user = await adminAuth.getUser(uid)
  const claims = user.customClaims || {}
  const currentRoles = (claims.roles || []) as Role[]

  // Add role if not already present
  if (!currentRoles.includes(role)) {
    const newRoles = [...currentRoles, role]
    await adminAuth.setCustomUserClaims(uid, { ...claims, roles: newRoles })
  }
}

export async function removeUserRole(uid: string, role: Role): Promise<void> {
  if (!adminAuth) {
    throw new Error("Firebase Admin Auth not initialized")
  }

  // Get current roles
  const user = await adminAuth.getUser(uid)
  const claims = user.customClaims || {}
  const currentRoles = (claims.roles || []) as Role[]

  // Remove role
  const newRoles = currentRoles.filter((r) => r !== role)
  await adminAuth.setCustomUserClaims(uid, { ...claims, roles: newRoles })
}

// Helper function to get a user by email
export async function getUserByEmail(email: string) {
  if (!adminAuth) {
    throw new Error("Firebase Admin Auth not initialized")
  }

  try {
    return await adminAuth.getUserByEmail(email)
  } catch (error) {
    console.error("Error getting user by email:", error instanceof Error ? error.message : "Unknown error")
    throw error
  }
}

// Helper function to set admin role
export async function setAdminRole(uid: string) {
  try {
    console.log(`Setting admin role for user ${uid}`)
    await addUserRole(uid, ROLES.ADMIN)
    console.log(`Admin role set for user ${uid}`)
    return true
  } catch (error) {
    console.error("Error setting admin role:", error instanceof Error ? error.message : "Unknown error")
    throw error
  }
}
