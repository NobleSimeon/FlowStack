import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wrench, MessageSquare, Users, TrendingUp, CheckCircle2, Clock } from "lucide-react"
import Link from "next/link"

export default async function AdminPage() {
  const supabase = await createClient()

  // Fetch counts
  const { count: toolCount } = await supabase
    .from("tools")
    .select("id", { count: "exact", head: true })

  const { count: reviewCount } = await supabase
    .from("reviews")
    .select("id", { count: "exact", head: true })

  const { count: userCount } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })

  const { count: pendingReviewCount } = await supabase
    .from("reviews")
    .select("id", { count: "exact", head: true })
    .eq("is_approved", false)

  const { count: verifiedToolCount } = await supabase
    .from("tools")
    .select("id", { count: "exact", head: true })
    .eq("is_verified", true)

  // Recent tools
  const { data: recentTools } = await supabase
    .from("tools")
    .select("id, name, slug, is_verified, created_at")
    .order("created_at", { ascending: false })
    .limit(5)

  // Recent reviews
  const { data: recentReviews } = await supabase
    .from("reviews")
    .select("id, title, rating, is_approved, created_at, tools:tool_id(name), profiles:user_id(display_name)")
    .order("created_at", { ascending: false })
    .limit(5)

  const stats = [
    {
      label: "Total Tools",
      value: toolCount || 0,
      icon: Wrench,
      color: "text-primary",
      href: "/admin/tools",
    },
    {
      label: "Total Reviews",
      value: reviewCount || 0,
      icon: MessageSquare,
      color: "text-blue-500",
      href: "/admin/reviews",
    },
    {
      label: "Total Users",
      value: userCount || 0,
      icon: Users,
      color: "text-emerald-500",
      href: "/admin/users",
    },
    {
      label: "Pending Reviews",
      value: pendingReviewCount || 0,
      icon: Clock,
      color: "text-amber-500",
      href: "/admin/reviews",
    },
  ]

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Admin Overview
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage tools, moderate reviews, and oversee the FlowStack community.
        </p>
      </div>

      {/* Stats grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="border-border bg-card transition-all hover:border-primary/30 hover:shadow-sm">
              <CardContent className="p-5">
                <div className="mb-2 flex items-center justify-between">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="font-serif text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent tools */}
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif text-lg">Recent Tools</CardTitle>
            <Link
              href="/admin/tools"
              className="text-xs font-medium text-primary hover:text-primary/80"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {(recentTools || []).length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No tools yet.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {(recentTools || []).map((tool) => (
                  <div
                    key={tool.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {tool.name}
                      </span>
                      {tool.is_verified && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(tool.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent reviews */}
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif text-lg">Recent Reviews</CardTitle>
            <Link
              href="/admin/reviews"
              className="text-xs font-medium text-primary hover:text-primary/80"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {(recentReviews || []).length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No reviews yet.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {(recentReviews || []).map((review: any) => (
                  <div
                    key={review.id}
                    className="flex items-center justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-foreground">
                          {review.tools?.name || "Unknown"}
                        </span>
                        <Badge
                          variant={review.is_approved ? "secondary" : "outline"}
                          className={`text-[10px] ${!review.is_approved ? "border-amber-200 bg-amber-50 text-amber-700" : ""}`}
                        >
                          {review.is_approved ? "Approved" : "Pending"}
                        </Badge>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        by {review.profiles?.display_name || "Anonymous"}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
