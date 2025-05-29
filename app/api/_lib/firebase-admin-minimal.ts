import * as admin from "firebase-admin"

// Initialize Firebase Admin
let firebaseAdmin: admin.app.App | undefined

export function getFirebaseAdmin() {
  if (firebaseAdmin) {
    return firebaseAdmin
  }

  try {
    // Load service account directly
    const serviceAccount = {
      type: "service_account",
      project_id: "ahlms-ddef5",
      private_key_id: "39bedbd4ceefc3b2b2e87fa267ac9fbdcbd1eb22",
      private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCwMMVfI8zXqxQZ\nAuXuWCv/sIkivKp9fYBr55lOO0zlXZT9pTc1+YIc2r+GDevGmEqboACrMaXry5aI\nJM/bXXUofZoU+JZh5Nw0TyE3rMAXWe21hU7qLZ/EaKCuSvbQPD3YBrD18HjoK7H+\nxLOtn0kaKJb1uXsWE2szm5O3ys41BHBJCThqsRAJdZ5fNN9Nlsl6/VsN1iV8vpMc\ne2eSw+ia1lsY7w1wDJbdL1fRL3ebR6KKNp+rIR3rCHiNfAcwDCHeL+Q/nE1t1d6K\n17fXQYsHr57k8r8wHRu9fZ1I2uWXMvfL30AWfle1vOQo0bW7u9pwbe0j50El+PqS\nXTyV/+LJAgMBAAECggEADn/9Bk7qcUdVkJdh9+MOv+y15IN1Xn2BH6BASCVuNyQj\n+lnp+MmvcRN5lp03rbDj1vnshCpCVuz61vp8lreSyEHJ9/bbXXQZwT5P5AaWCnXu\nr7UoYPJfRyk7LAzkUg/bIRev4ZWoRacu72IdzWih+gKkJdXdcNwpQuaHWiVZIhi3\n5viqX1hm8QZPE1gjSV8iJP/1EDgGXrnWQjGdX+hnoFuttJ83qhAorq7SNyXrCc7p\n2DglWse9/dRaA2clbh751NyrxStEZdlQTfUTGm9Xg+AdpgG+0enrzT8XfSpYnjiT\n6KSQY6axFXFDq7cic4D9dfjEfTNRN+jMW6z6bUncHwKBgQDhDLCEOK+6YBNIr/+h\nos0tDuR3fh2bs50U/VI4++1Ar0SuoMriqf1gfV+Nb3Petr1DrpCoidyZNOOJYvLI\nxbFbsyX6DNyWbAJsH8m4qLMe9nf6ybPI0sQGXENDmenwtQE5ZwBHx8gEMZziBvTO\nhQxVITFIN95X3XhkfX21q1th1wKBgQDIa+ca3FGVYuMsJUokjtWwosWDssr/aiT7\nZyWYXOUPTyit2vE/bmCH/z6yP1y07vwo1kkGub4uTIT2ZHWBqPb7blfkjru/l7uQ\no+Yx5bNsUWgsIkyqAqfRJD21ie09qtFQN+ZNPCxoKCVdz524T+RfymWDV6Vn3EI0\nhPfrPnOMXwKBgET4c5yCFvECgsZzEeACmejmOISahQ5z1H9bR3ipVMPPMzhllOg0\neq+4nLEm6BboYEa+2Bye65mUiOtRBOEdHUbiN5BTosMC5RcoAtVx9jtWA907Nbsl\nROhCHGc6Y2TexDpIY+CbzKPkZJUs1pf4VJg+bPEaFi1NdZkukHk9w+rPAoGBALko\nhq+YD38Vho6IPMEdfGndVuBe04+3/kaMen0ShUPpe8lyViKl1GSP+NowE3PMvgT0\nQy8Fdp/LbaM8GBsbgGG1BVpQSz+r7EqqQMakUWimpLjxTyZZobRj6ObIb/bi0tFr\nc0azassnG65ZWnqmxHOCxtnapSMYp8lhdrFMVu+9AoGAToiHNqByaAHkxFDKQeJN\npG9cKt72S2Ichu2sOo9yzsohs+BrIijh1k8lxzh7k5Qs60I3VtfYix/R59Ikd/c3\n1Q7oWZhAoD5xuyGrXHzKm65ThLx68KrWC9HZK0v7rJb+BhDnt7JAQRdwUq898t/2\n6eA0gQGm3EOLJ2NIWuzIGw8=\n-----END PRIVATE KEY-----\n",
      client_email: "firebase-adminsdk-fbsvc@ahlms-ddef5.iam.gserviceaccount.com",
      client_id: "112269809989015408268",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url:
        "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40ahlms-ddef5.iam.gserviceaccount.com",
      universe_domain: "googleapis.com",
    }

    // Initialize the app
    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    })

    return firebaseAdmin
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error)
    throw error
  }
}

// Get Firebase Auth
export function getFirebaseAuth() {
  const app = getFirebaseAdmin()
  return admin.auth(app)
}

// Get Firestore
export function getFirestore() {
  const app = getFirebaseAdmin()
  return admin.firestore(app)
}

// Helper function to get user by email
export async function getUserByEmail(email: string) {
  const auth = getFirebaseAuth()
  return auth.getUserByEmail(email)
}

// Helper function to set admin role
export async function setAdminRole(uid: string) {
  const auth = getFirebaseAuth()
  return auth.setCustomUserClaims(uid, {
    roles: ["admin"],
  })
}
