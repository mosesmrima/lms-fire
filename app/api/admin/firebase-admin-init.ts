import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

// Initialize Firebase Admin using environment variables
export function initializeFirebaseAdmin() {
  try {
    // Only initialize if no apps exist
    if (getApps().length === 0) {
      // Use environment variables directly
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }

      // Log what we're using (without sensitive data)
      console.log("Initializing Firebase Admin with project ID:", serviceAccount.projectId)

      // Initialize the app with minimal configuration
      initializeApp({
        credential: cert(serviceAccount),
      })
    }

    // Return the auth and db instances
    return {
      auth: getAuth(),
      db: getFirestore(),
    }
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error)
    throw error // Re-throw to see the full error
  }
}
