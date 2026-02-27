"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { CommandMenu } from "@/components/landing/command-menu"

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/images/logo.png" alt="FlowStack" width={36} height={36} />
            <span className="font-serif text-lg font-bold tracking-tight text-foreground">
              FlowStack
            </span>
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
            <Link href="#how-it-works" className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground">
              How It Works
            </Link>
            <Link href="#trending" className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground">
              Trending
            </Link>
            <Link href="#roles" className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground">
              By Role
            </Link>
          </div>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {/* The new Command Menu */}
          <CommandMenu />

          <div className="h-4 w-px bg-border/60" />

          <Button size="sm" className="h-9 gap-2 rounded-full px-5 text-[13px] shadow-sm transition-transform hover:scale-105" asChild>
            <Link href="/dashboard">
              <LayoutGrid className="h-3.5 w-3.5" />
              Directory
            </Link>
          </Button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X className="h-5 w-5 text-foreground" />
          ) : (
            <Menu className="h-5 w-5 text-foreground" />
          )}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border/60 bg-background md:hidden animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex flex-col gap-1 px-6 py-4">
            <div className="mb-4">
               <CommandMenu />
            </div>
            <Link href="#how-it-works" className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary" onClick={() => setMobileOpen(false)}>
              How It Works
            </Link>
            <Link href="#trending" className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary" onClick={() => setMobileOpen(false)}>
              Trending
            </Link>
            <Link href="#roles" className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary" onClick={() => setMobileOpen(false)}>
              By Role
            </Link>
            <div className="mt-3 border-t border-border/60 pt-3">
              <Button size="sm" className="w-full gap-2 rounded-full h-10" asChild>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                  <LayoutGrid className="h-4 w-4" />
                  Explore Directory
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}