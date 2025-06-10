import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { collection, query, where, getDocs, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/client"

export function useNotes(userId: string, courseId: string) {
  return useQuery({
    queryKey: ["notes", userId, courseId],
    queryFn: async () => {
      if (!userId || !courseId) return []
      const notesRef = collection(db, "notes")
      const q = query(notesRef, where("userId", "==", userId), where("courseId", "==", courseId))
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    },
    enabled: !!userId && !!courseId
  })
}

export function useNoteMutations() {
  const queryClient = useQueryClient()

  const createNoteMutation = useMutation({
    mutationFn: async ({ userId, noteData }: { userId: string; noteData: any }) => {
      const noteRef = doc(collection(db, "notes"))
      await setDoc(noteRef, {
        ...noteData,
        userId,
        id: noteRef.id,
        createdAt: new Date().toISOString()
      })
      return noteRef.id
    },
    onSuccess: (_, { userId, noteData }) => {
      queryClient.invalidateQueries({ queryKey: ["notes", userId, noteData.courseId] })
    }
  })

  const updateNoteMutation = useMutation({
    mutationFn: async ({ noteId, noteData }: { noteId: string; noteData: any }) => {
      const noteRef = doc(db, "notes", noteId)
      await updateDoc(noteRef, {
        ...noteData,
        updatedAt: new Date().toISOString()
      })
    },
    onSuccess: (_, { noteData }) => {
      queryClient.invalidateQueries({ queryKey: ["notes", noteData.userId, noteData.courseId] })
    }
  })

  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      const noteRef = doc(db, "notes", noteId)
      await deleteDoc(noteRef)
    },
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