import { z } from "zod"
import { User as FirebaseUser } from "firebase/auth"
import { Role } from "@/lib/rbac/types"

// Base schemas
export const UserSchema = z.object({
  uid: z.string(),
  email: z.string().email().nullable(),
  displayName: z.string().nullable(),
  photoURL: z.string().nullable(),
  roles: z.array(z.string()).default([]),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
})

export const CourseCategory = z.enum([
  'WEB3',
  'BLOCKCHAIN',
  'DEFI',
  'NFT',
  'CRYPTO',
  'SMART_CONTRACTS',
  'SECURITY',
  'OTHER'
])

export const CourseLevel = z.enum([
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED'
])

export const CourseStatus = z.enum([
  'DRAFT',
  'PUBLISHED',
  'ARCHIVED'
])

export const ResourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  url: z.string().url(),
  size: z.number().optional()
})

export const LessonSchema = z.object({
  id: z.string(),
  title: z.string().min(3).max(200),
  description: z.string().max(1000),
  videoUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  duration: z.string(), // HH:MM:SS format
  order: z.number().int().min(0),
  courseId: z.string(),
  isPreview: z.boolean().default(false),
  resources: z.array(ResourceSchema).optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const CourseSchema = z.object({
  id: z.string(),
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(200),
  description: z.string().min(50).max(2000),
  shortDescription: z.string().max(200),
  instructor: z.string(), // User ID reference
  category: CourseCategory,
  level: CourseLevel,
  status: CourseStatus,
  thumbnailUrl: z.string().url(),
  price: z.number().min(0),
  currency: z.string().length(3).default('USD'),
  lessons: z.array(LessonSchema),
  enrolledStudents: z.number().int().min(0).default(0),
  rating: z.number().min(0).max(5).default(0),
  totalRatings: z.number().int().min(0).default(0),
  requirements: z.array(z.string()).optional(),
  objectives: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  publishedAt: z.date().optional()
})

export const NoteSchema = z.object({
  id: z.string(),
  userId: z.string(),
  courseId: z.string(),
  lessonId: z.string(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
})

export const ProgressSchema = z.object({
  userId: z.string(),
  courseId: z.string(),
  lessonId: z.string(),
  completed: z.boolean(),
  lastAccessed: z.string(),
})

export const AttachmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  type: z.string(),
  size: z.string(),
  lessonId: z.string().optional(),
  createdAt: z.string().optional(),
})

export const TimestampSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  time: z.number(),
  lessonId: z.string().optional(),
})

export const UserPreferencesSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  language: z.string(),
  timezone: z.string(),
  theme: z.enum(["light", "dark", "system"]),
})

export const UserStatsSchema = z.object({
  coursesEnrolled: z.number(),
  coursesCompleted: z.number(),
  lessonsCompleted: z.number(),
  certificatesEarned: z.number(),
  totalLearningTime: z.number(),
})

// Type exports
export type User = z.infer<typeof UserSchema>
export type Course = z.infer<typeof CourseSchema>
export type Lesson = z.infer<typeof LessonSchema>
export type Note = z.infer<typeof NoteSchema>
export type Progress = z.infer<typeof ProgressSchema>
export type Attachment = z.infer<typeof AttachmentSchema>
export type Timestamp = z.infer<typeof TimestampSchema>
export type UserPreferences = z.infer<typeof UserPreferencesSchema>
export type UserStats = z.infer<typeof UserStatsSchema>

// Auth types
export interface AuthUser extends FirebaseUser {
  roles?: Role[]
}

export interface AuthState {
  user: AuthUser | null
  loading: boolean
  roles: Role[]
  signIn: (email: string, password: string) => Promise<AuthUser>
  signInWithGoogle: () => Promise<AuthUser>
  signUp: (email: string, password: string) => Promise<AuthUser>
  signOut: () => Promise<void>
  initialize: () => void
  hasRole: (role: Role) => boolean
  hasAnyRole: (roles: Role[]) => boolean
  hasAllRoles: (roles: Role[]) => boolean
  isAdmin: () => boolean
  isInstructor: () => boolean
}

// Query types
export interface QueryResult<T> {
  data: T | undefined
  isLoading: boolean
  error: Error | null
}

export interface MutationResult<T, V> {
  mutate: (variables: V) => Promise<T>
  isPending: boolean
  error: Error | null
} 