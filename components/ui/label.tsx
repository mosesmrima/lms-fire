"use client"

import React from "react"
import { Label as HeroLabel } from "@heroui/react"
import { cn } from "@/lib/utils"

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => {
    return <HeroLabel ref={ref} className={cn("", className)} {...props} />
  },
)
Label.displayName = "Label"

export { Label }
