"use client"

import { useState } from "react"
import { Button, Avatar, Spinner } from "@heroui/react"
import { Camera } from "lucide-react"

interface ProfilePictureProps {
  src: string | null
  alt: string
  onUploadClick: () => void
  isLoading?: boolean
}

export default function ProfilePicture({ src, alt, onUploadClick, isLoading = false }: ProfilePictureProps) {
  const [isHovering, setIsHovering] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-32 h-32 rounded-full overflow-hidden mb-4"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {src ? (
          <Avatar
            src={src}
            alt={alt}
            className="w-full h-full"
            imgProps={{ className: "object-cover" }}
          />
        ) : (
          <Avatar
            name={alt}
            className="w-full h-full bg-muted"
            getInitials={getInitials}
          />
        )}

        {isHovering && !isLoading && (
          <div
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
            onClick={onUploadClick}
          >
            <Camera className="text-white h-8 w-8" />
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Spinner size="md" />
          </div>
        )}
      </div>

      <Button 
        variant="bordered" 
        size="sm" 
        onPress={onUploadClick} 
        isDisabled={isLoading} 
        className="mb-2"
      >
        {isLoading ? "Uploading..." : "Change Picture"}
      </Button>
    </div>
  )
}
