import { initializeApp, getApps } from "firebase/app"
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updatePassword as firebaseUpdatePassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth"
import { getFirestore, doc, setDoc, updateDoc, getDoc, serverTimestamp, collection, getDocs, deleteDoc, query, where, orderBy } from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { Course, CourseSchema } from "@/lib/types"

// Firebase config using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase client only if it hasn't been initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Export Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Auth helpers
export const signInWithEmail = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password)
}

export const signUpWithEmail = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password)
}

export const signOut = async () => {
  return firebaseSignOut(auth)
}

export const resetPassword = async (email: string) => {
  return sendPasswordResetEmail(auth, email)
}

export const updatePassword = async (newPassword: string) => {
  if (!auth.currentUser) throw new Error("No user logged in")
  return firebaseUpdatePassword(auth.currentUser, newPassword)
}

// User profile helpers
export const getUserProfile = async (userId: string) => {
  const userRef = doc(db, "users", userId)
  const userSnap = await getDoc(userRef)
  return userSnap.exists() ? userSnap.data() : null
}

export const createUserProfile = async (userId: string, data: any) => {
  const userRef = doc(db, "users", userId)
  return setDoc(userRef, {
    ...data,
    createdAt: serverTimestamp(),
  })
}

export const updateUserProfile = async (userId: string, data: any) => {
  const userRef = doc(db, "users", userId)
  return updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

// Google Sign In
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  return signInWithPopup(auth, provider)
}

// Auth state change listener
export const onAuthStateChange = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback)
}

// File upload helper
export async function uploadFile(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path)
  const snapshot = await uploadBytes(storageRef, file)
  return getDownloadURL(snapshot.ref)
}

// Course operations
export async function getCourses(): Promise<Course[]> {
  const coursesRef = collection(db, "courses")
  const q = query(coursesRef, orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)
  const courses = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
  
  return courses.map(course => {
    try {
      return CourseSchema.parse(course)
    } catch (error) {
      console.error("Invalid course data:", error)
      return null
    }
  }).filter(Boolean) as Course[]
}

export async function getCourse(courseId: string): Promise<Course | null> {
  const courseRef = doc(db, "courses", courseId)
  const courseDoc = await getDoc(courseRef)
  if (!courseDoc.exists()) return null
  
  const courseData = {
    id: courseDoc.id,
    ...courseDoc.data()
  }
  
  try {
    return CourseSchema.parse(courseData)
  } catch (error) {
    console.error("Invalid course data:", error)
    return null
  }
}

export async function createCourse(userId: string, courseData: Partial<Course>): Promise<string> {
  const courseRef = doc(collection(db, "courses"))
  const course = {
    ...courseData,
    id: courseRef.id,
    instructor: userId,
    enrolledStudents: 0,
    rating: 0,
    totalRatings: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  await setDoc(courseRef, course)
  return courseRef.id
}

export async function updateCourse(courseId: string, courseData: Partial<Course>): Promise<void> {
  const courseRef = doc(db, "courses", courseId)
  await updateDoc(courseRef, {
    ...courseData,
    updatedAt: new Date()
  })
}

export async function deleteCourse(courseId: string): Promise<void> {
  const courseRef = doc(db, "courses", courseId)
  await deleteDoc(courseRef)
}

export async function uploadCourseThumbnail(courseId: string, file: File): Promise<string> {
  const path = `courses/${courseId}/thumbnail/${file.name}`
  const url = await uploadFile(file, path)
  await updateCourse(courseId, { thumbnailUrl: url })
  return url
}

export async function uploadLessonResource(courseId: string, lessonId: string, file: File): Promise<string> {
  const path = `courses/${courseId}/lessons/${lessonId}/resources/${file.name}`
  const url = await uploadFile(file, path)
  return url
} 