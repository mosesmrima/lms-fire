import { ReactNode } from "react"
import { Course, Lesson, Note, User } from "./index"

// Common props
export interface BaseProps {
  className?: string
  children?: ReactNode
}



export interface CourseFormProps extends BaseProps {
  initialData?: Partial<Course>
  onSubmit: (data: Partial<Course>) => void
  onCancel?: () => void
}

export interface CourseProgressProps extends BaseProps {
  courseId: string
  userId: string
}

// Lesson-related props
export interface LessonListProps extends BaseProps {
  lessons: Lesson[]
  onLessonClick?: (lesson: Lesson) => void
}

export interface LessonFormProps extends BaseProps {
  initialData?: Partial<Lesson>
  onSubmit: (data: Partial<Lesson>) => void
  onCancel?: () => void
}

// Note-related props
export interface NotesListProps extends BaseProps {
  notes: Note[]
  onNoteCreate?: (content: string) => void
  onNoteUpdate?: (noteId: string, content: string) => void
  onNoteDelete?: (noteId: string) => void
}

// User-related props
export interface ProfileFormProps extends BaseProps {
  user: User
  onSubmit: (data: Partial<User>) => void
}

export interface UserRoleManagerProps extends BaseProps {
  userId: string
  onRolesUpdate?: (roles: string[]) => void
}

// UI component props
export interface StatsCardProps extends BaseProps {
  title: string
  value: number | string
  icon?: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
}

