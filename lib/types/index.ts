// Role Types
export enum ROLES {
  ADMIN = "admin",
  INSTRUCTOR = "instructor",
  STUDENT = "student",
}

export type Role = keyof typeof ROLES

// User Types
export interface User {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  roles: Role[]
}

// Course Types
export interface Course {
  id: string
  title: string
  description: string
  instructorId: string
  instructorName: string
  price: number
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
}

// Lesson Types
export interface Lesson {
  id: string
  courseId: string
  title: string
  description: string
  videoUrl?: string
  duration: number
  order: number
  createdAt: Date
  updatedAt: Date
}

// Enrollment Types
export interface Enrollment {
  id: string
  userId: string
  courseId: string
  enrolledAt: Date
  completedLessons: string[]
  progress: number
}

// Auth Types
export interface AuthState {
  user: User | null
  loading: boolean
  error: Error | null
}

// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
} 