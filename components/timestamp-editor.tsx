"use client"

import { useState } from "react"
import { Button, Input, Textarea, Card, CardBody } from "@heroui/react"
import { Clock, Plus, Trash, Save } from "lucide-react"
import type { Timestamp } from "@/lib/types"
import { cn } from "@/lib/utils"

interface TimestampEditorProps {
  timestamps: Timestamp[]
  onChange: (timestamps: Timestamp[]) => void
  currentTime?: number
  className?: string
}

export function TimestampEditor({ timestamps, onChange, currentTime, className }: TimestampEditorProps) {
  const [newTimestamp, setNewTimestamp] = useState("")
  const [newNote, setNewNote] = useState("")

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const addTimestamp = () => {
    if (!newTimestamp || !newNote) return

    const [minutes, seconds] = newTimestamp.split(":").map(Number)
    const totalSeconds = minutes * 60 + seconds

    const newTimestamps = [
      ...timestamps,
      {
        id: Date.now().toString(),
        time: totalSeconds,
        note: newNote,
      },
    ].sort((a, b) => a.time - b.time)

    onChange(newTimestamps)
    setNewTimestamp("")
    setNewNote("")
  }

  const removeTimestamp = (id: string) => {
    const newTimestamps = timestamps.filter((t) => t.id !== id)
    onChange(newTimestamps)
  }

  return (
    <Card className={cn("bg-[#1e1e1e] border-[#333333]", className)}>
      <CardBody>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="MM:SS"
              value={newTimestamp}
              onChange={(e) => setNewTimestamp(e.target.value)}
              className="w-24 bg-[#2a2a2a] border-[#333333]"
            />
            <Textarea
              placeholder="Add a note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="flex-1 bg-[#2a2a2a] border-[#333333]"
            />
            <Button
              color="primary"
              onClick={addTimestamp}
              isDisabled={!newTimestamp || !newNote}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {timestamps.map((timestamp) => (
              <div
                key={timestamp.id}
                className={cn(
                  "flex items-start gap-2 p-2 rounded-lg",
                  currentTime && Math.abs(currentTime - timestamp.time) < 5
                    ? "bg-[#f90026]/10"
                    : "bg-[#2a2a2a]"
                )}
              >
                <div className="flex items-center gap-2 min-w-[80px]">
                  <Clock className="h-4 w-4 text-[#f90026]" />
                  <span className="text-sm font-medium">{formatTime(timestamp.time)}</span>
                </div>
                <p className="flex-1 text-sm">{timestamp.note}</p>
                <Button
                  color="danger"
                  variant="flat"
                  size="sm"
                  onClick={() => removeTimestamp(timestamp.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
