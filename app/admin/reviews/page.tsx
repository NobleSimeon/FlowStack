import { createClient } from "@/lib/supabase/server"
import { AdminReviewsTable } from "@/components/admin/admin-reviews"

export default async function AdminReviewsPage() {
  const supabase = await createClient()

  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, title, content, rating, is_approved, created_at, tools:tool_id(name, slug), profiles:user_id(display_name)")
    .order("created_at", { ascending: false })

  const formattedReviews = (reviews || []).map((r: any) => ({
    ...r,
    tool_name: r.tools?.name || "Unknown",
    tool_slug: r.tools?.slug || "",
    user_name: r.profiles?.display_name || "Anonymous",
  }))

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Moderate Reviews
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Approve, reject, or remove community reviews.
        </p>
      </div>
      <AdminReviewsTable reviews={formattedReviews} />
    </div>
  )
}
