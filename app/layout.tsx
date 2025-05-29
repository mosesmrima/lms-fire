"use client"

import { useEffect } from "react"
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useAuthStore } from "@/lib/stores/auth-store"
import { HeroUIProvider, ToastProvider } from "@heroui/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const inter = Inter({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "AfricaHackon Academy",
//   description: "Learn cybersecurity and tech skills with AfricaHackon Academy",
//   generator: "v0.dev",
//   viewport: "width=device-width, initial-scale=1, maximum-scale=1",
// }

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const initialize = useAuthStore(state => state.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <html lang="en" className="dark">
   
        <body className={`${inter.className} bg-[#111111] text-white min-h-screen flex flex-col`}>
        <QueryClientProvider client={queryClient}>
        <HeroUIProvider>
        <ToastProvider toastProps={{
    timeout: 3000,
    hideIcon: true,
    classNames: {
      closeButton: "opacity-100 absolute right-4 top-1/2 -translate-y-1/2",
    },
  }}  placement="top-right"/>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
        </HeroUIProvider>
        </QueryClientProvider>
      </body>

    </html>
  )
}
