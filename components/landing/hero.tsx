"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Sparkles, Star, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  { slug: "product-manager", label: "Product Manager" },
  { slug: "marketer", label: "Marketer" },
  { slug: "writer", label: "Writer" },
  { slug: "data-analyst", label: "Data Analyst" },
]

export function Hero({ roleStacks }: { roleStacks: RoleStack[] }) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const selectedStack = roleStacks.find((rs) => rs.role_slug === selectedRole)
  const previewTools = selectedStack?.tools.slice(0, 5) || []

  return (
    <section className="relative overflow-hidden bg-background px-6 py-20 md:py-28">
      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#2563EB 1px, transparent 1px), linear-gradient(to right, #2563EB 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          {/* Pill badge */}
          <Badge
            variant="secondary"
            className="mb-6 gap-1.5 border border-border px-3 py-1.5 text-sm font-medium animate-in fade-in slide-in-from-bottom-2"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Signal over noise
          </Badge>

          {/* Headline */}
          <h1
            className="font-serif text-4xl font-extrabold leading-tight tracking-tight text-foreground text-balance md:text-6xl md:leading-[1.1] animate-in fade-in slide-in-from-bottom-3"
            style={{ animationDelay: "100ms", animationFillMode: "both" }}
          >
            Stop experimenting blindly.{" "}
            <span className="text-primary">Find the AI tools</span> that
            actually fit your workflow.
          </h1>

          {/* Subtext */}
          <p
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty md:text-xl animate-in fade-in slide-in-from-bottom-3"
            style={{ animationDelay: "200ms", animationFillMode: "both" }}
          >
            Every week, another AI tool promises to change everything. FlowStack
            cuts through the noise with tools curated by role, validated by
            professionals, and organized for how you actually work.
          </p>

          {/* Role selector */}
          <div
            className="mt-10 animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: "300ms", animationFillMode: "both" }}
          >
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
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
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                    selectedRole === role.slug
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5"
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stack preview */}
          {selectedRole && previewTools.length > 0 && (
            <div className="mx-auto mt-8 max-w-2xl animate-in fade-in slide-in-from-bottom-4">
              <div className="rounded-xl border border-primary/20 bg-card p-6 shadow-md">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-serif text-base font-bold text-foreground">
                    Top tools for {selectedStack?.role_name}s
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {selectedStack?.tools.length} total tools
                  </Badge>
                </div>

                <div className="space-y-3">
                  {previewTools.map((tool) => (
                    <div
                      key={tool.slug}
                      className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 transition-colors hover:border-primary/20"
                    >
                      <ToolLogo
                        name={tool.name}
                        logoUrl={tool.logo_url}
                        size={40}
                      />

                      <div className="min-w-0 flex-1 text-left">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {tool.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {tool.tagline}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-semibold text-foreground">
                            {Number(tool.average_rating).toFixed(1)}
                          </span>
                        </span>
                        <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground capitalize">
                          {tool.pricing_model}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Gated CTA */}
                <div className="mt-5 flex flex-col items-center gap-3 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Lock className="h-4 w-4 text-primary" />
                    Sign up to save your stack, see full reviews, and unlock all{" "}
                    {selectedStack?.tools.length} tools
                  </div>
                  <Button size="sm" className="gap-2" asChild>
                    <Link href="/auth/sign-up">
                      Save My Stack
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Trust signals (show when no role is selected) */}
          {!selectedRole && (
            <div
              className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 animate-in fade-in"
              style={{ animationDelay: "500ms", animationFillMode: "both" }}
            >
              {[
                "40+ curated AI tools",
                "Community-validated reviews",
                "Role-specific recommendations",
              ].map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
