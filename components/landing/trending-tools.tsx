"use client"

import Link from "next/link"
import { ArrowRight, TrendingUp, Star, BadgeCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
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
    <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
      {labels[model] || model}
    </span>
  )
}

export function TrendingTools({ tools }: { tools: TrendingTool[] }) {
  if (!tools || tools.length === 0) return null

  return (
    <section id="trending" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-xl text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-[12px] font-medium text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            Updated weekly
          </div>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl">
            Trending this week
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground text-pretty">
            The tools professionals are actually switching to this week.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-3 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, i) => (
            <Link
              key={tool.id}
              href={`/dashboard/tools/${tool.slug}`}
              className="group flex flex-col rounded-2xl border border-border/60 bg-card p-5 transition-all duration-200 hover:border-border hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] animate-in fade-in slide-in-from-bottom-2 duration-500"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
            >
              {/* Header */}
              <div className="mb-3 flex items-start gap-3">
                <ToolLogo name={tool.name} logoUrl={tool.logo_url} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="truncate text-sm font-semibold text-foreground">
                      {tool.name}
                    </h3>
                    {tool.is_verified && (
                      <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-accent" />
                    )}
                  </div>
                  <p className="text-[12px] text-muted-foreground">
                    {tool.category_name}
                  </p>
                </div>
                <PricingBadge model={tool.pricing_model} />
              </div>

              {/* Tagline */}
              <p className="mb-3 text-[13px] leading-relaxed text-muted-foreground">
                {tool.tagline}
              </p>

              {/* Trending reason */}
              <div className="mb-4 flex-1 rounded-lg bg-secondary/60 px-3 py-2">
                <p className="flex items-start gap-1.5 text-[12px] leading-relaxed text-muted-foreground">
                  <TrendingUp className="mt-0.5 h-3 w-3 shrink-0 text-foreground" />
                  {tool.trending_reason}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-[12px] font-medium text-foreground">
                      {Number(tool.average_rating).toFixed(1)}
                    </span>
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {tool.review_count} reviews
                  </span>
                </div>
                <span className="text-[12px] font-medium text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  View <ArrowRight className="inline h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" className="h-9 gap-2 rounded-full text-[13px]" asChild>
            <Link href="/dashboard">
              See all trending tools
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
