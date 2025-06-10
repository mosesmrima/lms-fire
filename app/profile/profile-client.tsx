"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, Tab } from "@heroui/react"
import { Card, CardBody, CardHeader, CardFooter, Spinner } from "@heroui/react"
import { User, Lock, Bell } from "lucide-react"
import { Button, Input, addToast } from "@heroui/react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useUserMutations } from "@/hooks/queries/use-users"

export default function ProfileClient() {
  const router = useRouter()
  const { user, loading } = useAuthStore()
  const [mounted, setMounted] = useState(false)
  const { updateUser, isUpdating } = useUserMutations()
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    email: user?.email || ""
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push("/signin?redirect=/profile")
    }
  }, [mounted, loading, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      await updateUser({
        userId: user.uid,
        userData: formData
      })

      addToast({
        title: "Success",
        description: "Profile updated successfully",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      addToast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
    }
  }

  if (!mounted || loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Profile Picture</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage your profile image</p>
            </CardHeader>
            <CardBody className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden mb-4">
                {user.photoURL ? (
                  <img
                    src={user.photoURL || "/placeholder.svg"}
                    alt={user.displayName || "Profile"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-semibold">
                    {user.displayName ? user.displayName[0].toUpperCase() : user.email?.[0].toUpperCase()}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">{user.displayName || user.email?.split("@")[0]}</p>
            </CardBody>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Tabs aria-label="Profile Settings" className="w-full">
            <Tab
              key="general"
              title={
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>General</span>
                </div>
              }
            >
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold">General Information</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Update your personal information</p>
                </CardHeader>
                <CardBody>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="displayName" className="block text-sm font-medium mb-1">
                        Display Name
                      </label>
                      <Input
                        id="displayName"
                        value={formData.displayName}
                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" isLoading={isUpdating}>
                      Update Profile
                    </Button>
                  </form>
                </CardBody>
              </Card>
            </Tab>

            <Tab
              key="security"
              title={
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>Security</span>
                </div>
              }
            >
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold">Security Settings</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account security</p>
                </CardHeader>
                <CardBody>
                  <p className="text-muted-foreground mb-4">
                    Security settings will be available in a future update. Here you will be able to change your
                    password, enable two-factor authentication, and manage connected accounts.
                  </p>
                </CardBody>
              </Card>
            </Tab>

            <Tab
              key="notifications"
              title={
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </div>
              }
            >
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold">Notification Preferences</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Customize your notification settings</p>
                </CardHeader>
                <CardBody>
                  <p className="text-muted-foreground mb-4">
                    Notification settings will be available in a future update. Here you will be able to customize email
                    notifications, in-app alerts, and communication preferences.
                  </p>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
