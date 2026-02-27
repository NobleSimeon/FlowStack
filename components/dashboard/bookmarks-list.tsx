"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GlowCard } from "@/components/ui/glow-card"
import { ToolLogo } from "@/components/landing/tool-logo"
import {
  Star,
  BookmarkX,
  BadgeCheck,
  TrendingUp,
  Bookmark,
  Share2,
  Sparkles,
  Plus,
  ExternalLink,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

function PricingBadge({ model }: { model: string }) {
  const labels: Record<string, string> = {
    free: "Free",
    freemium: "Freemium",
    paid: "Paid",
    enterprise: "Enterprise",
    "open-source": "Open Source",
  }
  return (
    <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground capitalize">
      {labels[model] || model}
    </span>
  )
}

interface BookmarkedTool {
  bookmarkId: string
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  website_url: string
  pricing_model: string
  is_verified: boolean
  is_trending: boolean
  average_rating: number
  review_count: number
  category_name: string
  category_slug: string
  logo_url?: string | null
}

interface RecommendedTool {
  id: string
  name: string
  slug: string
  tagline: string
  average_rating: number
  review_count: number
  is_verified: boolean
  pricing_model: string
  logo_url?: string | null
  category_name: string
}

interface BookmarksListProps {
  tools: BookmarkedTool[]
  recommendations: RecommendedTool[]
}

export function BookmarksList({
  tools: initialTools,
  recommendations,
}: BookmarksListProps) {
  const supabase = createClient()
  const [tools, setTools] = useState(initialTools)
  const [shareMsg, setShareMsg] = useState("")

  const removeBookmark = async (bookmarkId: string, toolId: string) => {
    setTools((prev) => prev.filter((t) => t.bookmarkId !== bookmarkId))
    await supabase.from("bookmarks").delete().eq("tool_id", toolId)
  }

  const handleShareStack = async () => {
    const toolNames = tools.map((t) => t.name).join(", ")
    const text = `My AI Stack on FlowStack: ${toolNames}`
    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My AI Stack - FlowStack",
          text,
          url,
        })
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`)
      setShareMsg("Link copied!")
      setTimeout(() => setShareMsg(""), 2000)
    }
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="mb-1 font-serif text-2xl font-bold text-foreground">
            My AI Stack
          </h1>
          <p className="text-sm text-muted-foreground">
            {tools.length > 0
              ? `${tools.length} tool${tools.length !== 1 ? "s" : ""} in your curated stack.`
              : "Save tools from the directory to build your stack."}
          </p>
        </div>
        {tools.length > 0 && (
          <Button
            variant="outline"
            onClick={handleShareStack}
            className="gap-2 rounded-xl h-10"
          >
            <Share2 className="h-4 w-4" />
            {shareMsg || "Share My Stack"}
          </Button>
        )}
      </div>

      {tools.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary">
            <Bookmark className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="mb-2 text-lg font-medium text-foreground">
            Your stack starts here
          </p>
          <p className="mx-auto mb-6 max-w-sm text-sm text-muted-foreground">
            Save tools from the directory to build your personalized AI toolkit.
            We{"'"}ll keep track of everything in one place.
          </p>
          <Button className="rounded-xl h-10 px-6" asChild>
            <Link href="/dashboard">Explore Tools</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => (
            <GlowCard
              key={tool.bookmarkId}
              className="group flex flex-col p-6 hover:border-primary/30 hover:shadow-md shadow-sm"
            >
              <div className="mb-4 flex items-start gap-3">
                <ToolLogo name={tool.name} logoUrl={tool.logo_url || ""} size={44} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/dashboard/tools/${tool.slug}`}
                      className="truncate text-base font-semibold text-foreground transition-colors hover:text-primary"
                    >
                      {tool.name}
                    </Link>
                    {tool.is_verified && (
                      <BadgeCheck className="h-4 w-4 shrink-0 text-accent" />
                    )}
                    {tool.is_trending && (
                      <TrendingUp className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                    )}
                  </div>
                  <p className="text-[12px] text-muted-foreground">
                    {tool.category_name}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <PricingBadge model={tool.pricing_model} />
                  <button
                    onClick={() => removeBookmark(tool.bookmarkId, tool.id)}
                    className="rounded-md p-1 transition-colors hover:bg-destructive/10"
                    aria-label="Remove from stack"
                  >
                    <BookmarkX className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              </div>

              <p className="mb-1.5 text-[14px] font-medium text-foreground">
                {tool.tagline}
              </p>
              <p className="mb-4 flex-1 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
                {tool.description}
              </p>

              <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-auto">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-0.5">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-[13px] font-medium text-foreground">
                      {Number(tool.average_rating).toFixed(1)}
                    </span>
                  </span>
                  <span className="text-[12px] text-muted-foreground">
                    {tool.review_count} reviews
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {tool.website_url && (
                    <a
                      href={tool.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Visit <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  <Link
                    href={`/dashboard/tools/${tool.slug}`}
                    className="text-[13px] font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    View <ArrowRight className="inline h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </GlowCard>
          ))}
        </div>
      )}

      {/* Recommendations section */}
      {recommendations.length > 0 && (
        <div className="mt-12 border-t border-border/50 pt-10">
          <div className="mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <div>
              <h2 className="font-serif text-xl font-bold text-foreground">
                Recommended for You
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Based on your role and tasks, you might also like these tools.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {recommendations.map((tool) => (
              <Card
                key={tool.id}
                className="border-border border-dashed bg-card/50 transition-all hover:border-primary/30 hover:bg-card"
              >
                <CardContent className="p-4 flex flex-col h-full">
                  <div className="mb-3 flex items-start gap-3">
                    <ToolLogo name={tool.name} logoUrl={tool.logo_url || ""} size={32} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/dashboard/tools/${tool.slug}`}
                          className="block truncate text-sm font-semibold text-foreground transition-colors hover:text-primary"
                        >
                          {tool.name}
                        </Link>
                        {tool.is_verified && (
                          <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-accent" />
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-[11px] text-muted-foreground">
                          {Number(tool.average_rating).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="line-clamp-2 text-[12px] leading-relaxed text-muted-foreground flex-1">
                    {tool.tagline}
                  </p>
                  <Link
                    href={`/dashboard/tools/${tool.slug}`}
                    className="mt-4 inline-flex items-center gap-1 text-[12px] font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add to stack
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}