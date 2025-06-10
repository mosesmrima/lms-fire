"use client"

import { useState, useEffect } from "react"
import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Link,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Badge,
} from "@heroui/react"
import { usePathname, useRouter } from "next/navigation"
import NextLink from "next/link"
import { useAuthStore } from "@/lib/stores/auth-store"
import { User, Settings, LogOut, BookOpen, LayoutDashboard, ChevronDown, Shield } from "lucide-react"
import Image from "next/image"
import logo from "@/public/logo.png"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, roles = [], loading, signOut, isAdmin, isInstructor } = useAuthStore()

  // Only run auth-dependent code after component is mounted on the client
  useEffect(() => {
    setMounted(true)
  }, [])

  const routes = [
    { href: "/", label: "Home" },
    { href: "/courses", label: "Courses" },
    { href: "/dashboard", label: "Dashboard", protected: true },
    { href: "/instructor", label: "Instructor", protected: true, role: "instructor" },
    { href: "/admin", label: "Admin", protected: true, role: "admin" },
  ]

  // Filter routes based on authentication status and user role
  const filteredRoutes = routes.filter((route) => {
    // Public routes are always shown
    if (!route.protected) return true

    // Protected routes require authentication
    if (mounted && user) {
      // If the route requires a specific role, check for it
      if (route.role) {
        return route.role === "admin" ? isAdmin : 
               route.role === "instructor" ? (isInstructor || isAdmin) : true
      }
      // Otherwise, show to any authenticated user
      return true
    }

    return false
  })

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const navigateToProfile = () => {
    router.push("/profile")
    setIsMenuOpen(false)
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.email) return "U"
    const email = user.email
    const name = email.split("@")[0]
    return name.charAt(0).toUpperCase()
  }

  return (
    <HeroNavbar
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      shouldHideOnScroll
      className="bg-[#111111] border-b border-[#333333] z-50"
    >
      <NavbarContent>
        <NavbarMenuToggle 
          aria-label={isMenuOpen ? "Close menu" : "Open menu"} 
          className="sm:hidden text-white" 
        />
        <NavbarBrand>
          <Image src={logo} alt="logo" width={100} height={100} />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {filteredRoutes.map((route) => (
          <NavbarItem key={route.href} isActive={pathname === route.href}>
            <Link
              as={NextLink}
              href={route.href}
              color={pathname === route.href ? "primary" : "foreground"}
              className={`text-sm font-medium ${pathname === route.href ? "text-[#f90026]" : "text-gray-300"}`}
            >
              {route.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        {!mounted || loading ? (
          // Show placeholder while not mounted or loading
          <NavbarItem>
            <div className="h-10 w-24 bg-[#1e1e1e] animate-pulse rounded-md"></div>
          </NavbarItem>
        ) : user ? (
          // Show user menu when authenticated
          <NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  variant="bordered"
                  className="border-[#333333] min-w-0 px-2 sm:px-4 flex items-center gap-2"
                  endContent={<ChevronDown className="h-4 w-4 opacity-70" />}
                >
                  <Avatar
                    name={getUserInitials()}
                    size="sm"
                    className="bg-[#f90026] text-white"
                    isBordered
                    color="primary"
                  />
                  <span className="hidden sm:inline max-w-[100px] truncate">
                    {user.email?.split("@")[0] || "Account"}
                  </span>
                  {roles && roles.length > 0 && (
                    <Badge color="primary" variant="flat" className="hidden sm:flex">
                      {roles[0].charAt(0).toUpperCase() + roles[0].slice(1)}
                    </Badge>
                  )}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="User menu" className="p-0">
                <DropdownItem
                  key="profile"
                  as={NextLink}
                  href="/profile"
                  startContent={<User className="h-4 w-4" />}
                  description="Manage your account"
                  className="text-white"
                >
                  Profile
                </DropdownItem>
                <DropdownItem
                  key="dashboard"
                  as={NextLink}
                  href="/dashboard"
                  startContent={<LayoutDashboard className="h-4 w-4" />}
                  description="Your learning dashboard"
                >
                  Dashboard
                </DropdownItem>
                <DropdownItem
                  key="courses"
                  as={NextLink}
                  href="/courses"
                  startContent={<BookOpen className="h-4 w-4" />}
                  description="Browse all courses"
                >
                  Courses
                </DropdownItem>
                {(isInstructor || isAdmin) && (
                  <DropdownItem
                    key="instructor"
                    as={NextLink}
                    href="/instructor"
                    startContent={<Settings className="h-4 w-4" />}
                    description="Manage your courses"
                  >
                    Instructor Dashboard
                  </DropdownItem>
                )}
                {isAdmin && (
                  <DropdownItem
                    key="admin"
                    as={NextLink}
                    href="/admin"
                    startContent={<Shield className="h-4 w-4" />}
                    description="System administration"
                  >
                    Admin Dashboard
                  </DropdownItem>
                )}
                <DropdownItem
                  key="logout"
                  onPress={handleLogout}
                  startContent={<LogOut className="h-4 w-4" />}
                  className="text-danger"
                  color="danger"
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        ) : (
          // Show sign in button when not authenticated
          <NavbarItem>
            <Button
              as={NextLink}
              href="/signin"
              className="text-white"
            >
              Sign In
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarMenu>
        {filteredRoutes.map((route) => (
          <NavbarMenuItem key={route.href}>
            <Link
              as={NextLink}
              href={route.href}
              color={pathname === route.href ? "primary" : "foreground"}
              className={`text-sm font-medium ${pathname === route.href ? "text-[#f90026]" : "text-gray-300"}`}
            >
              {route.label}
            </Link>
          </NavbarMenuItem>
        ))}
        {user && (
          <>
            <NavbarMenuItem>
              <Link
                as={NextLink}
                href="/profile"
                color="foreground"
                className="text-sm font-medium text-gray-300"
              >
                Profile
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Button
                onPress={handleLogout}
                color="danger"
                variant="light"
                className="w-full justify-start"
              >
                Log Out
              </Button>
            </NavbarMenuItem>
          </>
        )}
      </NavbarMenu>
    </HeroNavbar>
  )
}
