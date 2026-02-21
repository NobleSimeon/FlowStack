"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Star, ExternalLink, Bookmark, BookmarkCheck, CheckCircle2, TrendingUp,
  ArrowLeft, HelpCircle, Globe, DollarSign, Users, Zap
} from "lucide-react"
import Link from "next/link"
import { ReviewForm } from "./review-form"

interface ToolDetailProps {
  tool: any
  reviews: any[]
  relatedTools: any[]
}

const pricingLabels: Record<string, { label: string; color: string }> = {
  free: { label: "Free", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  freemium: { label: "Freemium", color: "bg-blue-50 text-blue-700 border-blue-200" },
  paid: { label: "Paid", color: "bg-amber-50 text-amber-700 border-amber-200" },
  enterprise: { label: "Enterprise", color: "bg-slate-100 text-slate-700 border-slate-200" },
  "open-source": { label: "Open Source", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
}

export function ToolDetail({ tool, reviews: initialReviews, relatedTools }: ToolDetailProps) {
  const supabase = createClient()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [reviews, setReviews] = useState(initialReviews)
  const [showReviewForm, setShowReviewForm] = useState(false)

  useEffect(() => {
    async function checkBookmark() {
      const { data } = await supabase.from("bookmarks").select("id").eq("tool_id", tool.id).maybeSingle()
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
      const { data: { user } } = await supabase.auth.getUser()
      if (user) await supabase.from("bookmarks").insert({ user_id: user.id, tool_id: tool.id })
    }
  }

  const handleReviewSubmit = async (review: { rating: number; title: string; body: string }) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase.from("reviews").insert({
      user_id: user.id,
      tool_id: tool.id,
      ...review,
    }).select("*, profiles:user_id(display_name, role_id, roles:role_id(name, slug))").single()

    if (!error && data) {
      setReviews([data, ...reviews])
      setShowReviewForm(false)
    }
  }

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r: any) => r.rating === star).length,
    percentage: reviews.length > 0 ? (reviews.filter((r: any) => r.rating === star).length / reviews.length) * 100 : 0,
  }))

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back nav */}
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to directory
      </Link>

      {/* Tool header */}
      <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
        <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center text-2xl font-serif font-bold text-primary shrink-0">
          {tool.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-2xl font-serif font-bold text-foreground">{tool.name}</h1>
            {tool.is_verified && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge className="bg-primary/10 text-primary border-primary/20 gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Verified
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Community-tested and professional-approved by FlowStack reviewers.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {tool.is_trending && (
              <Badge className="bg-amber-50 text-amber-700 border-amber-200 gap-1">
                <TrendingUp className="h-3 w-3" /> Trending
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mb-3">{tool.tagline}</p>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span className="font-semibold">{Number(tool.average_rating).toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({tool.review_count} reviews)</span>
            </div>
            <Badge variant="outline" className={pricingLabels[tool.pricing_model]?.color || ""}>
              <DollarSign className="h-3 w-3 mr-1" />
              {pricingLabels[tool.pricing_model]?.label || tool.pricing_model}
            </Badge>
            {tool.categories && (
              <Badge variant="secondary">{tool.categories.name}</Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" onClick={toggleBookmark} className="gap-2">
            {isBookmarked ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
            {isBookmarked ? "Saved" : "Save"}
          </Button>
          {tool.website_url && (
            <Button asChild className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <a href={tool.website_url} target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4" /> Visit Website
              </a>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Description */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-serif">About {tool.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{tool.description}</p>
            </CardContent>
          </Card>

          {/* Why professionals use this */}
          {tool.why_professionals_use && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg font-serif flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" /> Why Professionals Use This
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed italic">
                  {`"${tool.why_professionals_use}"`}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Trending reason */}
          {tool.is_trending && tool.trending_reason && (
            <Card className="bg-amber-50/50 border-amber-200">
              <CardContent className="p-4 flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-amber-900 mb-0.5">Why it{"'"}s trending</p>
                  <p className="text-sm text-amber-800">{tool.trending_reason}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reviews section */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-serif">Community Reviews</CardTitle>
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
                          Reviews are written by real professionals. Each reviewer{"'"}s role is displayed so you
                          can find feedback from people who work like you do.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button size="sm" onClick={() => setShowReviewForm(!showReviewForm)} className="bg-primary text-primary-foreground">
                    Write a Review
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Rating distribution */}
              {reviews.length > 0 && (
                <div className="mb-6 pb-6 border-b border-border">
                  <div className="flex flex-col gap-1.5">
                    {ratingDistribution.map(({ star, count, percentage }) => (
                      <div key={star} className="flex items-center gap-2 text-sm">
                        <span className="w-8 text-muted-foreground text-right">{star}</span>
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="w-8 text-muted-foreground text-right">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Review form */}
              {showReviewForm && (
                <div className="mb-6 pb-6 border-b border-border">
                  <ReviewForm onSubmit={handleReviewSubmit} onCancel={() => setShowReviewForm(false)} />
                </div>
              )}

              {/* Review list */}
              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-2">No reviews yet.</p>
                  <p className="text-sm text-muted-foreground">Be the first to share your experience with {tool.name}.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {reviews.map((review: any) => (
                    <div key={review.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
                            {review.profiles?.display_name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <span className="text-sm font-medium">{review.profiles?.display_name || "Anonymous"}</span>
                            {review.profiles?.roles?.name && (
                              <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0">
                                {review.profiles.roles.name}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                          ))}
                        </div>
                      </div>
                      {review.title && <p className="text-sm font-medium mb-1">{review.title}</p>}
                      <p className="text-sm text-muted-foreground">{review.body}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(review.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
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
          {/* Roles this tool serves */}
          {tool.tool_roles?.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" /> Built for
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {tool.tool_roles.map((tr: any, i: number) => (
                    <Badge key={i} variant="secondary" className="text-xs">{tr.roles?.name}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tasks */}
          {tool.tool_tasks?.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Best for these tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {tool.tool_tasks.map((tt: any, i: number) => (
                    <Badge key={i} variant="outline" className="text-xs">{tt.tasks?.name}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Related tools */}
          {relatedTools.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Similar Tools</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {relatedTools.map((rt: any) => (
                  <Link key={rt.id} href={`/dashboard/tools/${rt.slug}`} className="flex items-center gap-3 group">
                    <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center text-sm font-serif font-bold text-primary shrink-0">
                      {rt.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium group-hover:text-primary transition-colors truncate">{rt.name}</span>
                        {rt.is_verified && <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs text-muted-foreground">{Number(rt.average_rating).toFixed(1)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
