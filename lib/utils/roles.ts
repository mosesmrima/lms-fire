import { Role } from "@/lib/rbac"

export function hasRole(roles: string[], role: Role): boolean {
  return roles.includes(role)
}

export function hasAnyRole(roles: string[], rolesToCheck: Role[]): boolean {
  return rolesToCheck.some(role => roles.includes(role))
}

export function hasAllRoles(roles: string[], rolesToCheck: Role[]): boolean {
  return rolesToCheck.every(role => roles.includes(role))
}

export function isAdmin(roles: string[]): boolean {
  return roles.includes("admin")
}

export function isInstructor(roles: string[]): boolean {
  return roles.includes("instructor") || roles.includes("admin")
}

export function isStudent(roles: string[]): boolean {
  return roles.includes("student") || roles.length === 0
} 