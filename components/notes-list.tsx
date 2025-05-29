"use client"

import { useState } from "react"
import { Card, CardBody, Button, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, addToast } from "@heroui/react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useNotes } from "@/lib/services/note-service"
import { useNoteMutations } from "@/lib/services/note-service"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface NotesListProps {
  courseId: string
  lessonId: string
}

export function NotesList({ courseId, lessonId }: NotesListProps) {
  const { user } = useAuthStore()
  const { data: notes, isLoading } = useNotes(user?.uid || "", courseId)
  const { createNote, updateNote, deleteNote, isCreating, isUpdating, isDeleting } = useNoteMutations()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [noteContent, setNoteContent] = useState("")
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null)

  const handleOpenModal = (noteId?: string, content?: string) => {
    console.log("Opening modal:", { noteId, content })
    if (noteId && content) {
      setEditingNoteId(noteId)
      setNoteContent(content)
    } else {
      setEditingNoteId(null)
      setNoteContent("")
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    console.log("Closing modal")
    setIsModalOpen(false)
    setEditingNoteId(null)
    setNoteContent("")
  }

  const handleSaveNote = async () => {
    if (!user || !noteContent.trim()) return

    try {
      if (editingNoteId) {
        console.log("Updating note:", editingNoteId)
        await updateNote({
          noteId: editingNoteId,
          noteData: {
            content: noteContent,
            updatedAt: new Date()
          }
        })
        addToast({
          title: "Success",
          description: "Note updated successfully",
          timeout: 3000,
          shouldShowTimeoutProgress: true
        })
      } else {
        console.log("Creating new note")
        await createNote({
          userId: user.uid,
          noteData: {
            content: noteContent,
            courseId,
            lessonId,
            createdAt: new Date()
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
        description: editingNoteId ? "Failed to update note" : "Failed to create note",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    try {
      console.log("Deleting note:", noteId)
      setDeletingNoteId(noteId)
      await deleteNote(noteId)
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
        description: "Failed to delete note",
        timeout: 3000,
        shouldShowTimeoutProgress: true
      })
    } finally {
      setDeletingNoteId(null)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  const filteredNotes = notes?.filter(
    note => note.courseId === courseId && note.lessonId === lessonId
  ) || []

  return (
    <div className="relative min-h-[200px]">
      {/* Header with Add Note Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Notes</h2>
        <Button
          color="primary"
          onPress={() => handleOpenModal()}
          className="bg-[#f90026] hover:bg-[#d10021]"
          disabled={isCreating || isUpdating || isDeleting}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Note
        </Button>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <Card 
              key={note.id} 
              className="group transition-all duration-200"
            >
              <CardBody className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                  </span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-[#f90026]/10"
                      onPress={() => handleOpenModal(note.id, note.content)}
                      disabled={isUpdating || isDeleting}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-[#f90026]/10"
                      onPress={() => handleDeleteNote(note.id)}
                      disabled={isUpdating || isDeleting}
                      isLoading={deletingNoteId === note.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-200 whitespace-pre-wrap">{note.content}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12 bg-[#1e1e1e] rounded-lg border border-[#333333]">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#f90026]/10 flex items-center justify-center">
            <Plus className="h-8 w-8 text-[#f90026]" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Notes Yet</h3>
          <p className="text-gray-400">Add your first note to get started</p>
        </div>
      )}

      {/* Add/Edit Note Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
      >
        <ModalContent>
          <ModalHeader className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {editingNoteId ? "Edit Note" : "Add Note"}
            </h2>
          </ModalHeader>
          <ModalBody>
            <Textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Write your note here..."
              disabled={isCreating || isUpdating}
              isRequired={true}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              onPress={handleCloseModal}
              className="mr-2"
              disabled={isCreating || isUpdating}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleSaveNote}
              isLoading={isCreating || isUpdating}
              disabled={!noteContent.trim() || isCreating || isUpdating}
            >
              {editingNoteId ? "Update Note" : "Add Note"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
} 