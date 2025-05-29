import { create } from "zustand"
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { Role } from "@/lib/types"
import Cookies from "js-cookie"
import { doc, setDoc, getDoc } from "firebase/firestore"

interface AuthUser extends User {
  roles?: string[]
  isAdmin?: boolean
  isInstructor?: boolean
  isStudent?: boolean
}

interface AuthState {
  user: AuthUser | null
  loading: boolean
  roles: string[]
  isAdmin: boolean
  isInstructor: boolean
  isStudent: boolean
  hasRole: (role: Role) => boolean
  hasAnyRole: (roles: Role[]) => boolean
  signIn: (email: string, password: string) => Promise<User>
  signInWithGoogle: () => Promise<User>
  signUp: (email: string, password: string, role: Role) => Promise<User>
  signOut: () => Promise<void>
  initialize: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  roles: [],
  isAdmin: false,
  isInstructor: false,
  isStudent: false,

  hasRole: (role: Role) => {
    const { roles } = get()
    return roles.includes(role)
  },

  hasAnyRole: (rolesToCheck: Role[]) => {
    const { roles } = get()
    return rolesToCheck.some(role => roles.includes(role))
  },

  signIn: async (email: string, password: string) => {
    try {
      console.log("[AuthStore] Attempting sign in with email:", email)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log("[AuthStore] Sign in successful:", userCredential.user.email)
      await userCredential.user.getIdToken(true)
      return userCredential.user
    } catch (error) {
      console.error("[AuthStore] Sign in error:", error)
      throw error
    }
  },

  signInWithGoogle: async () => {
    try {
      console.log("[AuthStore] Attempting Google sign in")
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      console.log("[AuthStore] Google sign in successful:", userCredential.user.email)

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid))
      
      if (!userDoc.exists()) {
        console.log("[AuthStore] New Google user, creating user document")
        // Create user document with default role
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL,
          provider: "google",
          createdAt: new Date().toISOString(),
        })

        // Set custom claims for role-based access
        const response = await fetch("/api/auth/set-role", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: userCredential.user.uid,
            role: "student", // Default role for Google sign-in
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to set user role")
        }

        console.log("[AuthStore] Set default role for new Google user")
      }

      // Force token refresh to get updated claims
      await userCredential.user.getIdToken(true)
      return userCredential.user
    } catch (error) {
      console.error("[AuthStore] Google sign in error:", error)
      throw error
    }
  },

  signUp: async (email: string, password: string, role: Role) => {
    try {
      console.log("[AuthStore] Attempting sign up with email:", email)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      console.log("[AuthStore] Sign up successful:", userCredential.user.email)

      // Create user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: userCredential.user.email,
        createdAt: new Date().toISOString(),
      })

      // Set custom claims for role-based access
      const response = await fetch("/api/auth/set-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: userCredential.user.uid,
          role,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to set user role")
      }

      await userCredential.user.getIdToken(true)
      return userCredential.user
    } catch (error) {
      console.error("[AuthStore] Sign up error:", error)
      throw error
    }
  },

  signOut: async () => {
    try {
      console.log("[AuthStore] Attempting sign out")
      await firebaseSignOut(auth)
      console.log("[AuthStore] Sign out successful")
      Cookies.remove("user-roles", { path: "/" })
      set({ user: null, roles: [], isAdmin: false, isInstructor: false, isStudent: false })
    } catch (error) {
      console.error("[AuthStore] Sign out error:", error)
      throw error
    }
  },

  initialize: () => {
    console.log("[AuthStore] Initializing auth state listener")
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("[AuthStore] Auth state changed:", user ? "User logged in" : "No user")
      set({ user: user as AuthUser | null, loading: true })

      if (user) {
        try {
          console.log("[AuthStore] Getting ID token result for user:", user.email)
          const idTokenResult = await user.getIdTokenResult()
          console.log("[AuthStore] ID token claims:", idTokenResult.claims)
          const userRoles = idTokenResult.claims.roles as string[] || []
          console.log("[AuthStore] User roles from claims:", userRoles)
          
          // Update roles and cookie
          Cookies.set("user-roles", JSON.stringify(userRoles), { 
            expires: 7,
            path: "/",
            sameSite: "strict"
          })

          // Create enhanced user object with roles
          const enhancedUser: AuthUser = {
            ...user,
            roles: userRoles,
            isAdmin: userRoles.includes("admin"),
            isInstructor: userRoles.includes("instructor"),
            isStudent: userRoles.includes("student")
          }

          set({
            user: enhancedUser,
            roles: userRoles,
            isAdmin: userRoles.includes("admin"),
            isInstructor: userRoles.includes("instructor"),
            isStudent: userRoles.includes("student"),
            loading: false
          })
        } catch (error) {
          console.error("[AuthStore] Error getting user roles:", error)
          set({ 
            user: user as AuthUser, 
            roles: [], 
            isAdmin: false, 
            isInstructor: false, 
            isStudent: false, 
            loading: false 
          })
        }
      } else {
        console.log("[AuthStore] No user, clearing roles")
        set({ 
          user: null, 
          roles: [], 
          isAdmin: false, 
          isInstructor: false, 
          isStudent: false, 
          loading: false 
        })
      }
    })

    return unsubscribe
  }
})) 