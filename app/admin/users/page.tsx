import { createClient } from "@/lib/supabase/server"
import { AdminUsersTable } from "@/components/admin/admin-users"

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name, email, is_admin, onboarding_complete, created_at, roles(name)")
    .order("created_at", { ascending: false })

  // Get review and bookmark counts for each user
  const userIds = (profiles || []).map((p: any) => p.id)

  const { data: reviewCounts } = await supabase
    .from("reviews")
    .select("user_id")
    .in("user_id", userIds)

  const { data: bookmarkCounts } = await supabase
    .from("bookmarks")
    .select("user_id")
    .in("user_id", userIds)

  const reviewCountMap: Record<string, number> = {}
  for (const r of reviewCounts || []) {
    reviewCountMap[r.user_id] = (reviewCountMap[r.user_id] || 0) + 1
  }

  const bookmarkCountMap: Record<string, number> = {}
  for (const b of bookmarkCounts || []) {
    bookmarkCountMap[b.user_id] = (bookmarkCountMap[b.user_id] || 0) + 1
  }

  const formattedUsers = (profiles || []).map((p: any) => ({
    id: p.id,
    display_name: p.display_name || "",
    email: p.email || "",
    role_name: p.roles?.name || "",
    is_admin: p.is_admin || false,
    onboarding_complete: p.onboarding_complete || false,
    created_at: p.created_at,
    review_count: reviewCountMap[p.id] || 0,
    bookmark_count: bookmarkCountMap[p.id] || 0,
  }))

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Manage Users
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and manage all registered users.
        </p>
      </div>
      <AdminUsersTable users={formattedUsers} />
    </div>
  )
}
