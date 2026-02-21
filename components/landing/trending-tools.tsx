"use client"

import Link from "next/link"
import {
  ArrowRight,
  TrendingUp,
  Star,
  BadgeCheck,
  HelpCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ToolLogo } from "@/components/landing/tool-logo"

interface TrendingTool {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  website_url: string
  logo_url: string
  pricing_model: string
  is_verified: boolean
  trending_reason: string
  average_rating: number
  review_count: number
  category_name: string
}

function PricingBadge({ model }: { model: string }) {
  const labels: Record<string, string> = {
    free: "Free",
    freemium: "Freemium",
    paid: "Paid",
    enterprise: "Enterprise",
    "open-source": "Open Source",
  }
  return (
    <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
      {labels[model] || model}
    </span>
  )
}

export function TrendingTools({ tools }: { tools: TrendingTool[] }) {
  if (!tools || tools.length === 0) return null

  return (
    <section id="trending" className="bg-background px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mx-auto mb-14 flex max-w-2xl flex-col items-center text-center">
          <Badge
            variant="secondary"
            className="mb-4 gap-1.5 border border-border px-3 py-1.5 text-sm font-medium"
          >
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            Updated weekly
          </Badge>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl">
            Trending AI stacks this week
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            The tools gaining real momentum among professionals right now — not
            hype, not ads, just signal.
          </p>
        </div>

        {/* Tools grid */}
        <TooltipProvider>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool, i) => (
              <Link
                key={tool.id}
                href={`/dashboard/tools/${tool.slug}`}
                className="group relative flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-md animate-in fade-in slide-in-from-bottom-4"
                style={{
                  animationDelay: `${i * 100}ms`,
                  animationFillMode: "both",
                }}
              >
                {/* Header row */}
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <ToolLogo
                      name={tool.name}
                      logoUrl={tool.logo_url}
                      size={40}
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-serif text-base font-bold text-foreground">
                          {tool.name}
                        </h3>
                        {tool.is_verified && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                <BadgeCheck className="h-4 w-4 text-accent" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              FlowStack Verified — consistently rated highly by
                              professionals
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {tool.category_name}
                      </p>
                    </div>
                  </div>
                  <PricingBadge model={tool.pricing_model} />
                </div>

                {/* Tagline */}
                <p className="mb-3 text-sm font-medium text-foreground">
                  {tool.tagline}
                </p>

                {/* Trending reason */}
                <div className="mb-4 flex-1 rounded-lg bg-primary/5 px-3 py-2">
                  <p className="flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground">
                    <TrendingUp className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                    {tool.trending_reason}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-semibold text-foreground">
                        {Number(tool.average_rating).toFixed(1)}
                      </span>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {tool.review_count} reviews
                    </span>
                  </div>
                  <span className="text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    View details{" "}
                    <ArrowRight className="inline h-3 w-3" />
                  </span>
                </div>

                {/* Help tooltip */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="absolute right-3 bottom-3 text-muted-foreground/30 transition-colors hover:text-muted-foreground"
                      aria-label="What makes this tool trending?"
                      onClick={(e) => e.preventDefault()}
                    >
                      <HelpCircle className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="max-w-xs text-sm leading-relaxed"
                  >
                    Trending tools are curated by the FlowStack team based on
                    community activity — bookmark velocity, new reviews, and
                    rating momentum over the past 7 days.
                  </TooltipContent>
                </Tooltip>
              </Link>
            ))}
          </div>
        </TooltipProvider>

        {/* CTA */}
        <div className="mt-14 text-center">
          <Button variant="outline" size="lg" className="gap-2" asChild>
            <Link href="/dashboard">
              See all trending tools this week
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
