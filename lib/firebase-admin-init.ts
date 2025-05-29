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
      console.error("Missing Firebase Admin environment variables")
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

// Export a function that safely gets the admin instances
export function getAdminSDK() {
  try {
    return initAdmin()
  } catch (error) {
    console.error("Error getting Admin SDK:", error)
    return { auth: null, db: null }
  }
}
