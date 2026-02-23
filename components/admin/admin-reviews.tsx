"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Star, Search, CheckCircle2, XCircle, Trash2 } from "lucide-react"

interface Review {
  id: string
  title: string | null
  content: string
  rating: number
  is_approved: boolean
  created_at: string
  tool_name: string
  tool_slug: string
  user_name: string
}

export function AdminReviewsTable({
  reviews: initialReviews,
}: {
  reviews: Review[]
}) {
  const supabase = createClient()
  const [reviews, setReviews] = useState(initialReviews)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all")
  const [loading, setLoading] = useState<string | null>(null)

  const filtered = reviews.filter((r) => {
    const matchesSearch =
      r.content.toLowerCase().includes(search.toLowerCase()) ||
      r.tool_name.toLowerCase().includes(search.toLowerCase()) ||
      r.user_name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter =
      filter === "all" ||
      (filter === "pending" && !r.is_approved) ||
      (filter === "approved" && r.is_approved)
    return matchesSearch && matchesFilter
  })

  const approveReview = async (reviewId: string) => {
    setLoading(reviewId)
    await supabase
      .from("reviews")
      .update({ is_approved: true })
      .eq("id", reviewId)
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, is_approved: true } : r,
      ),
    )
    setLoading(null)
  }

  const rejectReview = async (reviewId: string) => {
    setLoading(reviewId)
    await supabase
      .from("reviews")
      .update({ is_approved: false })
      .eq("id", reviewId)
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, is_approved: false } : r,
      ),
    )
    setLoading(null)
  }

  const deleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return
    setLoading(reviewId)
    await supabase.from("reviews").delete().eq("id", reviewId)
    setReviews((prev) => prev.filter((r) => r.id !== reviewId))
    setLoading(null)
  }

  const pendingCount = reviews.filter((r) => !r.is_approved).length

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search reviews..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 border-border bg-card pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          {(["all", "pending", "approved"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f}
              {f === "pending" && pendingCount > 0 && (
                <Badge className="ml-1.5 h-5 w-5 bg-amber-500 p-0 text-[10px] text-white">
                  {pendingCount}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Review
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tool
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Rating
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  No reviews match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((review) => (
                <tr
                  key={review.id}
                  className="border-b border-border transition-colors last:border-0 hover:bg-muted/30"
                >
                  <td className="max-w-xs px-4 py-3">
                    <p className="text-sm font-medium text-foreground">
                      {review.title || "No title"}
                    </p>
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      {review.content}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      by {review.user_name}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">
                      {review.tool_name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={review.is_approved ? "secondary" : "outline"}
                      className={`text-xs ${!review.is_approved ? "border-amber-200 bg-amber-50 text-amber-700" : ""}`}
                    >
                      {review.is_approved ? "Approved" : "Pending"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {!review.is_approved && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1 text-xs text-emerald-600 hover:text-emerald-700"
                          onClick={() => approveReview(review.id)}
                          disabled={loading === review.id}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Approve
                        </Button>
                      )}
                      {review.is_approved && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1 text-xs"
                          onClick={() => rejectReview(review.id)}
                          disabled={loading === review.id}
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Reject
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-destructive hover:text-destructive"
                        onClick={() => deleteReview(review.id)}
                        disabled={loading === review.id}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
