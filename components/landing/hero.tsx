"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Star, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ToolLogo } from "@/components/landing/tool-logo"

interface StackTool {
  name: string
  slug: string
  tagline: string
  logo_url: string
  average_rating: number
  pricing_model: string
}

interface RoleStack {
  role_slug: string
  role_name: string
  tools: StackTool[]
}

const roleChips = [
  { slug: "developer", label: "Developer" },
  { slug: "designer", label: "Designer" },
  { slug: "product-manager", label: "PM" },
  { slug: "marketer", label: "Marketer" },
  { slug: "writer", label: "Writer" },
  { slug: "data-analyst", label: "Analyst" },
]

export function Hero({ roleStacks }: { roleStacks: RoleStack[] }) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const selectedStack = roleStacks.find((rs) => rs.role_slug === selectedRole)
  const previewTools = selectedStack?.tools.slice(0, 5) || []

  return (
    <section className="relative px-6 pt-24 pb-20 md:pt-32 md:pb-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 animate-in fade-in slide-in-from-bottom-1 duration-500">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-secondary px-3.5 py-1 text-[13px] font-medium tracking-wide text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Signal over noise
            </span>
          </div>

          <h1
            className="font-serif text-[40px] font-extrabold leading-[1.1] tracking-tight text-foreground text-balance md:text-[56px] animate-in fade-in slide-in-from-bottom-2 duration-500"
            style={{ animationDelay: "80ms", animationFillMode: "both" }}
          >
            Find the AI tools that actually fit your workflow.
          </h1>

          <p
            className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted-foreground text-pretty md:text-lg animate-in fade-in slide-in-from-bottom-2 duration-500"
            style={{ animationDelay: "160ms", animationFillMode: "both" }}
          >
            Curated by role, validated by real professionals, and organized
            around the tasks you do every day -- not marketing buzzwords.
          </p>

          {/* Role selector */}
          <div
            className="mt-12 animate-in fade-in slide-in-from-bottom-2 duration-500"
            style={{ animationDelay: "240ms", animationFillMode: "both" }}
          >
            <p className="mb-3 text-[13px] font-medium text-muted-foreground">
              Select your role to preview your stack
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {roleChips.map((role) => (
                <button
                  key={role.slug}
                  onClick={() =>
                    setSelectedRole(
                      selectedRole === role.slug ? null : role.slug
                    )
                  }
                  className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200 ${
                    selectedRole === role.slug
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stack preview */}
        {selectedRole && previewTools.length > 0 && (
          <div className="mx-auto mt-10 max-w-xl animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[13px] font-medium text-muted-foreground">
                  Top tools for{" "}
                  <span className="text-foreground">{selectedStack?.role_name}s</span>
                </p>
                <span className="text-[12px] text-muted-foreground">
                  {selectedStack?.tools.length} total
                </span>
              </div>

              <div className="space-y-2">
                {previewTools.map((tool) => (
                  <div
                    key={tool.slug}
                    className="flex items-center gap-3 rounded-xl border border-border/40 bg-background p-3 transition-colors hover:border-border"
                  >
                    <ToolLogo
                      name={tool.name}
                      logoUrl={tool.logo_url}
                      size={36}
                    />
                    <div className="min-w-0 flex-1 text-left">
                      <p className="truncate text-sm font-medium text-foreground">
                        {tool.name}
                      </p>
                      <p className="truncate text-[12px] text-muted-foreground">
                        {tool.tagline}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-[12px] font-medium text-foreground">
                          {Number(tool.average_rating).toFixed(1)}
                        </span>
                      </span>
                      <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground capitalize">
                        {tool.pricing_model}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-col items-start gap-3 rounded-xl border border-dashed border-border bg-secondary/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  <Lock className="h-3.5 w-3.5" />
                  Sign up to save your stack and see all {selectedStack?.tools.length} tools
                </span>
                <Button size="sm" className="h-9 w-full gap-2 rounded-full px-4 text-[13px] sm:w-auto" asChild>
                  <Link href="/auth/sign-up">
                    Save My Stack
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Trust line */}
        {!selectedRole && (
          <div
            className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[13px] text-muted-foreground animate-in fade-in duration-500"
            style={{ animationDelay: "400ms", animationFillMode: "both" }}
          >
            <span>40+ curated tools</span>
            <span className="hidden sm:block h-3 w-px bg-border" />
            <span>Community validated</span>
            <span className="hidden sm:block h-3 w-px bg-border" />
            <span>Role-specific stacks</span>
          </div>
        )}
      </div>
    </section>
  )
}
