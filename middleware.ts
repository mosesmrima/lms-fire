import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ROLES } from "@/lib/types/roles"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /admin, /instructor)
  const path = request.nextUrl.pathname

  // Logging for debugging
  console.log("[Middleware] Path:", path)

  // Allow access to admin setup page without requiring admin role
  if (path === "/admin/setup") {
    console.log("[Middleware] Allowing /admin/setup without admin role.")
    return NextResponse.next()
  }

  // Get the user roles from the cookie
  const userRolesCookie = request.cookies.get("user-roles")
  let userRoles: string[] = []
  try {
    userRoles = userRolesCookie ? JSON.parse(userRolesCookie.value) : []
  } catch (e) {
    console.log("[Middleware] Failed to parse user-roles cookie:", userRolesCookie)
    userRoles = []
  }

  // Logging for debugging
  console.log("[Middleware] userRolesCookie:", userRolesCookie)
  console.log("[Middleware] userRoles:", userRoles)

  // Check if user has admin role
  const isAdmin = userRoles.includes(ROLES.ADMIN)
  const isInstructor = userRoles.includes(ROLES.INSTRUCTOR)
  console.log("[Middleware] isAdmin:", isAdmin, "isInstructor:", isInstructor)

  // Protect admin routes
  if (path.startsWith("/admin") && !isAdmin) {
    console.log("[Middleware] Redirecting from /admin* to / because user is not admin.")
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Protect instructor routes
  if (path.startsWith("/instructor") && !isInstructor && !isAdmin) {
    console.log("[Middleware] Redirecting from /instructor* to / because user is not instructor or admin.")
    return NextResponse.redirect(new URL("/", request.url))
  }

  console.log("[Middleware] Allowing request to proceed.")
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/admin/:path*", "/instructor/:path*"],
}
