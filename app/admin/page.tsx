import { Suspense } from "react"
import { AdminClientPage } from "./admin-client"
import { Spinner } from "@heroui/react"

export const metadata = {
  title: "Admin Dashboard | AfricaHackon LMS",
  description: "Admin dashboard for managing the AfricaHackon Learning Management System",
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#0c0c0c]">
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-[60vh]">
            <Spinner size="lg" />
          </div>
        }
      >
        <AdminClientPage />
      </Suspense>
    </div>
  )
}
