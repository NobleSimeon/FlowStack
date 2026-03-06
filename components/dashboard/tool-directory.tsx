"use client"

import { useState, useMemo, type WheelEvent } from "react"
import { useRouter } from "next/navigation"
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
} from "@/components/ui/dropdown-menu";
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
} from "lucide-react";
import Link from "next/link";

interface Tool {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  website_url: string;
  logo_url: string | null;
  pricing_model: string;
  is_verified: boolean;
  is_trending: boolean;
  average_rating: number;
  review_count: number;
  why_professionals_use: string | null;
  category_name: string;
  category_slug: string;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

type SortOption = "rating" | "reviews" | "trending" | "name";

const categoryIconMap: Record<string, React.ElementType> = {
  "code-development": Code,
  "design-creative": Palette,
  "writing-content": PenTool,
  "productivity-pm": Target,
  "marketing-seo": Megaphone,
  "data-analytics": BarChart3,
  "research-knowledge": Search,
  "general-ai": Sparkles,
};

const pricingOptions = [
  { value: "all", label: "All Pricing" },
  { value: "free", label: "Free" },
  { value: "freemium", label: "Freemium" },
  { value: "paid", label: "Paid" },
  { value: "enterprise", label: "Enterprise" },
  { value: "open-source", label: "Open Source" },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "rating", label: "Highest Rated" },
  { value: "reviews", label: "Most Reviewed" },
  { value: "trending", label: "Trending" },
  { value: "name", label: "Name A-Z" },
];

function PricingBadge({ model }: { model: string }) {
  const labels: Record<string, string> = {
    free: "Free",
    freemium: "Freemium",
    paid: "Paid",
    enterprise: "Enterprise",
    "open-source": "Open Source",
  };
  return (
    <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground capitalize">
      {labels[model] || model}
    </span>
  );
}

interface ToolDirectoryProps {
  tools: Tool[];
  categories: Category[];
  bookmarkedToolIds: string[];
}

export function ToolDirectory({
  tools,
  categories,
  bookmarkedToolIds,
}: ToolDirectoryProps) {
  const supabase = createClient();
  const router = useRouter();
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(
    new Set(bookmarkedToolIds),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPricing, setSelectedPricing] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [showFilters, setShowFilters] = useState(false);

  const toggleBookmark = async (toolId: string) => {
    const isBookmarked = bookmarkedIds.has(toolId);
    if (isBookmarked) {
      setBookmarkedIds((prev) => {
        const n = new Set(prev);
        n.delete(toolId);
        return n;
      });
      await supabase.from("bookmarks").delete().eq("tool_id", toolId);
    } else {
      setBookmarkedIds((prev) => new Set(prev).add(toolId));
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user)
        await supabase
          .from("bookmarks")
          .insert({ user_id: user.id, tool_id: toolId });
    }
  };

  const filteredTools = useMemo(() => {
    let filtered = [...tools];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.tagline?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q),
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((t) => t.category_slug === selectedCategory);
    }

    if (selectedPricing !== "all") {
      filtered = filtered.filter((t) => t.pricing_model === selectedPricing);
    }

    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => b.average_rating - a.average_rating);
        break;
      case "reviews":
        filtered.sort((a, b) => b.review_count - a.review_count);
        break;
      case "trending":
        filtered.sort(
          (a, b) => (b.is_trending ? 1 : 0) - (a.is_trending ? 1 : 0),
        );
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [tools, searchQuery, selectedCategory, selectedPricing, sortBy]);

  // activeFilterCount only measures hidden filters (pricing) for the badge
  const activeFilterCount = selectedPricing !== "all" ? 1 : 0;

  const clearFilters = () => {
    setSelectedPricing("all");
    setSearchQuery("");
  };

  const clearAll = () => {
    setSelectedCategory("all");
    setSelectedPricing("all");
    setSearchQuery("");
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: tools.length };
    for (const tool of tools) {
      counts[tool.category_slug] = (counts[tool.category_slug] || 0) + 1;
    }
    return counts;
  }, [tools]);

  const handleHorizontalWheel = (event: WheelEvent<HTMLDivElement>) => {
    const container = event.currentTarget;
    const canScrollHorizontally = container.scrollWidth > container.clientWidth;
    if (!canScrollHorizontally) return;

    const isMostlyVerticalWheel = Math.abs(event.deltaY) > Math.abs(event.deltaX);
    if (!isMostlyVerticalWheel) return;

    event.preventDefault();
    container.scrollLeft += event.deltaY;
  };

  const handleCardClick = (
    event: React.MouseEvent<HTMLElement>,
    slug: string,
  ) => {
    const target = event.target as HTMLElement;
    if (target.closest("a,button")) return;
    router.push(`/dashboard/tools/${slug}`);
  };

  const handleCardKeyDown = (
    event: React.KeyboardEvent<HTMLElement>,
    slug: string,
  ) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    router.push(`/dashboard/tools/${slug}`);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Explore AI Tools
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse, compare, and save the best AI tools for your workflow.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tools by name, description, or use case..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 rounded-xl border-border bg-card pl-10"
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

        <div className="flex items-center gap-3">
          <div
            className="flex flex-1 items-center gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            onWheel={handleHorizontalWheel}
          >
            <button
              onClick={() => setSelectedCategory("all")}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-foreground hover:border-primary/40 hover:bg-muted/50"
              }`}
            >
              All Tools
              <span
                className={`ml-1 flex h-5 items-center justify-center rounded-full px-2 text-[11px] ${
                  selectedCategory === "all"
                    ? "bg-primary-foreground/20"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {categoryCounts.all}
              </span>
            </button>
            {categories.map((cat) => {
              const Icon = categoryIconMap[cat.slug] || Sparkles;
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-foreground hover:border-primary/40 hover:bg-muted/50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {cat.name}
                  <span
                    className={`ml-1 flex h-5 items-center justify-center rounded-full px-2 text-[11px] ${
                      isSelected
                        ? "bg-primary-foreground/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {categoryCounts[cat.slug] || 0}
                  </span>
                </button>
              );
            })}
          </div>

          <Button
            variant={showFilters ? "secondary" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            className="h-10 shrink-0 gap-2 rounded-full px-4"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <Badge className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary p-0 text-xs text-primary-foreground">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              Pricing:
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex min-w-[140px] items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground transition-all hover:border-primary/30 hover:shadow-sm">
                  <span className="font-medium">
                    {selectedPricing === "all"
                      ? "All Options"
                      : pricingOptions.find((p) => p.value === selectedPricing)
                          ?.label}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40 rounded-xl p-1">
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
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              Sort by:
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex min-w-[150px] items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground transition-all hover:border-primary/30 hover:shadow-sm">
                  <span className="font-medium">
                    {sortOptions.find((s) => s.value === sortBy)?.label}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44 rounded-xl p-1">
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

          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="ml-auto text-muted-foreground hover:text-foreground"
            >
              <X className="mr-2 h-4 w-4" /> Clear Filters
            </Button>
          )}
        </div>
      )}

      <div className="mb-4 flex items-center gap-3">
        <p className="text-sm text-muted-foreground">
          {filteredTools.length} {filteredTools.length === 1 ? "tool" : "tools"}{" "}
          found
        </p>
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
          <Button variant="outline" size="sm" onClick={clearAll}>
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {filteredTools.map((tool) => (
            <GlowCard
              key={tool.id}
              className="group flex cursor-pointer flex-col p-6 shadow-sm hover:border-primary/30 hover:shadow-md"
              role="link"
              tabIndex={0}
              onClick={(event) => handleCardClick(event, tool.slug)}
              onKeyDown={(event) => handleCardKeyDown(event, tool.slug)}
            >
              <div className="mb-4 flex items-start gap-3">
                <ToolLogo
                  name={tool.name}
                  logoUrl={tool.logo_url || ""}
                  size={44}
                />
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
                <div className="flex shrink-0 items-center gap-2">
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
                    <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Why professionals use this
                    </span>
                  </div>
                  <p className="line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">
                    {tool.why_professionals_use}
                  </p>
                </div>
              )}

              <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-4">
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
  );
}
