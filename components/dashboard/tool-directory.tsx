"use client"

import { useState, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Search, SlidersHorizontal, Star, ExternalLink, Bookmark, BookmarkCheck,
  CheckCircle2, TrendingUp, HelpCircle, X
} from "lucide-react"
import Link from "next/link"

interface Tool {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  website_url: string
  logo_url: string | null
  pricing_model: string
  is_verified: boolean
  is_trending: boolean
  average_rating: number
  review_count: number
  why_professionals_use: string | null
  category_name: string
  category_slug: string
  category_id: string
}

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
}

type SortOption = "rating" | "reviews" | "trending" | "name"

const pricingLabels: Record<string, { label: string; color: string }> = {
  free: { label: "Free", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  freemium: { label: "Freemium", color: "bg-blue-50 text-blue-700 border-blue-200" },
  paid: { label: "Paid", color: "bg-amber-50 text-amber-700 border-amber-200" },
  enterprise: { label: "Enterprise", color: "bg-slate-100 text-slate-700 border-slate-200" },
  "open-source": { label: "Open Source", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
}

interface ToolDirectoryProps {
  tools: Tool[]
  categories: Category[]
  bookmarkedToolIds: string[]
}

export function ToolDirectory({ tools, categories, bookmarkedToolIds }: ToolDirectoryProps) {
  const supabase = createClient()
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set(bookmarkedToolIds))
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedPricing, setSelectedPricing] = useState<string>("all")
  const [sortBy, setSortBy] = useState<SortOption>("rating")
  const [showFilters, setShowFilters] = useState(false)

  const toggleBookmark = async (toolId: string) => {
    const isBookmarked = bookmarkedIds.has(toolId)
    if (isBookmarked) {
      setBookmarkedIds((prev) => { const n = new Set(prev); n.delete(toolId); return n })
      await supabase.from("bookmarks").delete().eq("tool_id", toolId)
    } else {
      setBookmarkedIds((prev) => new Set(prev).add(toolId))
      const { data: { user } } = await supabase.auth.getUser()
      if (user) await supabase.from("bookmarks").insert({ user_id: user.id, tool_id: toolId })
    }
  }

  const filteredTools = useMemo(() => {
    let filtered = [...tools]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.tagline?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((t) => t.category_slug === selectedCategory)
    }

    if (selectedPricing !== "all") {
      filtered = filtered.filter((t) => t.pricing_model === selectedPricing)
    }

    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => b.average_rating - a.average_rating)
        break
      case "reviews":
        filtered.sort((a, b) => b.review_count - a.review_count)
        break
      case "trending":
        filtered.sort((a, b) => (b.is_trending ? 1 : 0) - (a.is_trending ? 1 : 0))
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return filtered
  }, [tools, searchQuery, selectedCategory, selectedPricing, sortBy])

  const activeFilterCount = [selectedCategory !== "all", selectedPricing !== "all"].filter(Boolean).length

  const clearFilters = () => {
    setSelectedCategory("all")
    setSelectedPricing("all")
    setSearchQuery("")
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-foreground mb-1">Explore AI Tools</h1>
        <p className="text-muted-foreground">Discover and compare the best AI tools for your workflow.</p>
      </div>

      {/* Search and filter bar */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tools by name, description, or use case..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-card border-border"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="h-11 gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <Badge className="bg-primary text-primary-foreground h-5 w-5 p-0 flex items-center justify-center text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-11 w-11 shrink-0">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p className="font-medium mb-1">Finding the right tool</p>
                <p className="text-xs text-muted-foreground">
                  Use filters to narrow by category or pricing. Tools marked with a blue checkmark
                  are FlowStack Verified -- community-tested and professional-approved.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Expandable filter panel */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-card rounded-xl border border-border">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-9 rounded-lg border border-border bg-background px-3 text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Pricing</label>
              <select
                value={selectedPricing}
                onChange={(e) => setSelectedPricing(e.target.value)}
                className="w-full h-9 rounded-lg border border-border bg-background px-3 text-sm"
              >
                <option value="all">All Pricing</option>
                <option value="free">Free</option>
                <option value="freemium">Freemium</option>
                <option value="paid">Paid</option>
                <option value="enterprise">Enterprise</option>
                <option value="open-source">Open Source</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full h-9 rounded-lg border border-border bg-background px-3 text-sm"
              >
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviewed</option>
                <option value="trending">Trending</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
            {activeFilterCount > 0 && (
              <div className="sm:col-span-3">
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-muted-foreground">
                  <X className="h-3 w-3 mr-1" /> Clear all filters
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          {filteredTools.length} {filteredTools.length === 1 ? "tool" : "tools"} found
        </p>
      </div>

      {/* Tool grid */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg font-medium text-foreground mb-2">No tools match your filters</p>
          <p className="text-sm text-muted-foreground mb-4">
            Try broadening your search or adjusting the filters above.
          </p>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTools.map((tool) => (
            <Card
              key={tool.id}
              className="group bg-card border-border hover:border-primary/30 hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                      {tool.logo_url ? (
                        <img src={tool.logo_url} alt={tool.name} className="h-6 w-6 object-contain" loading="lazy" />
                      ) : (
                        <span className="text-lg font-serif font-bold text-primary">{tool.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Link href={`/dashboard/tools/${tool.slug}`} className="font-semibold text-foreground hover:text-primary transition-colors truncate">
                          {tool.name}
                        </Link>
                        {tool.is_verified && (
                          <CheckCircle2 className="h-4 w-4 text-primary fill-primary/10 shrink-0" />
                        )}
                        {tool.is_trending && (
                          <TrendingUp className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{tool.tagline}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleBookmark(tool.id)}
                    className="p-1.5 rounded-lg hover:bg-secondary transition-colors shrink-0"
                    aria-label={bookmarkedIds.has(tool.id) ? "Remove bookmark" : "Add bookmark"}
                  >
                    {bookmarkedIds.has(tool.id) ? (
                      <BookmarkCheck className="h-4 w-4 text-primary" />
                    ) : (
                      <Bookmark className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {tool.description}
                </p>

                <div className="flex items-center gap-2 flex-wrap mb-3">
                  {tool.category_name && (
                    <Badge variant="secondary" className="text-xs font-normal">
                      {tool.category_name}
                    </Badge>
                  )}
                  <Badge variant="outline" className={`text-xs font-normal ${pricingLabels[tool.pricing_model]?.color || ""}`}>
                    {pricingLabels[tool.pricing_model]?.label || tool.pricing_model}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium text-foreground">{Number(tool.average_rating).toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">({tool.review_count})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {tool.website_url && (
                      <a
                        href={tool.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                      >
                        Visit <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    <Link
                      href={`/dashboard/tools/${tool.slug}`}
                      className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
