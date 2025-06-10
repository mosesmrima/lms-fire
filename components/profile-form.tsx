"use client"

import { useState } from "react"
import { Form, Input, Textarea, Button, addToast } from "@heroui/react"
import { useUserMutations } from "@/hooks/queries/use-users"
import { useQuery } from "@tanstack/react-query"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/client"

interface ProfileFormProps {
  user: {
    uid: string
    displayName: string | null
    email: string | null
    photoURL: string | null
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { updateUser, isUpdating } = useUserMutations()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["user-profile", user.uid],
    queryFn: async () => {
      const profileDoc = await getDoc(doc(db, "userProfiles", user.uid))
      if (profileDoc.exists()) {
        return profileDoc.data()
      }
      return null
    }
  })

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)

    // Validate form data
    const newErrors: Record<string, string> = {}

    if (!data.displayName || data.displayName.toString().length < 2) {
      newErrors.displayName = "Display name must be at least 2 characters"
    } else if (data.displayName.toString().length > 50) {
      newErrors.displayName = "Display name must be less than 50 characters"
    }

    if (data.bio && data.bio.toString().length > 500) {
      newErrors.bio = "Bio must be less than 500 characters"
    }

    if (data.location && data.location.toString().length > 100) {
      newErrors.location = "Location must be less than 100 characters"
    }

    if (data.website && data.website.toString().length > 0) {
      try {
        new URL(data.website.toString())
      } catch {
        newErrors.website = "Please enter a valid URL"
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await updateUser({
        userId: user.uid,
        userData: {
          ...data,
          updatedAt: new Date().toISOString()
        }
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

  if (isLoading) {
    return <div>Loading profile...</div>
  }

  return (
    <Form
      onSubmit={onSubmit}
      className="space-y-6"
      validationErrors={errors}
    >
      <Input
        label="Display Name"
        labelPlacement="outside"
        name="displayName"
        placeholder="Enter your display name"
        defaultValue={user.displayName || user.email?.split("@")[0] || ""}
        errorMessage={errors.displayName}
      />

      <Textarea
        label="Bio"
        labelPlacement="outside"
        name="bio"
        placeholder="Tell us about yourself"
        defaultValue={profileData?.bio || ""}
        errorMessage={errors.bio}
      />

      <Input
        label="Location"
        labelPlacement="outside"
        name="location"
        placeholder="Enter your location"
        defaultValue={profileData?.location || ""}
        errorMessage={errors.location}
      />

      <Input
        label="Website"
        labelPlacement="outside"
        name="website"
        placeholder="Enter your website URL"
        defaultValue={profileData?.website || ""}
        errorMessage={errors.website}
      />

      <Button
        type="submit"
        isLoading={isUpdating}
        className="w-full"
      >
        Update Profile
      </Button>
    </Form>
  )
}
