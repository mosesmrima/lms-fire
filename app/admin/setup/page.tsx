import type { Metadata } from "next"
import SetupClient from "./setup-client"

export const metadata: Metadata = {
  title: "Admin Setup | AfricaHackon LMS",
  description: "Set up the first admin user for the LMS",
}

export default function SetupPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Initial Admin Setup</h1>
      <p className="mb-6 text-gray-600">
        This page allows you to set up the first admin user for the LMS. You only need to do this once. After setting up
        an admin user, you can use that account to manage the system.
      </p>
      <SetupClient />
    </div>
  )
}
