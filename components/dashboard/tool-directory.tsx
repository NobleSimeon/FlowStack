"use client"

import { useState, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GlowCard } from "@/components/ui/glow-card"
import { ToolLogo } from "@/components/landing/tool-logo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Star,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  BadgeCheck,
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
  ArrowRight,
  Quote,
  ChevronDown,
  Filter,
  ArrowUpDown,
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

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: tools.length }
    for (const tool of tools) {
      counts[tool.category_slug] = (counts[tool.category_slug] || 0) + 1
    }
    return counts
  }, [tools])

  const SidebarContent = () => {
    return (
      <div className="flex flex-col gap-6">
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

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Filters
          </h3>
          <div className="flex flex-col gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground transition-all hover:border-primary/30 hover:shadow-sm">
                  <div className="flex items-center gap-2">
                    <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium">
                      {selectedPricing === "all" 
                        ? "Pricing: All" 
                        : pricingOptions.find(p => p.value === selectedPricing)?.label}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-50 rounded-xl p-1">
                {pricingOptions.map((opt) => (
                  <DropdownMenuItem
                    key={opt.value}
                    onClick={() => setSelectedPricing(opt.value)}
                    className={`cursor-pointer rounded-lg px-3 py-2 text-sm ${
                      selectedPricing === opt.value
                        ? "bg-primary/10 text-primary focus:bg-primary/10 focus:text-primary"
                        : ""
                    }`}
                  >
                    {opt.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground transition-all hover:border-primary/30 hover:shadow-sm">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium">
                      Sort: {sortOptions.find(s => s.value === sortBy)?.label}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-50 rounded-xl p-1">
                {sortOptions.map((opt) => (
                  <DropdownMenuItem
                    key={opt.value}
                    onClick={() => setSortBy(opt.value)}
                    className={`cursor-pointer rounded-lg px-3 py-2 text-sm ${
                      sortBy === opt.value
                        ? "bg-primary/10 text-primary focus:bg-primary/10 focus:text-primary"
                        : ""
                    }`}
                  >
                    {opt.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
  }

  return (
    <div className="flex h-full">
      <aside className="hidden w-60 shrink-0 border-r border-border bg-card p-5 lg:block overflow-y-auto">
        <SidebarContent />
      </aside>

      <div className="flex-1 overflow-auto p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Explore AI Tools
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse, compare, and save the best AI tools for your workflow.
          </p>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tools by name, description, or use case..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 border-border bg-card pl-10 rounded-xl"
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
          <Button
            variant="outline"
            onClick={() => setMobileSidebar(!mobileSidebar)}
            className="h-11 gap-2 rounded-xl lg:hidden"
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

        {mobileSidebar && (
          <div className="mb-6 rounded-xl border border-border bg-card p-5 lg:hidden">
            <SidebarContent />
          </div>
        )}

        <div className="mb-4 flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            {filteredTools.length}{" "}
            {filteredTools.length === 1 ? "tool" : "tools"} found
          </p>
          {selectedCategory !== "all" && (
            <Badge variant="secondary" className="gap-1 text-xs">
              {categories.find((c) => c.slug === selectedCategory)?.name}
              <button onClick={() => setSelectedCategory("all")}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedPricing !== "all" && (
            <Badge variant="secondary" className="gap-1 text-xs">
              {pricingOptions.find((p) => p.value === selectedPricing)?.label}
              <button onClick={() => setSelectedPricing("all")}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>

        {filteredTools.length === 0 ? (
          <div className="py-16 text-center">
            <p className="mb-2 text-lg font-medium text-foreground">
              No tools match your criteria
            </p>
            <p className="mb-4 text-sm text-muted-foreground">
              Try removing a filter or broadening your search terms.
            </p>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
            {filteredTools.map((tool) => (
              <GlowCard
                key={tool.id}
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
                      onClick={() => toggleBookmark(tool.id)}
                      className="rounded-md p-1 transition-colors hover:bg-secondary"
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
                </div>

                <p className="mb-1.5 text-[14px] font-medium text-foreground">
                  {tool.tagline}
                </p>
                <p className="mb-4 flex-1 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
                  {tool.description}
                </p>

                {tool.why_professionals_use && (
                  <div className="mb-5 rounded-xl bg-secondary/60 px-4 py-3">
                    <div className="mb-1 flex items-center gap-1.5">
                      <Quote className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                        Why professionals use this
                      </span>
                    </div>
                    <p className="line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">
                      {tool.why_professionals_use}
                    </p>
                  </div>
                )}

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
      </div>
    </div>
  )
}