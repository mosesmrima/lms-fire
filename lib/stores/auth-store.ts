import { create } from "zustand"
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "@/lib/firebase/client"
import { ROLES, type Role, isAdmin, isInstructor } from "@/lib/rbac/types"
import Cookies from "js-cookie"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { AuthState, AuthUser, UserSchema } from "@/lib/types"

const handleAuthSuccess = async (user: any, userRoles: Role[]) => {
  // Set token cookie
  const token = await user.getIdToken()
  Cookies.set("token", token, { 
    expires: 7,
    path: "/",
    sameSite: "strict"
  })
  
  Cookies.set("user-roles", JSON.stringify(userRoles), { 
    expires: 7,
    path: "/",
    sameSite: "strict"
  })

  const enhancedUser: AuthUser = {
    ...user,
    roles: userRoles
  }

  return enhancedUser
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  roles: [],

  signIn: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      // Force token refresh to get latest claims
      await userCredential.user.getIdToken(true)
      const idTokenResult = await userCredential.user.getIdTokenResult()
      const userRoles = idTokenResult.claims.roles as Role[] || []
      
      const enhancedUser = await handleAuthSuccess(userCredential.user, userRoles)
      set({ user: enhancedUser, roles: userRoles })

      // Handle role-based redirection
      if (isAdmin(userRoles)) {
        window.location.href = "/admin"
      } else if (isInstructor(userRoles)) {
        window.location.href = "/instructor"
      } else {
        window.location.href = "/dashboard"
      }

      return enhancedUser
    } catch (error) {
      console.error("[AuthStore] Sign in error:", error)
      throw error
    }
  },

  signInWithGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid))
      
      if (!userDoc.exists()) {
        // Create user document with default role
        const userData = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL,
          provider: "google",
          createdAt: new Date().toISOString(),
          roles: [ROLES.STUDENT] // Default role for new users
        }

        // Validate user data
        const validatedData = UserSchema.parse(userData)

        await setDoc(doc(db, "users", userCredential.user.uid), validatedData)

        // Set custom claims for role-based access
        const response = await fetch("/api/auth/set-role", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: userCredential.user.uid,
            roles: [ROLES.STUDENT]
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to set user role")
        }
      }

      // Force token refresh to get latest claims
      await userCredential.user.getIdToken(true)
      const idTokenResult = await userCredential.user.getIdTokenResult()
      const userRoles = idTokenResult.claims.roles as Role[] || []
      
      const enhancedUser = await handleAuthSuccess(userCredential.user, userRoles)
      set({ user: enhancedUser, roles: userRoles })

      // Handle role-based redirection
      if (isAdmin(userRoles)) {
        window.location.href = "/admin"
      } else if (isInstructor(userRoles)) {
        window.location.href = "/instructor"
      } else {
        window.location.href = "/dashboard"
      }

      return enhancedUser
    } catch (error) {
      console.error("[AuthStore] Google sign in error:", error)
      throw error
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Create user document in Firestore with default role
      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        createdAt: new Date().toISOString(),
        roles: [ROLES.STUDENT] // Default role for new users
      }

      // Validate user data
      const validatedData = UserSchema.parse(userData)

      await setDoc(doc(db, "users", userCredential.user.uid), validatedData)

      // Set custom claims for role-based access
      const response = await fetch("/api/auth/set-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: userCredential.user.uid,
          roles: [ROLES.STUDENT]
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to set user role")
      }

      // Force token refresh to get latest claims
      await userCredential.user.getIdToken(true)
      const idTokenResult = await userCredential.user.getIdTokenResult()
      const userRoles = idTokenResult.claims.roles as Role[] || []
      
      const enhancedUser = await handleAuthSuccess(userCredential.user, userRoles)
      set({ user: enhancedUser, roles: userRoles })

      // Handle role-based redirection
      if (isAdmin(userRoles)) {
        window.location.href = "/admin"
      } else if (isInstructor(userRoles)) {
        window.location.href = "/instructor"
      } else {
        window.location.href = "/dashboard"
      }

      return enhancedUser
    } catch (error) {
      console.error("[AuthStore] Sign up error:", error)
      throw error
    }
  },

  signOut: async () => {
    try {
      await firebaseSignOut(auth)
      Cookies.remove("token", { path: "/" })
      Cookies.remove("user-roles", { path: "/" })
      set({ user: null, roles: [] })
      window.location.href = "/signin"
    } catch (error) {
      console.error("[AuthStore] Sign out error:", error)
      throw error
    }
  },

  initialize: () => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      set({ user: user as AuthUser | null, loading: true })

      if (user) {
        try {
          // Force token refresh to get latest claims
          await user.getIdToken(true)
          const idTokenResult = await user.getIdTokenResult()
          const userRoles = idTokenResult.claims.roles as Role[] || []
          
          const enhancedUser = await handleAuthSuccess(user, userRoles)
          set({
            user: enhancedUser,
            roles: userRoles,
            loading: false
          })
        } catch (error) {
          console.error("[AuthStore] Error getting user roles:", error)
          set({ 
            user: user as AuthUser,
            roles: [],
            loading: false 
          })
        }
      } else {
        set({ 
          user: null,
          roles: [],
          loading: false 
        })
      }
    })

    return unsubscribe
  },

  // Helper functions for role checks
  hasRole: (role: Role): boolean => {
    const state = useAuthStore.getState()
    return state.roles.includes(role)
  },

  hasAnyRole: (roles: Role[]): boolean => {
    const state = useAuthStore.getState()
    return roles.some(role => state.roles.includes(role))
  },

  hasAllRoles: (roles: Role[]): boolean => {
    const state = useAuthStore.getState()
    return roles.every(role => state.roles.includes(role))
  },

  isAdmin: (): boolean => {
    const state = useAuthStore.getState()
    return isAdmin(state.roles)
  },

  isInstructor: (): boolean => {
    const state = useAuthStore.getState()
    return isInstructor(state.roles)
  }
})) 