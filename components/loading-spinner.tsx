"use client"

import { Spinner } from "@heroui/react"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  return <Spinner size={size} color="primary" className={className} />
}
