import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ROLES } from "@/lib/rbac"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | number | Date): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function formatDateTime(input: string | number | Date): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  })
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export function hasInstructorPermission(roles: string[] | null): boolean {
  if (!roles) return false
  return roles.includes(ROLES.INSTRUCTOR) || roles.includes(ROLES.ADMIN)
}

export function hasAdminPermission(roles: string[] | null): boolean {
  if (!roles) return false
  return roles.includes(ROLES.ADMIN)
}

export function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

export function getVimeoVideoId(url: string): string | null {
  const regExp = /vimeo\.com\/(?:video\/)?([0-9]+)/
  const match = url.match(regExp)
  return match ? match[1] : null
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-")
}

export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const wordCount = text.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

export function getRoleLabel(role: string) {
  switch (role) {
    case ROLES.ADMIN:
      return "Admin"
    case ROLES.INSTRUCTOR:
      return "Instructor"
    case ROLES.STUDENT:
      return "Student"
    default:
      return role
  }
}

export function isAdmin(roles: string[]): boolean {
  return roles.includes(ROLES.ADMIN)
}

export function isInstructor(roles: string[]): boolean {
  return roles.includes(ROLES.INSTRUCTOR)
}

export function isStudent(roles: string[]): boolean {
  return roles.includes(ROLES.STUDENT)
}
