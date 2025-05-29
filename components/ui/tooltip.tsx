"use client"

import React from "react"
import { Tooltip as HeroTooltip } from "@heroui/react"
import { cn } from "@/lib/utils"

export interface TooltipProps {
  content?: React.ReactNode
  children?: React.ReactNode
  showArrow?: boolean
  size?: "sm" | "md" | "lg"
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger"
  radius?: "none" | "sm" | "md" | "lg" | "full"
  shadow?: "none" | "sm" | "md" | "lg"
  placement?: string
  delay?: number
  closeDelay?: number
  isOpen?: boolean
  defaultOpen?: boolean
  offset?: number
  containerPadding?: number
  crossOffset?: number
  triggerScaleOnOpen?: boolean
  isKeyboardDismissDisabled?: boolean
  isDismissable?: boolean
  shouldCloseOnBlur?: boolean
  motionProps?: any
  portalContainer?: HTMLElement
  updatePositionDeps?: any[]
  isDisabled?: boolean
  disableAnimation?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

// Export the HeroUI Tooltip component directly
export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(({ children, className, ...props }, ref) => {
  return (
    <HeroTooltip ref={ref} className={cn(className)} {...props}>
      {children}
    </HeroTooltip>
  )
})
Tooltip.displayName = "Tooltip"

// Create compatibility components for existing code
export const TooltipTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    return <button ref={ref} className={cn("", className)} {...props} />
  },
)
TooltipTrigger.displayName = "TooltipTrigger"

export const TooltipContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("", className)} {...props} />
  },
)
TooltipContent.displayName = "TooltipContent"

// Add TooltipProvider for compatibility with existing code
export const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>
}
