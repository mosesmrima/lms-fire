"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { User, Lock, Bell } from "lucide-react"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button, Input, addToast } from "@heroui/react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useUserMutations } from "@/lib/services/user-service"

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
        <LoadingSpinner size="lg" />
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
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Manage your profile image</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
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
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-6 w-full">
              <TabsTrigger value="general" className="flex-1">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>General</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex-1">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>Security</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex-1">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Security settings will be available in a future update. Here you will be able to change your
                    password, enable two-factor authentication, and manage connected accounts.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Customize your notification settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Notification settings will be available in a future update. Here you will be able to customize email
                    notifications, in-app alerts, and communication preferences.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
