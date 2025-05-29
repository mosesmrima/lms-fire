// Role definitions that can be imported by both client and server components
export const ROLES = {
  STUDENT: "student",
  INSTRUCTOR: "instructor",
  ADMIN: "admin",
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

// Define permissions for each role
export const ROLE_PERMISSIONS = {
  [ROLES.STUDENT]: ["courses:read", "lessons:read", "notes:manage"],
  [ROLES.INSTRUCTOR]: [
    "courses:read",
    "courses:create",
    "courses:update",
    "lessons:read",
    "lessons:create",
    "lessons:update",
    "lessons:delete",
    "notes:manage",
  ],
  [ROLES.ADMIN]: [
    "courses:read",
    "courses:create",
    "courses:update",
    "courses:delete",
    "lessons:read",
    "lessons:create",
    "lessons:update",
    "lessons:delete",
    "users:read",
    "users:update",
    "users:delete",
    "roles:manage",
    "admin:access",
    "notes:manage",
  ],
}

export type Permission = string
