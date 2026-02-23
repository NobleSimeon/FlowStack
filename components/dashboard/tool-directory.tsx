"use client"

import { useState, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Search,
  Star,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  TrendingUp,
  X,
  SlidersHorizontal,
  Code,
  Palette,
  PenTool,
  Target,
  Megaphone,
  BarChart3,
  Sparkles,
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

const categoryIconMap: Record<string, React.ElementType> = {
  "code-development": Code,
  "design-creative": Palette,
  "writing-content": PenTool,
  "productivity-pm": Target,
  "marketing-seo": Megaphone,
  "data-analytics": BarChart3,
  "research-knowledge": Search,
  "general-ai": Sparkles,
}

const pricingOptions = [
  { value: "all", label: "All Pricing" },
  { value: "free", label: "Free" },
  { value: "freemium", label: "Freemium" },
  { value: "paid", label: "Paid" },
  { value: "enterprise", label: "Enterprise" },
  { value: "open-source", label: "Open Source" },
]

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "rating", label: "Highest Rated" },
  { value: "reviews", label: "Most Reviewed" },
  { value: "trending", label: "Trending" },
  { value: "name", label: "Name A-Z" },
]

interface ToolDirectoryProps {
  tools: Tool[]
  categories: Category[]
  bookmarkedToolIds: string[]
}

export function ToolDirectory({
  tools,
  categories,
  bookmarkedToolIds,
}: ToolDirectoryProps) {
  const supabase = createClient()
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(
    new Set(bookmarkedToolIds),
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedPricing, setSelectedPricing] = useState<string>("all")
  const [sortBy, setSortBy] = useState<SortOption>("rating")
  const [mobileSidebar, setMobileSidebar] = useState(false)

  const toggleBookmark = async (toolId: string) => {
    const isBookmarked = bookmarkedIds.has(toolId)
    if (isBookmarked) {
      setBookmarkedIds((prev) => {
        const n = new Set(prev)
        n.delete(toolId)
        return n
      })
      await supabase.from("bookmarks").delete().eq("tool_id", toolId)
    } else {
      setBookmarkedIds((prev) => new Set(prev).add(toolId))
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user)
        await supabase
          .from("bookmarks")
          .insert({ user_id: user.id, tool_id: toolId })
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
          t.description?.toLowerCase().includes(q),
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
        filtered.sort(
          (a, b) => (b.is_trending ? 1 : 0) - (a.is_trending ? 1 : 0),
        )
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return filtered
  }, [tools, searchQuery, selectedCategory, selectedPricing, sortBy])

  const activeFilterCount = [
    selectedCategory !== "all",
    selectedPricing !== "all",
  ].filter(Boolean).length

  const clearFilters = () => {
    setSelectedCategory("all")
    setSelectedPricing("all")
    setSearchQuery("")
  }

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: tools.length }
    for (const tool of tools) {
      counts[tool.category_slug] = (counts[tool.category_slug] || 0) + 1
    }
    return counts
  }, [tools])

  const SidebarContent = () => (
    <div className="flex flex-col gap-6">
      {/* Categories */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Categories
        </h3>
        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
              selectedCategory === "all"
                ? "bg-primary/10 font-medium text-primary"
                : "text-foreground hover:bg-muted"
            }`}
          >
            <span>All Tools</span>
            <span className="text-xs text-muted-foreground">
              {categoryCounts.all}
            </span>
          </button>
          {categories.map((cat) => {
            const Icon = categoryIconMap[cat.slug] || Sparkles
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                  selectedCategory === cat.slug
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5" />
                  {cat.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {categoryCounts[cat.slug] || 0}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Pricing */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Pricing
        </h3>
        <div className="flex flex-col gap-0.5">
          {pricingOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelectedPricing(opt.value)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                selectedPricing === opt.value
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <div
                className={`h-3.5 w-3.5 rounded-full border-2 transition-all ${
                  selectedPricing === opt.value
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/40"
                }`}
              >
                {selectedPricing === opt.value && (
                  <div className="mt-[3px] ml-[3px] h-1 w-1 rounded-full bg-primary-foreground" />
                )}
              </div>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Sort By
        </h3>
        <div className="flex flex-col gap-0.5">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSortBy(opt.value)}
              className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                sortBy === opt.value
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="justify-start gap-1.5 text-xs text-muted-foreground"
        >
          <X className="h-3 w-3" /> Clear all filters
        </Button>
      )}
    </div>
  )

  return (
    <div className="flex h-full">
      {/* Desktop sidebar filters */}
      <aside className="hidden w-60 shrink-0 border-r border-border bg-card p-5 xl:block">
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-6 lg:p-8">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Explore AI Tools
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Discover and compare the best AI tools for your workflow.
          </p>
        </div>

        {/* Search bar */}
        <div className="mb-6 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tools by name, description, or use case..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 border-border bg-card pl-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
          {/* Mobile filter toggle */}
          <Button
            variant="outline"
            onClick={() => setMobileSidebar(!mobileSidebar)}
            className="h-11 gap-2 xl:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <Badge className="flex h-5 w-5 items-center justify-center bg-primary p-0 text-xs text-primary-foreground">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Mobile filter panel */}
        {mobileSidebar && (
          <div className="mb-6 rounded-xl border border-border bg-card p-5 xl:hidden">
            <SidebarContent />
          </div>
        )}

        {/* Results count + active filters */}
        <div className="mb-4 flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            {filteredTools.length}{" "}
            {filteredTools.length === 1 ? "tool" : "tools"} found
          </p>
          {selectedCategory !== "all" && (
            <Badge
              variant="secondary"
              className="gap-1 text-xs"
            >
              {categories.find((c) => c.slug === selectedCategory)?.name}
              <button onClick={() => setSelectedCategory("all")}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedPricing !== "all" && (
            <Badge
              variant="secondary"
              className="gap-1 text-xs"
            >
              {pricingOptions.find((p) => p.value === selectedPricing)?.label}
              <button onClick={() => setSelectedPricing("all")}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>

        {/* Tool grid */}
        {filteredTools.length === 0 ? (
          <div className="py-16 text-center">
            <p className="mb-2 text-lg font-medium text-foreground">
              No tools match your filters
            </p>
            <p className="mb-4 text-sm text-muted-foreground">
              Try broadening your search or adjusting the filters.
            </p>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {filteredTools.map((tool) => (
              <Card
                key={tool.id}
                className="group overflow-hidden border-border bg-card transition-all duration-200 hover:border-primary/30 hover:shadow-md"
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
                      onClick={() => toggleBookmark(tool.id)}
                      className="shrink-0 rounded-lg p-1.5 transition-colors hover:bg-secondary"
                      aria-label={
                        bookmarkedIds.has(tool.id)
                          ? "Remove bookmark"
                          : "Add bookmark"
                      }
                    >
                      {bookmarkedIds.has(tool.id) ? (
                        <BookmarkCheck className="h-4 w-4 text-primary" />
                      ) : (
                        <Bookmark className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>

                  <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {tool.description}
                  </p>

                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    {tool.category_name && (
                      <Badge variant="secondary" className="text-xs font-normal">
                        {tool.category_name}
                      </Badge>
                    )}
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
                      <span className="text-sm font-medium text-foreground">
                        {Number(tool.average_rating).toFixed(1)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({tool.review_count})
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {tool.website_url && (
                        <a
                          href={tool.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
                        >
                          Visit <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      <Link
                        href={`/dashboard/tools/${tool.slug}`}
                        className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
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
    </div>
  )
}
