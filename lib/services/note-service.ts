"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getUserNotes, createNote, updateNote, deleteNote, type Note } from "@/lib/firebase/notes"

export function useNotes(userId: string, courseId?: string) {
  return useQuery({
    queryKey: ["notes", userId, courseId],
    queryFn: () => getUserNotes(userId, courseId),
    enabled: !!userId
  })
}

export function useNoteMutations() {
  const queryClient = useQueryClient()

  const createNoteMutation = useMutation({
    mutationFn: ({ userId, noteData }: { userId: string; noteData: Omit<Note, "id" | "userId"> }) =>
      createNote(userId, noteData),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["notes", userId] })
    }
  })

  const updateNoteMutation = useMutation({
    mutationFn: ({ noteId, noteData }: { noteId: string; noteData: Partial<Note> }) =>
      updateNote(noteId, noteData),
    onSuccess: (_, { noteId }) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] })
    }
  })

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] })
    }
  })

  return {
    createNote: createNoteMutation.mutate,
    updateNote: updateNoteMutation.mutate,
    deleteNote: deleteNoteMutation.mutate,
    isCreating: createNoteMutation.isPending,
    isUpdating: updateNoteMutation.isPending,
    isDeleting: deleteNoteMutation.isPending
  }
} 