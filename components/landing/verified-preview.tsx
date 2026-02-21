"use client"

import { BadgeCheck, Star, Quote, HelpCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ToolLogo } from "@/components/landing/tool-logo"

interface VerifiedTool {
  id: string
  name: string
  tagline: string
  logo_url: string
  pricing_model: string
  average_rating: number
  review_count: number
  why_professionals_use: string
  category_name: string
}

export function VerifiedPreview({ tool }: { tool: VerifiedTool | null }) {
  if (!tool) return null

  return (
    <section className="bg-background px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            {/* Left: text */}
            <div>
              <Badge
                variant="outline"
                className="mb-4 gap-1.5 border-accent/30 text-accent"
              >
                <BadgeCheck className="h-3.5 w-3.5" />
                FlowStack Verified
              </Badge>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl">
                Tools that earned their place
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
                FlowStack Verified is not a badge you can buy. It means real
                professionals have used this tool, reviewed it, and consistently
                rated it highly for their workflows.
              </p>
              <TooltipProvider>
                <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>How does a tool earn Verified status?</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button aria-label="Learn about Verified status">
                        <HelpCircle className="h-4 w-4 text-muted-foreground/50 transition-colors hover:text-muted-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="max-w-xs text-sm leading-relaxed"
                    >
                      A tool earns FlowStack Verified status when it receives
                      consistent positive reviews from multiple professionals
                      across different roles. No payment, no sponsorship — just
                      real community validation.
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>

            {/* Right: card preview */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              {/* Card header */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <ToolLogo
                    name={tool.name}
                    logoUrl={tool.logo_url}
                    size={48}
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-serif text-lg font-bold text-foreground">
                        {tool.name}
                      </h3>
                      <BadgeCheck className="h-4.5 w-4.5 text-accent" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {tool.category_name}
                    </p>
                  </div>
                </div>
                <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground capitalize">
                  {tool.pricing_model}
                </span>
              </div>

              {/* Tagline */}
              <p className="mb-4 text-sm font-medium text-foreground">
                {tool.tagline}
              </p>

              {/* Why professionals use this */}
              <div className="mb-4 rounded-lg bg-background px-4 py-3">
                <div className="mb-1.5 flex items-center gap-1.5">
                  <Quote className="h-3 w-3 text-primary" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Why professionals use this
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {tool.why_professionals_use}
                </p>
              </div>

              {/* Rating bar */}
              <div className="flex items-center gap-3 border-t border-border pt-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-4 w-4 ${
                        s <= Math.round(Number(tool.average_rating))
                          ? "fill-amber-400 text-amber-400"
                          : "text-border"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {Number(tool.average_rating).toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">
                  from {tool.review_count} reviews
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
