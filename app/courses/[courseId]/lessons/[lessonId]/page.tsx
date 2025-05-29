"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { Card, CardBody, CardHeader, Button, addToast } from "@heroui/react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useCourse } from "@/hooks/queries/use-courses"
import { useEnrollmentStatus } from "@/hooks/queries/use-enrollment"
import { useCourseProgress, useProgressMutations } from "@/hooks/queries/use-progress"
import { LoadingSpinner } from "@/components/loading-spinner"
import { NotesList } from "@/components/notes-list"
import ReactPlayer from "react-player"
import { useRef } from "react"
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand } from "react-icons/fa"

interface LessonPageProps {
  params: Promise<{
    courseId: string
    lessonId: string
  }>
}

export default function LessonPage({ params }: LessonPageProps) {
  const router = useRouter()
  const { user } = useAuthStore()
  const { courseId, lessonId } = use(params)

  const { data: course, isLoading: isLoadingCourse } = useCourse(courseId)
  const { data: isEnrolled, isLoading: isLoadingEnrollment } = useEnrollmentStatus(user?.uid || "", courseId)
  const { data: progress, isLoading: isLoadingProgress } = useCourseProgress(user?.uid || "", courseId)
  const { updateProgress, isUpdating } = useProgressMutations()
  const [isVideoEnded, setIsVideoEnded] = useState(false)
  const [togglingLesson, setTogglingLesson] = useState<string | null>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [played, setPlayed] = useState(0)
  const [seeking, setSeeking] = useState(false)
  const playerRef = useRef<ReactPlayer | null>(null)

  useEffect(() => {
    if (!isLoadingEnrollment && !isEnrolled) {
      addToast({
        color: "danger",
        title: "Not enrolled",
        description: "You must be enrolled in this course to view lessons"
      })
      router.push(`/courses/${courseId}`)
    }
  }, [isEnrolled, isLoadingEnrollment, courseId, router])

  if (isLoadingCourse || isLoadingEnrollment || isLoadingProgress) {
    return <LoadingSpinner />
  }

  if (!course) {
    return <div>Course not found</div>
  }

  const lesson = course.lessons.find((l) => l.id === lessonId)
  if (!lesson) {
    return <div>Lesson not found</div>
  }

  // Completion state
  const completedLessons: Record<string, { completed: boolean }> = progress || {}
  const isCompleted = !!completedLessons[lessonId]?.completed

  // Attachments
  const attachments = lesson.attachments || []

  // Video URL
  let videoUrl = ""
  if ("videoUrl" in lesson && typeof lesson.videoUrl === "string") {
    videoUrl = lesson.videoUrl
  } else if (lesson.attachments && Array.isArray(lesson.attachments)) {
    const videoAttachment = lesson.attachments.find(
      (a: any) =>
        a.type?.startsWith("video/") ||
        (typeof a.url === "string" && (a.url.endsWith(".mp4") || a.url.includes("youtube.com") || a.url.includes("youtu.be")))
    )
    videoUrl = videoAttachment?.url || ""
  }

  // Toggle completion for any lesson
  const handleToggleLessonComplete = async (targetLessonId: string, currentlyCompleted: boolean) => {
    if (!user) {
      addToast({ color: "danger", title: "You must be logged in to update progress" })
      return
    }
    setTogglingLesson(targetLessonId)
    try {
      await updateProgress({ userId: user.uid, courseId, lessonId: targetLessonId, completed: !currentlyCompleted })
      addToast({ color: "success", title: !currentlyCompleted ? "Lesson marked as complete" : "Lesson marked as incomplete" })
    } catch (error) {
      addToast({ color: "danger", title: "Error updating lesson progress" })
    } finally {
      setTogglingLesson(null)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold mb-2 md:mb-0">{lesson.title}</h1>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                color={isCompleted ? "success" : "default"}
                variant={isCompleted ? "solid" : "bordered"}
                onPress={() => handleToggleLessonComplete(lessonId, isCompleted)}
                isLoading={isUpdating && togglingLesson === lessonId}
              >
                {isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            {/* Video Player */}
            {videoUrl && (
              <div className="mb-6 aspect-video rounded-lg overflow-hidden bg-black flex items-center justify-center relative group">
                <ReactPlayer
                  ref={playerRef}
                  url={videoUrl}
                  width="100%"
                  height="100%"
                  playing={playing}
                  muted={muted}
                  volume={volume}
                  controls={false}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onEnded={() => {
                    setIsVideoEnded(true)
                    setPlaying(false)
                    if (!isCompleted) handleToggleLessonComplete(lessonId, false)
                  }}
                  onProgress={({ played }) => {
                    if (!seeking) setPlayed(played)
                  }}
                  config={{
                    youtube: {
                      playerVars: {
                        controls: 0,
                        modestbranding: 1,
                        rel: 0,
                        showinfo: 0,
                        fs: 0,
                        iv_load_policy: 3,
                        disablekb: 1,
                        origin: typeof window !== 'undefined' ? window.location.origin : undefined,
                      },
                    },
                  }}
                />
                {/* Custom Controls Overlay */}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-black/0 px-4 py-3 flex flex-col gap-2 opacity-100 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-4">
                    {/* Play/Pause */}
                    <button
                      onClick={e => { e.stopPropagation(); setPlaying(p => !p) }}
                      className="text-white hover:text-primary focus:outline-none"
                      aria-label={playing ? "Pause" : "Play"}
                    >
                      {playing ? <FaPause size={22} /> : <FaPlay size={22} />}
                    </button>
                    {/* Progress Bar */}
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step="any"
                      value={played}
                      onMouseDown={() => setSeeking(true)}
                      onChange={e => {
                        setPlayed(parseFloat(e.target.value))
                        if (playerRef.current) {
                          playerRef.current.seekTo(parseFloat(e.target.value))
                        }
                      }}
                      onMouseUp={e => {
                        setSeeking(false)
                        if (playerRef.current) {
                          playerRef.current.seekTo(parseFloat(e.currentTarget.value))
                        }
                      }}
                      className="flex-1 accent-primary h-1 rounded-lg cursor-pointer"
                    />
                    {/* Mute/Unmute */}
                    <button
                      onClick={e => { e.stopPropagation(); setMuted(m => !m) }}
                      className="text-white hover:text-primary focus:outline-none"
                      aria-label={muted ? "Unmute" : "Mute"}
                    >
                      {muted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
                    </button>
                    {/* Volume Slider */}
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={volume}
                      onChange={e => setVolume(parseFloat(e.target.value))}
                      className="w-24 accent-primary h-1 rounded-lg cursor-pointer mx-2"
                      aria-label="Volume"
                    />
                    {/* Fullscreen (browser fullscreen) */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        const el = e.currentTarget.closest('.aspect-video');
                        if (el && el.requestFullscreen) el.requestFullscreen();
                      }}
                      className="text-white hover:text-primary focus:outline-none"
                      aria-label="Fullscreen"
                    >
                      <FaExpand size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="prose max-w-none mb-6">
              {lesson.content}
            </div>
            {/* Attachments */}
            {attachments.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Attachments</h3>
                <ul className="list-disc pl-6 space-y-1">
                  {attachments.map((a: any) => (
                    <li key={a.id}>
                      <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                        {a.name || a.url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardBody>
        </Card>
        {/* Notes */}
        <div className="mt-8">
          <Card>
            <CardBody>
              <NotesList courseId={courseId} lessonId={lessonId} />
            </CardBody>
          </Card>
        </div>
      </div>
      {/* Sidebar: Lesson List */}
      <aside className="w-full lg:w-1/4">
        <Card className="sticky top-8">
          <CardHeader>
            <h2 className="text-lg font-semibold">{course.title}</h2>
          </CardHeader>
          <CardBody>
            <ul className="space-y-1">
              {course.lessons.map((l) => {
                const completed = !!completedLessons[l.id]?.completed
                const isCurrent = l.id === lessonId
                return (
                  <li
                    key={l.id}
                    className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-colors select-none ${isCurrent ? "bg-red-600/80 text-white" : "hover:bg-neutral-800/80"}`}
                    onClick={() => router.push(`/courses/${courseId}/lessons/${l.id}`)}
                  >
                    {/* Icon */}
                    <span
                      onClick={e => {
                        e.stopPropagation();
                        handleToggleLessonComplete(l.id, completed);
                      }}
                      className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-500 bg-black/40 mr-1 transition-colors hover:border-green-500 hover:bg-green-900/30"
                      title={completed ? "Mark as incomplete" : "Mark as complete"}
                      style={{ cursor: 'pointer' }}
                    >
                      {completed ? (
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      ) : isCurrent ? (
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><polygon points="6,4 18,10 6,16" /></svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
                      )}
                    </span>
                    {/* Title */}
                    <span className={`flex-1 truncate font-medium ${isCurrent ? "text-white" : completed ? "text-green-300" : "text-gray-200"}`}>{l.title}</span>
                    {/* (Optional) Time/duration placeholder */}
                    {/* <span className="text-xs text-gray-400 ml-2">10:59</span> */}
                  </li>
                )
              })}
            </ul>
          </CardBody>
        </Card>
      </aside>
    </div>
  )
} 