import React from "react"
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/react"
import { cn } from "@/lib/utils"

// Simple re-export of HeroUI components
export { Card, CardBody, CardHeader, CardFooter }

// Add CardContent, CardTitle, and CardDescription for backward compatibility
export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("p-6", className)} {...props} />
  },
)
CardContent.displayName = "CardContent"

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return <h3 ref={ref} className={cn("text-xl font-semibold", className)} {...props} />
  },
)
CardTitle.displayName = "CardTitle"

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return <p ref={ref} className={cn("text-sm text-gray-500 dark:text-gray-400", className)} {...props} />
  },
)
CardDescription.displayName = "CardDescription"
