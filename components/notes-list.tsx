"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Textarea, addToast } from "@heroui/react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useNotes, useNoteMutations } from "@/hooks/queries/use-notes"
import { Trash2, Edit2 } from "lucide-react"

interface NotesListProps {
  courseId: string
  lessonId: string
}

interface NoteFormData {
  content: string
}

export function NotesList({ courseId, lessonId }: NotesListProps) {
  const { user } = useAuthStore()
  const { data: notes, isLoading } = useNotes(user?.uid || "", courseId)
  const { createNote, updateNote, deleteNote, isCreating, isUpdating, isDeleting } = useNoteMutations()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null)

  const { register, handleSubmit, reset, setValue } = useForm<NoteFormData>()

  const handleOpenModal = (noteId?: string, content?: string) => {
    if (noteId && content) {
      setEditingNoteId(noteId)
      setValue("content", content)
    } else {
      setEditingNoteId(null)
      reset()
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingNoteId(null)
    reset()
  }

  const onSubmit = async (data: NoteFormData) => {
    if (!user) return

    try {
      if (editingNoteId) {
        await updateNote({
          noteId: editingNoteId,
          noteData: {
            content: data.content,
            userId: user.uid,
            courseId,
            lessonId
          }
        })
        addToast({
          title: "Success",
          description: "Note updated successfully",
          timeout: 3000,
          shouldShowTimeoutProgress: true
        })
      } else {
        await createNote({
          userId: user.uid,
          noteData: {
            content: data.content,
            courseId,
            lessonId
          }
        })
        addToast({
          title: "Success",
          description: "Note created successfully",
          timeout: 3000,
          shouldShowTimeoutProgress: true
        })
      }
      handleCloseModal()
    } catch (error) {
      console.error("Error saving note:", error)
      addToast({
        title: "Error",
        description: "Failed to save note. Please try again.",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
    }
  }

  const handleDelete = async (noteId: string) => {
    try {
      await deleteNote(noteId)
      setDeletingNoteId(null)
      addToast({
        title: "Success",
        description: "Note deleted successfully",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
    } catch (error) {
      console.error("Error deleting note:", error)
      addToast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
    }
  }

  if (isLoading) {
    return <div>Loading notes...</div>
  }

  const filteredNotes = notes?.filter(note => note.lessonId === lessonId) || []

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Notes</h3>
        <Button
          size="sm"
          onPress={() => handleOpenModal()}
          isLoading={isCreating}
        >
          Add Note
        </Button>
      </div>

      {filteredNotes.length === 0 ? (
        <p className="text-gray-400">No notes yet. Add your first note!</p>
      ) : (
        <div className="space-y-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="p-4 bg-[#1e1e1e] rounded-lg border border-[#333333]"
            >
              <div className="flex justify-between items-start">
                <p className="whitespace-pre-wrap">{note.content}</p>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onPress={() => handleOpenModal(note.id, note.content)}
                    isLoading={isUpdating}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    color="danger"
                    onPress={() => setDeletingNoteId(note.id)}
                    isLoading={isDeleting && deletingNoteId === note.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>
              {editingNoteId ? "Edit Note" : "Add Note"}
            </ModalHeader>
            <ModalBody>
              <Textarea
                {...register("content", { required: true })}
                placeholder="Write your note here..."
                className="min-h-[200px]"
              />
            </ModalBody>
            <ModalFooter>
              <Button
                type="button"
                variant="ghost"
                onPress={handleCloseModal}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isCreating || isUpdating}
              >
                {editingNoteId ? "Update" : "Save"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={!!deletingNoteId}
        onClose={() => setDeletingNoteId(null)}
      >
        <ModalContent>
          <ModalHeader>Delete Note</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete this note?</p>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              onPress={() => setDeletingNoteId(null)}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={() => deletingNoteId && handleDelete(deletingNoteId)}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
} 