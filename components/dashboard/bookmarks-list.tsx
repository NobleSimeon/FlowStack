"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Star,
  BookmarkX,
  CheckCircle2,
  TrendingUp,
  Bookmark,
  Share2,
  Sparkles,
  Plus,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

const pricingLabels: Record<string, { label: string; color: string }> = {
  free: {
    label: "Free",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  freemium: {
    label: "Freemium",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  paid: {
    label: "Paid",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  enterprise: {
    label: "Enterprise",
    color: "bg-slate-100 text-slate-700 border-slate-200",
  },
  "open-source": {
    label: "Open Source",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
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
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-1 font-serif text-2xl font-bold text-foreground">
            My AI Stack
          </h1>
          <p className="text-muted-foreground">
            {tools.length > 0
              ? `${tools.length} tool${tools.length !== 1 ? "s" : ""} in your curated stack.`
              : "Save tools from the directory to build your stack."}
          </p>
        </div>
        {tools.length > 0 && (
          <Button
            variant="outline"
            onClick={handleShareStack}
            className="gap-2"
          >
            <Share2 className="h-4 w-4" />
            {shareMsg || "Share My Stack"}
          </Button>
        )}
      </div>

      {tools.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
            <Bookmark className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="mb-2 text-lg font-medium text-foreground">
            Your stack starts here
          </p>
          <p className="mx-auto mb-6 max-w-sm text-sm text-muted-foreground">
            Save tools from the directory to build your personalized AI toolkit.
            We{"'"}ll keep track of everything in one place.
          </p>
          <Button asChild>
            <Link href="/dashboard">Explore Tools</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => (
            <Card
              key={tool.bookmarkId}
              className="border-border bg-card transition-all hover:border-primary/30 hover:shadow-md"
            >
              <CardContent className="p-5">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary">
                      {tool.logo_url ? (
                        <img
                          src={tool.logo_url}
                          alt={tool.name}
                          className="h-6 w-6 object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <span className="font-serif text-lg font-bold text-primary">
                          {tool.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/dashboard/tools/${tool.slug}`}
                          className="truncate font-semibold text-foreground transition-colors hover:text-primary"
                        >
                          {tool.name}
                        </Link>
                        {tool.is_verified && (
                          <CheckCircle2 className="h-4 w-4 shrink-0 fill-primary/10 text-primary" />
                        )}
                        {tool.is_trending && (
                          <TrendingUp className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                        )}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {tool.tagline}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeBookmark(tool.bookmarkId, tool.id)}
                    className="shrink-0 rounded-lg p-1.5 transition-colors hover:bg-destructive/10"
                    aria-label="Remove from stack"
                  >
                    <BookmarkX className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>

                <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {tool.description}
                </p>

                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-xs font-normal">
                    {tool.category_name}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-xs font-normal ${pricingLabels[tool.pricing_model]?.color || ""}`}
                  >
                    {pricingLabels[tool.pricing_model]?.label ||
                      tool.pricing_model}
                  </Badge>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">
                      {Number(tool.average_rating).toFixed(1)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({tool.review_count})
                    </span>
                  </div>
                  <Link
                    href={`/dashboard/tools/${tool.slug}`}
                    className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    Details
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Recommendations section */}
      {recommendations.length > 0 && (
        <div className="mt-12">
          <div className="mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="font-serif text-xl font-bold text-foreground">
              Recommended for You
            </h2>
          </div>
          <p className="mb-6 -mt-4 text-sm text-muted-foreground">
            Based on your role and tasks, you might also like these tools.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {recommendations.map((tool) => (
              <Card
                key={tool.id}
                className="border-border border-dashed bg-card/50 transition-all hover:border-primary/30 hover:bg-card"
              >
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary">
                      {tool.logo_url ? (
                        <img
                          src={tool.logo_url}
                          alt={tool.name}
                          className="h-5 w-5 object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <span className="font-serif text-sm font-bold text-primary">
                          {tool.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/dashboard/tools/${tool.slug}`}
                        className="block truncate text-sm font-semibold text-foreground transition-colors hover:text-primary"
                      >
                        {tool.name}
                      </Link>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs text-muted-foreground">
                          {Number(tool.average_rating).toFixed(1)}
                        </span>
                      </div>
                    </div>
                    {tool.is_verified && (
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                    )}
                  </div>
                  <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {tool.tagline}
                  </p>
                  <Link
                    href={`/dashboard/tools/${tool.slug}`}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    <Plus className="h-3 w-3" /> Add to stack
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
