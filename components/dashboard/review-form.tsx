"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Star } from "lucide-react"

interface ReviewFormProps {
  onSubmit: (review: { rating: number; title: string; content: string }) => void
  onCancel: () => void
}

export function ReviewForm({ onSubmit, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0 || !content.trim()) return
    setSubmitting(true)
    await onSubmit({ rating, title: title.trim(), content: content.trim() })
    setSubmitting(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Your Rating</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
              className="p-0.5"
            >
              <Star
                className={`h-6 w-6 transition-colors ${
                  star <= (hoveredRating || rating)
                    ? "text-amber-400 fill-amber-400"
                    : "text-slate-200"
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="text-sm text-muted-foreground ml-2">
              {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
            </span>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="review-title" className="text-sm font-medium mb-1.5 block">
          Title <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <Input
          id="review-title"
          placeholder="Sum up your experience in a phrase"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-background"
        />
      </div>

      <div>
        <label htmlFor="review-body" className="text-sm font-medium mb-1.5 block">
          Your Review
        </label>
        <textarea
          id="review-body"
          placeholder="Share your experience using this tool. What do you like? What could be improved?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={rating === 0 || !content.trim() || submitting}
          className="bg-primary text-primary-foreground"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </div>
  )
}
