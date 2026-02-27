"use client"

import Link from "next/link"
import React from "react"
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
import { GlowCard } from "@/components/ui/glow-card"

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
    <section id="roles" className="relative px-6 py-20 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-xl text-center">
          <p className="mb-3 text-[13px] font-semibold tracking-widest text-primary uppercase">
            Personalized discovery
          </p>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground text-balance md:text-5xl">
            Tools curated for your role
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
            Tell us what you do and see exactly which tools fit your daily work. 
            No more digging through endless directories.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles
            .filter((r) => r.slug !== "other")
            .map((role, i) => {
              const Icon = iconMap[role.icon] || Sparkles
              return (
                <GlowCard
                  key={role.id}
                  className="group flex flex-col p-6 hover:border-primary/30 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm"
                  style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{role.name}</h3>
                  <p className="flex-1 text-[14px] leading-relaxed text-muted-foreground">{role.description}</p>
                  
                  <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
                    {role.tool_count > 0 ? (
                      <span className="text-[13px] font-medium text-foreground px-2.5 py-1 rounded-md bg-secondary">
                        {role.tool_count} tools
                      </span>
                    ) : (
                      <span className="text-[13px] text-muted-foreground">New category</span>
                    )}
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                </GlowCard>
              )
            })}
        </div>

        {roles
          .filter((r) => r.slug === "other")
          .map((role) => (
            <div
              key={role.id}
              className="mx-auto mt-6 max-w-5xl rounded-xl border border-dashed border-border/60 bg-secondary/30 p-8 text-center transition-colors hover:bg-secondary/50 hover:border-border"
            >
              <p className="text-[14px] text-muted-foreground">
                {"Don't see your role? "}
                <span className="text-foreground font-medium">Tell us what you do</span>
                {" and pick your key tasks. We match you with the right tools based on how you actually work."}
              </p>
            </div>
          ))}

        <div className="mt-16 text-center">
          <Button className="h-11 gap-2 rounded-full px-8 text-[14px] shadow-lg transition-transform hover:scale-105" asChild>
            <Link href="/dashboard">
              Browse All Roles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <p className="mt-4 text-[13px] text-muted-foreground">
            Instant access to the entire directory. No login required.
          </p>
        </div>
      </div>
    </section>
  )
}