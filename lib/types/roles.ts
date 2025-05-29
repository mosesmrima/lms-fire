export const ROLES = {
  STUDENT: "student",
  INSTRUCTOR: "instructor",
  ADMIN: "admin",
} as const

export type Role = typeof ROLES[keyof typeof ROLES]

export const ROLE_PERMISSIONS = {
  [ROLES.STUDENT]: [
    "view:own:profile",
    "view:own:enrollments",
    "view:own:assignments",
    "submit:own:assignments",
  ],
  [ROLES.INSTRUCTOR]: [
    "view:own:profile",
    "view:own:courses",
    "manage:own:courses",
    "view:own:students",
    "manage:own:assignments",
    "grade:own:assignments",
  ],
  [ROLES.ADMIN]: [
    "view:own:profile",
    "view:all:users",
    "manage:all:users",
    "manage:all:roles",
    "view:all:courses",
    "manage:all:courses",
    "view:all:assignments",
    "manage:all:assignments",
  ],
} as const

export type Permission = typeof ROLE_PERMISSIONS[Role][number] 