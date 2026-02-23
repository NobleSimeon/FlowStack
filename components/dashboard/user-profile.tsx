"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Star, CheckCircle2, Bookmark, MessageSquare, Calendar, Mail, User, Pencil, Save, X
} from "lucide-react"
import Link from "next/link"

interface UserProfileProps {
  user: {
    id: string
    email: string
    displayName: string
    roleName: string
    roleSlug: string
    createdAt: string
  }
  reviews: any[]
  bookmarkCount: number
}

export function UserProfile({ user, reviews, bookmarkCount }: UserProfileProps) {
  const supabase = createClient()
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [displayName, setDisplayName] = useState(user.displayName)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!displayName.trim()) return
    setSaving(true)
    await supabase.from("profiles").update({ display_name: displayName.trim() }).eq("id", user.id)
    setSaving(false)
    setEditing(false)
    router.refresh()
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0"

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      {/* Profile header */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-foreground mb-1">Your Profile</h1>
        <p className="text-muted-foreground">Manage your account and track your FlowStack activity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <Card className="bg-card border-border">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-serif font-bold text-primary mb-4">
              {user.displayName.charAt(0).toUpperCase()}
            </div>

            {editing ? (
              <div className="w-full flex flex-col gap-2 mb-3">
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="text-center"
                  autoFocus
                />
                <div className="flex items-center gap-2 justify-center">
                  <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1">
                    <Save className="h-3 w-3" /> {saving ? "Saving..." : "Save"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setDisplayName(user.displayName) }}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-semibold text-foreground">{user.displayName}</h2>
                <button onClick={() => setEditing(true)} className="p-1 rounded hover:bg-secondary">
                  <Pencil className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
            )}

            <Badge variant="secondary" className="mb-3">{user.roleName}</Badge>

            <div className="flex flex-col gap-2 text-sm text-muted-foreground w-full">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                <span>Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats + Reviews */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">{reviews.length}</p>
                <p className="text-xs text-muted-foreground">Reviews</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Bookmark className="h-4 w-4 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">{bookmarkCount}</p>
                <p className="text-xs text-muted-foreground">Bookmarks</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="h-4 w-4 text-amber-400" />
                </div>
                <p className="text-2xl font-bold text-foreground">{avgRating}</p>
                <p className="text-xs text-muted-foreground">Avg Rating</p>
              </CardContent>
            </Card>
          </div>

          {/* Reviews list */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-serif">Your Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-2">You haven{"'"}t written any reviews yet.</p>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard">Browse tools to review</Link>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {reviews.map((review: any) => (
                    <div key={review.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Link href={`/dashboard/tools/${review.tools?.slug}`} className="font-medium text-foreground hover:text-primary transition-colors">
                            {review.tools?.name || "Unknown Tool"}
                          </Link>
                          {review.tools?.is_verified && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                          )}
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                          ))}
                        </div>
                      </div>
                      {review.title && <p className="text-sm font-medium mb-1">{review.title}</p>}
                      <p className="text-sm text-muted-foreground">{review.content}</p>
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
      </div>
    </div>
  )
}
