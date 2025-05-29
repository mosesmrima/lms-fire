"use client"

import { ReactNode } from "react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { Role } from "@/lib/types"

interface PermissionGateProps {
  children: ReactNode
  allowedRoles: Role[]
  fallback?: ReactNode
}

export function PermissionGate({ children, allowedRoles, fallback }: PermissionGateProps) {
  const { hasAnyRole } = useAuthStore()

  if (!hasAnyRole(allowedRoles)) {
    return fallback || null
  }

  return <>{children}</>
}
