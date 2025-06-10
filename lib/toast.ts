import { addToast } from "@heroui/react"

// Basic toast function
export const toast = {
  // Success toast
  success: (title: string, description?: string) => {
    addToast({
      title,
      description,
      color: "success",
      timeout: 3000,
      shouldShowTimeoutProgress: true
    })
  },

  // Error toast
  error: (title: string, description?: string) => {
    addToast({
      title,
      description,
      color: "danger",
      timeout: 3000,
      shouldShowTimeoutProgress: true
    })
  },

  // Info toast
  info: (title: string, description?: string) => {
    addToast({
      title,
      description,
      color: "primary",
      timeout: 3000,
      shouldShowTimeoutProgress: true
    })
  },

  // Warning toast
  warning: (title: string, description?: string) => {
    addToast({
      title,
      description,
      color: "warning",
      timeout: 3000,
      shouldShowTimeoutProgress: true
    })
  },

  // Default toast
  default: (title: string, description?: string) => {
    addToast({
      title,
      description,
      color: "default",
      timeout: 3000,
      shouldShowTimeoutProgress: true
    })
  }
} 