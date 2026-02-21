"use client"

import Link from "next/link"
import {
  Code,
  Palette,
  Target,
  Megaphone,
  PenTool,
  BarChart3,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const iconMap: Record<string, React.ElementType> = {
  Code,
  Palette,
  Target,
  Megaphone,
  PenTool,
  BarChart3,
  Sparkles,
}

interface Role {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  tool_count: number
}

export function RolePreview({ roles }: { roles: Role[] }) {
  return (
    <section id="roles" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-xl text-center">
          <p className="mb-3 text-[13px] font-medium tracking-wide text-muted-foreground uppercase">
            Personalized discovery
          </p>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl">
            Tools curated for your role
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground text-pretty">
            Pick your role and we surface the tools that matter.
          </p>
        </div>

        <div className="mx-auto grid max-w-3xl gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 sm:grid-cols-2 lg:grid-cols-3">
          {roles
            .filter((r) => r.slug !== "other")
            .map((role, i) => {
              const Icon = iconMap[role.icon] || Sparkles
              return (
                <div
                  key={role.id}
                  className="group flex flex-col bg-card p-6 transition-colors hover:bg-secondary/30 animate-in fade-in slide-in-from-bottom-2 duration-500"
                  style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="mb-1 text-sm font-semibold text-foreground">{role.name}</h3>
                  <p className="flex-1 text-[13px] leading-relaxed text-muted-foreground">{role.description}</p>
                  {role.tool_count > 0 && (
                    <p className="mt-3 text-[12px] font-medium text-foreground">{role.tool_count} tools</p>
                  )}
                </div>
              )
            })}
        </div>

        {/* "Other" card */}
        {roles
          .filter((r) => r.slug === "other")
          .map((role) => (
            <div
              key={role.id}
              className="mx-auto mt-3 max-w-3xl rounded-2xl border border-dashed border-border/60 bg-card p-6 text-center"
            >
              <p className="text-[13px] text-muted-foreground">
                {"Don't see your role? "}
                <span className="text-foreground">Tell us what you do</span>
                {" and pick your key tasks. We match you with the right tools based on how you actually work."}
              </p>
            </div>
          ))}

        <div className="mt-12 text-center">
          <Button className="h-9 gap-2 rounded-full text-[13px]" asChild>
            <Link href="/auth/sign-up">
              Find My AI Stack
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <p className="mt-3 text-[13px] text-muted-foreground">
            Pick your role. See your tools. Takes under 2 minutes.
          </p>
        </div>
      </div>
    </section>
  )
}
