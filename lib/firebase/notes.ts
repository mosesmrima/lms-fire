import { db } from "./index"
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, Timestamp } from "firebase/firestore"

export interface Note {
  id: string
  userId: string
  courseId: string
  lessonId: string
  content: string
  createdAt: Date
  updatedAt?: Date
}

// Get all notes for a user, optionally filtered by course
export async function getUserNotes(userId: string, courseId?: string) {
  try {
    const notesRef = collection(db, "notes")
    let q = query(
      notesRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    )

    if (courseId) {
      q = query(q, where("courseId", "==", courseId))
    }

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    })) as Note[]
  } catch (error) {
    console.error("Error getting notes:", error)
    throw error
  }
}

// Create a new note
export async function createNote(userId: string, noteData: Omit<Note, "id" | "userId">) {
  try {
    const notesRef = collection(db, "notes")
    const docRef = await addDoc(notesRef, {
      ...noteData,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating note:", error)
    throw error
  }
}

// Update an existing note
export async function updateNote(noteId: string, noteData: Partial<Note>) {
  try {
    const noteRef = doc(db, "notes", noteId)
    await updateDoc(noteRef, {
      ...noteData,
      updatedAt: Timestamp.now()
    })
  } catch (error) {
    console.error("Error updating note:", error)
    throw error
  }
}

// Delete a note
export async function deleteNote(noteId: string) {
  try {
    const noteRef = doc(db, "notes", noteId)
    await deleteDoc(noteRef)
  } catch (error) {
    console.error("Error deleting note:", error)
    throw error
  }
} 