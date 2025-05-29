"use client"

import { useState, useEffect } from "react"
import { Card, CardBody, Button } from "@heroui/react"
import { FileText, Calendar, BookOpen } from "lucide-react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useStore } from "@/lib/store"
import { LoadingSpinner } from "@/components/loading-spinner"
import { formatDistanceToNow } from "date-fns"

interface Activity {
  id: string
  type: "note" | "enrollment" | "progress"
  title: string
  description: string
  timestamp: Date
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuthStore()
  const { getRecentActivity } = useStore()

  useEffect(() => {
    if (user) {
      loadActivities()
    }
  }, [user])

  const loadActivities = async () => {
    try {
      const recentActivity = await getRecentActivity(user!.uid)
      setActivities(recentActivity)
    } catch (error) {
      console.error("Error loading recent activity:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (activities.length === 0) {
    return (
      <Card className="bg-[#1e1e1e] border-[#333333]">
        <CardBody>
          <p className="text-center text-gray-400">No recent activity</p>
        </CardBody>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id} className="bg-[#1e1e1e] border-[#333333]">
          <CardBody>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-[#f90026]/10 flex-shrink-0">
                {activity.type === "note" && <FileText className="h-5 w-5 text-[#f90026]" />}
                {activity.type === "enrollment" && <Calendar className="h-5 w-5 text-[#f90026]" />}
                {activity.type === "progress" && <BookOpen className="h-5 w-5 text-[#f90026]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-semibold line-clamp-1">{activity.title}</h3>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{activity.description}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  )
}
