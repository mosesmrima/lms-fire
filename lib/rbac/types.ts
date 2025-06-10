import { z } from "zod"

// Role-based access control types
export const ROLES = {
  ADMIN: "admin",
  INSTRUCTOR: "instructor",
  STUDENT: "student",
} as const

export type Role = typeof ROLES[keyof typeof ROLES]

export const RoleSchema = z.enum([ROLES.ADMIN, ROLES.INSTRUCTOR, ROLES.STUDENT])

// Define permissions for each role
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.STUDENT]: [
    "courses:read",
    "lessons:read",
    "notes:manage",
  ],
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
    "users:manage-roles",
    "admin:access",
    "admin:manage-system",
    "notes:manage",
  ],
}

export type Permission = 
  | "courses:read"
  | "courses:create"
  | "courses:update"
  | "courses:delete"
  | "courses:enroll"
  | "lessons:read"
  | "lessons:create"
  | "lessons:update"
  | "lessons:delete"
  | "users:read"
  | "users:update"
  | "users:delete"
  | "users:manage-roles"
  | "admin:access"
  | "admin:manage-system"
  | "notes:manage"

export const PermissionSchema = z.enum([
  "courses:read",
  "courses:create",
  "courses:update",
  "courses:delete",
  "courses:enroll",
  "lessons:read",
  "lessons:create",
  "lessons:update",
  "lessons:delete",
  "users:read",
  "users:update",
  "users:delete",
  "users:manage-roles",
  "admin:access",
  "admin:manage-system",
  "notes:manage"
])

// Helper functions for role checks
export function hasRole(roles: Role[], role: Role): boolean {
  return roles.includes(role)
}

export function hasAnyRole(roles: Role[], rolesToCheck: Role[]): boolean {
  return rolesToCheck.some(role => roles.includes(role))
}

export function hasAllRoles(roles: Role[], rolesToCheck: Role[]): boolean {
  return rolesToCheck.every(role => roles.includes(role))
}

export function isAdmin(roles: Role[]): boolean {
  return roles.includes(ROLES.ADMIN)
}

export function isInstructor(roles: Role[]): boolean {
  return roles.includes(ROLES.INSTRUCTOR) || roles.includes(ROLES.ADMIN)
}

export function getPermissionsForRole(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] || []
}

export function hasPermission(roles: Role[], permission: Permission): boolean {
  return roles.some(role => getPermissionsForRole(role).includes(permission))
}

export interface RolePermissions {
  role: Role
  permissions: Permission[]
}

export const RolePermissionsSchema = z.object({
  role: RoleSchema,
  permissions: z.array(PermissionSchema)
})

export interface UserRoles {
  userId: string
  roles: Role[]
}

export const UserRolesSchema = z.object({
  userId: z.string(),
  roles: z.array(RoleSchema)
})
