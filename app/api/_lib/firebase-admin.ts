import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

// Define roles (these should be moved to a shared file later)
export const ROLES = {
  STUDENT: "student",
  INSTRUCTOR: "instructor",
  ADMIN: "admin",
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

// Initialize Firebase Admin
export function initFirebaseAdmin() {
  if (getApps().length > 0) {
    return {
      auth: getAuth(),
      db: getFirestore(),
    }
  }

  const app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })

  return {
    auth: getAuth(app),
    db: getFirestore(app),
  }
}
