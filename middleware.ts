import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ROLES, isAdmin, isInstructor, type Role } from "@/lib/rbac/types"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected)
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/" || path === "/signin" || path === "/signup"

  // Get the token from the cookies
  const token = request.cookies.get("token")?.value || ""

  // Get the user roles from the cookie
  const userRolesCookie = request.cookies.get("user-roles")
  let userRoles: Role[] = []
  try {
    const parsedRoles = userRolesCookie ? JSON.parse(userRolesCookie.value) : []
    // Validate that all roles are valid
    userRoles = parsedRoles.filter((role: string) => 
      Object.values(ROLES).includes(role as Role)
    ) as Role[]
  } catch (e) {
    console.log("[Middleware] Failed to parse user-roles cookie:", userRolesCookie)
    userRoles = []
  }

  // Logging for debugging
  console.log("[Middleware] Path:", path)
  console.log("[Middleware] userRoles:", userRoles)

  // Handle authentication
  if (!token && !isPublicPath) {
    // If no token and trying to access protected route, redirect to signin
    return NextResponse.redirect(new URL("/signin", request.url))
  }

  // Handle role-based access control
  if (token) {
    // Protect admin routes
    if (path.startsWith("/admin") && !isAdmin(userRoles)) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // Protect instructor routes
    if (path.startsWith("/instructor") && !isInstructor(userRoles)) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  console.log("[Middleware] Allowing request to proceed.")
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/dashboard/:path*", "/signin", "/signup", "/admin/:path*", "/instructor/:path*"],
}
