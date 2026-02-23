"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Star,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  TrendingUp,
  ArrowLeft,
  HelpCircle,
  Globe,
  DollarSign,
  Users,
  Zap,
  Workflow,
  Share2,
  MessageSquarePlus,
} from "lucide-react"
import Link from "next/link"
import { ReviewForm } from "./review-form"

interface ToolDetailProps {
  tool: any
  reviews: any[]
  relatedTools: any[]
}

const pricingLabels: Record<
  string,
  { label: string; color: string; description: string }
> = {
  free: {
    label: "Free",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    description: "No cost to use. Fully free forever.",
  },
  freemium: {
    label: "Freemium",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    description: "Free tier available with paid upgrades for more features.",
  },
  paid: {
    label: "Paid",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    description: "Requires a paid subscription to access core features.",
  },
  enterprise: {
    label: "Enterprise",
    color: "bg-slate-100 text-slate-700 border-slate-200",
    description: "Custom pricing for teams and organizations.",
  },
  "open-source": {
    label: "Open Source",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    description: "Source code is publicly available. Self-host or use hosted.",
  },
}

export function ToolDetail({
  tool,
  reviews: initialReviews,
  relatedTools,
}: ToolDetailProps) {
  const supabase = createClient()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [reviews, setReviews] = useState(initialReviews)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [shareMsg, setShareMsg] = useState("")

  useEffect(() => {
    async function checkBookmark() {
      const { data } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("tool_id", tool.id)
        .maybeSingle()
      if (data) setIsBookmarked(true)
    }
    checkBookmark()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool.id])

  const toggleBookmark = async () => {
    if (isBookmarked) {
      setIsBookmarked(false)
      await supabase.from("bookmarks").delete().eq("tool_id", tool.id)
    } else {
      setIsBookmarked(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user)
        await supabase
          .from("bookmarks")
          .insert({ user_id: user.id, tool_id: tool.id })
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    const text = `Check out ${tool.name} on FlowStack: ${tool.tagline}`
    if (navigator.share) {
      try {
        await navigator.share({ title: tool.name, text, url })
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url)
      setShareMsg("Link copied!")
      setTimeout(() => setShareMsg(""), 2000)
    }
  }

  const handleReviewSubmit = async (review: {
    rating: number
    title: string
    content: string
  }) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        user_id: user.id,
        tool_id: tool.id,
        ...review,
      })
      .select(
        "*, profiles:user_id(display_name, role_id, roles:role_id(name, slug))",
      )
      .single()

    if (!error && data) {
      setReviews([data, ...reviews])
      setShowReviewForm(false)
    }
  }

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r: any) => r.rating === star).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter((r: any) => r.rating === star).length /
            reviews.length) *
          100
        : 0,
  }))

  const pricingInfo = pricingLabels[tool.pricing_model]

  return (
    <div className="mx-auto max-w-5xl p-6 lg:p-8">
      {/* Back nav */}
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to directory
      </Link>

      {/* Tool header */}
      <div className="mb-8 flex flex-col items-start gap-6 md:flex-row">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-secondary">
          {tool.logo_url ? (
            <img
              src={tool.logo_url}
              alt={tool.name}
              className="h-10 w-10 object-contain"
              loading="lazy"
            />
          ) : (
            <span className="font-serif text-2xl font-bold text-primary">
              {tool.name.charAt(0)}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-foreground">
              {tool.name}
            </h1>
            {tool.is_verified && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge className="gap-1 border-primary/20 bg-primary/10 text-primary">
                      <CheckCircle2 className="h-3 w-3" /> Verified
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      Community-tested and professional-approved by FlowStack
                      reviewers.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {tool.is_trending && (
              <Badge className="gap-1 border-amber-200 bg-amber-50 text-amber-700">
                <TrendingUp className="h-3 w-3" /> Trending
              </Badge>
            )}
          </div>
          <p className="mb-3 text-muted-foreground">{tool.tagline}</p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold">
                {Number(tool.average_rating).toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">
                ({tool.review_count} reviews)
              </span>
            </div>
            <Badge
              variant="outline"
              className={pricingInfo?.color || ""}
            >
              <DollarSign className="mr-1 h-3 w-3" />
              {pricingInfo?.label || tool.pricing_model}
            </Badge>
            {tool.categories && (
              <Badge variant="secondary">{tool.categories.name}</Badge>
            )}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button variant="outline" onClick={toggleBookmark} className="gap-2">
            {isBookmarked ? (
              <BookmarkCheck className="h-4 w-4 text-primary" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
            {isBookmarked ? "Saved" : "Save"}
          </Button>
          <Button variant="outline" onClick={handleShare} className="gap-2">
            <Share2 className="h-4 w-4" />
            {shareMsg || "Share"}
          </Button>
          {tool.website_url && (
            <Button
              asChild
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <a
                href={tool.website_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe className="h-4 w-4" /> Visit Website
              </a>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Description */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="font-serif text-lg">
                About {tool.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-muted-foreground">
                {tool.description}
              </p>
            </CardContent>
          </Card>

          {/* Workflow Use Case section */}
          {(tool.why_professionals_use || tool.tool_tasks?.length > 0) && (
            <Card className="border-primary/20 bg-primary/[0.02]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif text-lg">
                  <Workflow className="h-5 w-5 text-primary" /> Workflow Use
                  Case
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {tool.why_professionals_use && (
                  <div className="rounded-lg border border-primary/10 bg-background p-4">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">
                      Why professionals use this
                    </p>
                    <p className="leading-relaxed text-muted-foreground italic">
                      {`"${tool.why_professionals_use}"`}
                    </p>
                  </div>
                )}
                {tool.tool_tasks?.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-medium text-foreground">
                      Best for these workflow tasks:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {tool.tool_tasks.map((tt: any, i: number) => (
                        <div
                          key={i}
                          className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
                        >
                          <Zap className="h-3 w-3 text-primary" />
                          {tt.tasks?.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Trending reason */}
          {tool.is_trending && tool.trending_reason && (
            <Card className="border-amber-200 bg-amber-50/50">
              <CardContent className="flex items-start gap-3 p-4">
                <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <div>
                  <p className="mb-0.5 font-medium text-amber-900">
                    {"Why it's trending"}
                  </p>
                  <p className="text-sm text-amber-800">
                    {tool.trending_reason}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reviews section */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-serif text-lg">
                  Community Reviews
                </CardTitle>
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-xs">
                        <p className="text-xs">
                          Reviews are written by real professionals. Each
                          reviewer{"'"}s role is displayed so you can find
                          feedback from people who work like you do.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button
                    size="sm"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="gap-1.5 bg-primary text-primary-foreground"
                  >
                    <MessageSquarePlus className="h-3.5 w-3.5" />
                    Write a Review
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Rating distribution */}
              {reviews.length > 0 && (
                <div className="mb-6 border-b border-border pb-6">
                  <div className="flex flex-col gap-1.5">
                    {ratingDistribution.map(({ star, count, percentage }) => (
                      <div
                        key={star}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="w-8 text-right text-muted-foreground">
                          {star}
                        </span>
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-amber-400 transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-muted-foreground">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Review form */}
              {showReviewForm && (
                <div className="mb-6 border-b border-border pb-6">
                  <ReviewForm
                    onSubmit={handleReviewSubmit}
                    onCancel={() => setShowReviewForm(false)}
                  />
                </div>
              )}

              {/* Review list */}
              {reviews.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="mb-2 text-muted-foreground">No reviews yet.</p>
                  <p className="text-sm text-muted-foreground">
                    Be the first to share your experience with {tool.name}.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {reviews.map((review: any) => (
                    <div
                      key={review.id}
                      className="border-b border-border pb-4 last:border-0 last:pb-0"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-medium">
                            {review.profiles?.display_name
                              ?.charAt(0)
                              ?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <span className="text-sm font-medium">
                              {review.profiles?.display_name || "Anonymous"}
                            </span>
                            {review.profiles?.roles?.name && (
                              <Badge
                                variant="secondary"
                                className="ml-2 px-1.5 py-0 text-[10px]"
                              >
                                {review.profiles.roles.name}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.title && (
                        <p className="mb-1 text-sm font-medium">
                          {review.title}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {review.content}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Pricing card */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <DollarSign className="h-4 w-4 text-primary" /> Pricing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-3 flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`text-sm ${pricingInfo?.color || ""}`}
                >
                  {pricingInfo?.label || tool.pricing_model}
                </Badge>
              </div>
              <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                {pricingInfo?.description || "Check the website for pricing details."}
              </p>
              {tool.website_url && (
                <a
                  href={tool.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
                >
                  View full pricing <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </CardContent>
          </Card>

          {/* Roles this tool serves */}
          {tool.tool_roles?.length > 0 && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Users className="h-4 w-4 text-primary" /> Built for
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {tool.tool_roles.map((tr: any, i: number) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {tr.roles?.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Related tools / Alternatives */}
          {relatedTools.length > 0 && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Alternatives & Similar Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {relatedTools.map((rt: any) => (
                  <Link
                    key={rt.id}
                    href={`/dashboard/tools/${rt.slug}`}
                    className="group flex items-center gap-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary">
                      {rt.logo_url ? (
                        <img
                          src={rt.logo_url}
                          alt={rt.name}
                          className="h-5 w-5 object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <span className="font-serif text-sm font-bold text-primary">
                          {rt.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="truncate text-sm font-medium transition-colors group-hover:text-primary">
                          {rt.name}
                        </span>
                        {rt.is_verified && (
                          <CheckCircle2 className="h-3 w-3 shrink-0 text-primary" />
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs text-muted-foreground">
                          {Number(rt.average_rating).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Quick stats */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <p className="font-serif text-xl font-bold text-foreground">
                    {Number(tool.average_rating).toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground">Avg Rating</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <p className="font-serif text-xl font-bold text-foreground">
                    {tool.review_count}
                  </p>
                  <p className="text-xs text-muted-foreground">Reviews</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <p className="font-serif text-xl font-bold text-foreground">
                    {tool.bookmark_count || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Saves</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <p className="font-serif text-xl font-bold text-foreground">
                    {tool.view_count || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Views</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
