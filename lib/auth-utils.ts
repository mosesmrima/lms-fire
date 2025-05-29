import { NextRequest } from "next/server"
import { ROLES, type Role } from "./roles"

// Get user ID from request headers (set by middleware)
export function getUserId(request: NextRequest): string {
  const userId = request.headers.get("x-user-id")
  if (!userId) {
    throw new Error("User ID not found in request headers")
  }
  return userId
}

// Get user roles from request headers (set by middleware)
export function getUserRoles(request: NextRequest): Role[] {
  const rolesHeader = request.headers.get("x-user-roles")
  if (!rolesHeader) {
    return []
  }
  try {
    return JSON.parse(rolesHeader) as Role[]
  } catch (error) {
    console.error("Error parsing user roles:", error)
    return []
  }
}

// Check if user has a specific role
export function hasRole(request: NextRequest, role: Role): boolean {
  const roles = getUserRoles(request)
  return roles.includes(role)
}

// Check if user is admin
export function isAdmin(request: NextRequest): boolean {
  return hasRole(request, ROLES.ADMIN)
}

// Check if user is instructor
export function isInstructor(request: NextRequest): boolean {
  return hasRole(request, ROLES.INSTRUCTOR)
}

// Check if user is student
export function isStudent(request: NextRequest): boolean {
  return hasRole(request, ROLES.STUDENT)
}

// Check if user has any of the required roles
export function hasAnyRole(request: NextRequest, requiredRoles: Role[]): boolean {
  const userRoles = getUserRoles(request)
  return requiredRoles.some(role => userRoles.includes(role))
}

// Check if user has all of the required roles
export function hasAllRoles(request: NextRequest, requiredRoles: Role[]): boolean {
  const userRoles = getUserRoles(request)
  return requiredRoles.every(role => userRoles.includes(role))
} 