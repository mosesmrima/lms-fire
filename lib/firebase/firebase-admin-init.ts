// This ensures the code only runs on the server
import "server-only"

import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

// Initialize Firebase Admin
export function initFirebaseAdmin() {
  try {
    console.log("Initializing Firebase Admin...")

    // Check if Firebase Admin is already initialized
    if (getApps().length > 0) {
      console.log("Firebase Admin already initialized, returning existing instance")
      const auth = getAuth()
      const db = getFirestore()
      return { auth, db }
    }

    // Log service account details (without sensitive info)
    console.log("Service account project_id:", process.env.FIREBASE_PROJECT_ID)
    console.log("Service account client_email:", process.env.FIREBASE_CLIENT_EMAIL)

    // Initialize Firebase Admin with the service account
    const app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    })

    const auth = getAuth(app)
    const db = getFirestore(app)

    console.log("Firebase Admin initialized successfully")
    return { auth, db }
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error)
    throw error
  }
}
