"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Star, ExternalLink, BookmarkX, CheckCircle2, TrendingUp, Bookmark
} from "lucide-react"
import Link from "next/link"

const pricingLabels: Record<string, { label: string; color: string }> = {
  free: { label: "Free", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  freemium: { label: "Freemium", color: "bg-blue-50 text-blue-700 border-blue-200" },
  paid: { label: "Paid", color: "bg-amber-50 text-amber-700 border-amber-200" },
  enterprise: { label: "Enterprise", color: "bg-slate-100 text-slate-700 border-slate-200" },
  "open-source": { label: "Open Source", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
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
}

export function BookmarksList({ tools: initialTools }: { tools: BookmarkedTool[] }) {
  const supabase = createClient()
  const [tools, setTools] = useState(initialTools)

  const removeBookmark = async (bookmarkId: string, toolId: string) => {
    setTools((prev) => prev.filter((t) => t.bookmarkId !== bookmarkId))
    await supabase.from("bookmarks").delete().eq("tool_id", toolId)
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-foreground mb-1">Saved Tools</h1>
        <p className="text-muted-foreground">Your bookmarked AI tools for quick access.</p>
      </div>

      {tools.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
            <Bookmark className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium text-foreground mb-2">No saved tools yet</p>
          <p className="text-sm text-muted-foreground mb-4">
            Browse the directory and bookmark tools you want to come back to.
          </p>
          <Button asChild variant="outline">
            <Link href="/dashboard">Explore Tools</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Card key={tool.bookmarkId} className="bg-card border-border hover:border-primary/30 hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-lg font-serif font-bold text-primary shrink-0">
                      {tool.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Link href={`/dashboard/tools/${tool.slug}`} className="font-semibold text-foreground hover:text-primary transition-colors truncate">
                          {tool.name}
                        </Link>
                        {tool.is_verified && <CheckCircle2 className="h-4 w-4 text-primary fill-primary/10 shrink-0" />}
                        {tool.is_trending && <TrendingUp className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{tool.tagline}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeBookmark(tool.bookmarkId, tool.id)}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors shrink-0"
                    aria-label="Remove bookmark"
                  >
                    <BookmarkX className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{tool.description}</p>

                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <Badge variant="secondary" className="text-xs font-normal">{tool.category_name}</Badge>
                  <Badge variant="outline" className={`text-xs font-normal ${pricingLabels[tool.pricing_model]?.color || ""}`}>
                    {pricingLabels[tool.pricing_model]?.label || tool.pricing_model}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium">{Number(tool.average_rating).toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">({tool.review_count})</span>
                  </div>
                  <Link href={`/dashboard/tools/${tool.slug}`} className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                    Details
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
