"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  LayoutGrid,
  Bookmark,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"

interface DashboardShellProps {
  user: {
    id: string
    email: string
    displayName: string
    roleName: string
    roleSlug: string
  }
  children: React.ReactNode
}

const navItems = [
  { label: "Explore Tools", href: "/dashboard", icon: LayoutGrid },
  { label: "Bookmarks", href: "/dashboard/bookmarks", icon: Bookmark },
  { label: "Profile", href: "/dashboard/profile", icon: User },
]

export function DashboardShell({ user, children }: DashboardShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="FlowStack" width={32} height={32} className="rounded-lg" />
            <span className="font-serif text-lg font-bold text-foreground">
              FlowStack
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-border p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-serif text-sm font-bold text-primary">
              {user.displayName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {user.displayName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user.roleName}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="FlowStack" width={32} height={32} className="rounded-lg" />
            <span className="font-serif text-lg font-bold text-foreground">
              FlowStack
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <X className="h-5 w-5 text-foreground" />
            ) : (
              <Menu className="h-5 w-5 text-foreground" />
            )}
          </button>
        </header>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div className="border-b border-border bg-card p-4 lg:hidden">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-serif text-sm font-bold text-primary">
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-foreground">
                  {user.displayName}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
