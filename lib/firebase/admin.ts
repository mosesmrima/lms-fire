import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

// Initialize Firebase Admin
function initAdmin() {
  if (getApps().length > 0) {
    // If already initialized, return existing instances
    const auth = getAuth()
    const db = getFirestore()
    return { auth, db }
  }

  try {
    // Get environment variables
    const projectId = process.env.FIREBASE_PROJECT_ID
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    let privateKey = process.env.FIREBASE_PRIVATE_KEY

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error("Missing Firebase Admin environment variables")
    }

    // Format private key if needed
    if (privateKey && !privateKey.includes("-----BEGIN PRIVATE KEY-----")) {
      privateKey = privateKey.replace(/\\n/g, "\n")
    }

    // Initialize app with minimal configuration
    const app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    })

    const auth = getAuth(app)
    const db = getFirestore(app)

    return { auth, db }
  } catch (error) {
    console.error("Firebase Admin initialization error:", error)
    throw error
  }
}

// Export admin instances
export const { auth: adminAuth, db: adminDb } = initAdmin()

// Role management functions
export async function setUserRoles(uid: string, roles: string[]): Promise<void> {
  if (!adminAuth) {
    throw new Error("Firebase Admin Auth not initialized")
  }

  // Get current user
  const user = await adminAuth.getUser(uid)
  const currentClaims = user.customClaims || {}

  // Set custom claims
  await adminAuth.setCustomUserClaims(uid, { 
    ...currentClaims,
    roles,
    rolesUpdatedAt: Date.now()
  })
}

export async function getUserRoles(uid: string): Promise<string[]> {
  if (!adminAuth) {
    throw new Error("Firebase Admin Auth not initialized")
  }

  const user = await adminAuth.getUser(uid)
  const claims = user.customClaims || {}
  return (claims.roles || []) as string[]
}

export async function addUserRole(uid: string, role: string): Promise<void> {
  if (!adminAuth) {
    throw new Error("Firebase Admin Auth not initialized")
  }

  // Get current roles
  const user = await adminAuth.getUser(uid)
  const claims = user.customClaims || {}
  const currentRoles = (claims.roles || []) as string[]

  // Add role if not already present
  if (!currentRoles.includes(role)) {
    const newRoles = [...currentRoles, role]
    await adminAuth.setCustomUserClaims(uid, { 
      ...claims, 
      roles: newRoles,
      rolesUpdatedAt: Date.now()
    })
  }
}

export async function removeUserRole(uid: string, role: string): Promise<void> {
  if (!adminAuth) {
    throw new Error("Firebase Admin Auth not initialized")
  }

  // Get current roles
  const user = await adminAuth.getUser(uid)
  const claims = user.customClaims || {}
  const currentRoles = (claims.roles || []) as string[]

  // Remove role
  const newRoles = currentRoles.filter((r) => r !== role)
  await adminAuth.setCustomUserClaims(uid, { 
    ...claims, 
    roles: newRoles,
    rolesUpdatedAt: Date.now()
  })
} 