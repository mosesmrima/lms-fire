"use client"

import * as React from "react"
import { Tabs as HeroUITabs, Tab as HeroUITab } from "@heroui/react"
import { cn } from "@/lib/utils"

// Custom implementation to bridge shadcn/ui style API with HeroUI
const Tabs = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { defaultValue?: string }>(
  ({ className, defaultValue, ...props }, ref) => {
    const [activeTab, setActiveTab] = React.useState<string | undefined>(defaultValue)

    return <div ref={ref} className={cn("w-full", className)} data-active-tab={activeTab} {...props} />
  },
)
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className,
      )}
      role="tablist"
      {...props}
    />
  ),
)
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, value, ...props }, ref) => {
  const tabsEl = React.useContext(TabsContext)
  const isActive = tabsEl?.activeTab === value

  return (
    <button
      ref={ref}
      role="tab"
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
        className,
      )}
      onClick={() => tabsEl?.setActiveTab(value)}
      data-state={isActive ? "active" : "inactive"}
      aria-selected={isActive}
      {...props}
    />
  )
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value: string }>(
  ({ className, value, ...props }, ref) => {
    const tabsEl = React.useContext(TabsContext)
    const isActive = tabsEl?.activeTab === value

    if (!isActive) return null

    return (
      <div
        ref={ref}
        role="tabpanel"
        className={cn(
          "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className,
        )}
        data-state={isActive ? "active" : "inactive"}
        {...props}
      />
    )
  },
)
TabsContent.displayName = "TabsContent"

// Create a context to share the active tab state
interface TabsContextValue {
  activeTab?: string
  setActiveTab: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

// Export both the shadcn/ui style components and the HeroUI components
export { Tabs, TabsList, TabsTrigger, TabsContent, HeroUITabs as HeroTabs, HeroUITab as HeroTab }
