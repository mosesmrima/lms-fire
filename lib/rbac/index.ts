// Role-based access control system

// Define available roles
export const ROLES = {
  STUDENT: "student",
  INSTRUCTOR: "instructor",
  ADMIN: "admin",
} as const

export type Role = typeof ROLES[keyof typeof ROLES]

// Define all available permissions
export type Permission =
  // Course permissions
  | "courses:create"
  | "courses:read"
  | "courses:update"
  | "courses:delete"
  | "courses:enroll"
  // Lesson permissions
  | "lessons:create"
  | "lessons:read"
  | "lessons:update"
  | "lessons:delete"
  // User permissions
  | "users:read"
  | "users:update"
  | "users:delete"
  | "users:manage-roles"
  // Admin permissions
  | "admin:access"
  | "admin:manage-system"
  // Note permissions
  | "notes:manage"

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

// Helper function to get permissions for a role
export function getPermissionsForRole(roleId: Role): Permission[] {
  return ROLE_PERMISSIONS[roleId] || []
}

// Helper function to get all permissions for a user with multiple roles
export function getUserPermissions(roleIds: Role[]): Permission[] {
  // Get unique permissions from all roles
  const allPermissions = roleIds.flatMap((roleId) => getPermissionsForRole(roleId))
  return [...new Set(allPermissions)]
}

// Helper function to check if a user has a specific permission
export function hasPermission(userRoleIds: Role[], permission: Permission): boolean {
  const permissions = getUserPermissions(userRoleIds)
  return permissions.includes(permission)
}

// Helper function to check if a user has all of the specified permissions
export function hasAllPermissions(userRoleIds: Role[], requiredPermissions: Permission[]): boolean {
  const permissions = getUserPermissions(userRoleIds)
  return requiredPermissions.every((permission) => permissions.includes(permission))
}

// Helper function to check if a user has any of the specified permissions
export function hasAnyPermission(userRoleIds: Role[], requiredPermissions: Permission[]): boolean {
  const permissions = getUserPermissions(userRoleIds)
  return requiredPermissions.some((permission) => permissions.includes(permission))
}

// Helper function to check if a user has a specific role
export function hasRole(userRoleIds: Role[], role: Role): boolean {
  return userRoleIds.includes(role)
}

// Helper function to check if a user is an admin
export function isAdmin(userRoleIds: Role[]): boolean {
  return hasRole(userRoleIds, ROLES.ADMIN)
}

// Helper function to check if a user is an instructor
export function isInstructor(userRoleIds: Role[]): boolean {
  return hasRole(userRoleIds, ROLES.INSTRUCTOR) || isAdmin(userRoleIds)
}

// Helper function to check if a user is a student
export function isStudent(userRoleIds: Role[]): boolean {
  return hasRole(userRoleIds, ROLES.STUDENT)
} 