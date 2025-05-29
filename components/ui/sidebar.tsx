"use client"

import * as React from "react"
import { Tab, TabList, TabPanel } from "@heroui/react"
import { cn } from "@/lib/utils"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex h-full w-full flex-col overflow-hidden", className)}
      {...props}
    >
      {children}
    </div>
  )
})
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center justify-between px-4 py-2", className)} {...props} />
  ),
)
SidebarHeader.displayName = "SidebarHeader"

const SidebarBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-1 overflow-y-auto px-4 py-2", className)} {...props} />
  ),
)
SidebarBody.displayName = "SidebarBody"

const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center justify-between px-4 py-2", className)} {...props} />
  ),
)
SidebarFooter.displayName = "SidebarFooter"

export { Sidebar, SidebarHeader, SidebarBody, SidebarFooter }
