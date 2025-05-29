"use client"

import { useState, useEffect } from "react"
import { Card, CardBody, CardFooter, Button, Textarea } from "@heroui/react"
import { Edit, Trash, Save, X } from "lucide-react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useStore } from "@/lib/store"
import { LoadingSpinner } from "@/components/loading-spinner"

interface NotesSectionProps {
  courseId: string
}

export function NotesSection({ courseId }: NotesSectionProps) {
  const [notes, setNotes] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { user } = useAuthStore()
  const { getNotes, saveNotes } = useStore()

  useEffect(() => {
    if (user) {
      loadNotes()
    }
  }, [user, courseId])

  const loadNotes = async () => {
    try {
      const userNotes = await getNotes(user!.uid, courseId)
      setNotes(userNotes || "")
    } catch (error) {
      console.error("Error loading notes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      await saveNotes(user.uid, courseId, notes)
      setIsEditing(false)
    } catch (error) {
      console.error("Error saving notes:", error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <Card className="bg-[#1e1e1e] border-[#333333]">
      <CardBody>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Course Notes</h3>
          {!isEditing ? (
            <Button
              color="primary"
              variant="flat"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Notes
            </Button>
          ) : (
            <Button
              color="default"
              variant="flat"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your notes here..."
              className="min-h-[200px] bg-[#111111] border-[#333333]"
            />
            <div className="flex justify-end gap-2">
              <Button
                color="danger"
                variant="flat"
                onClick={() => {
                  setNotes("")
                  setIsEditing(false)
                }}
              >
                <Trash className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <Button
                color="primary"
                onClick={handleSave}
                isLoading={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Notes
              </Button>
            </div>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none">
            {notes ? (
              <p className="whitespace-pre-wrap">{notes}</p>
            ) : (
              <p className="text-gray-400 italic">No notes yet. Click "Edit Notes" to add some.</p>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  )
}
