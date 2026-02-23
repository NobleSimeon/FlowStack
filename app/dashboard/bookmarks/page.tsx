import { createClient } from "@/lib/supabase/server"
import { BookmarksList } from "@/components/dashboard/bookmarks-list"

export default async function BookmarksPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch bookmarks
  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select(
      `
      id,
      tool_id,
      created_at,
      tools(
        id, name, slug, tagline, description, website_url,
        pricing_model, is_verified, is_trending, average_rating, review_count,
        logo_url,
        categories(name, slug)
      )
    `,
    )
    .order("created_at", { ascending: false })

  const bookmarkedTools = (bookmarks || [])
    .map((b: any) => ({
      bookmarkId: b.id,
      ...b.tools,
      category_name: b.tools?.categories?.name || "AI Tool",
      category_slug: b.tools?.categories?.slug || "",
    }))
    .filter((t: any) => t.id)

  // Fetch recommendations: tools in the same categories as user's role tasks
  // that the user hasn't already bookmarked
  const bookmarkedToolIds = bookmarkedTools.map((t: any) => t.id)

  let recommendations: any[] = []

  if (user) {
    // Get user's role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role_id")
      .eq("id", user.id)
      .single()

    if (profile?.role_id) {
      // Get tools that map to user's role, excluding already bookmarked ones
      const { data: roleTools } = await supabase
        .from("tool_roles")
        .select(
          "tools(id, name, slug, tagline, average_rating, review_count, is_verified, pricing_model, logo_url, categories(name))",
        )
        .eq("role_id", profile.role_id)
        .limit(10)

      if (roleTools) {
        recommendations = roleTools
          .map((rt: any) => ({
            ...rt.tools,
            category_name: rt.tools?.categories?.name || "AI Tool",
          }))
          .filter((t: any) => t.id && !bookmarkedToolIds.includes(t.id))
          .slice(0, 4)
      }
    }
  }

  return (
    <BookmarksList
      tools={bookmarkedTools}
      recommendations={recommendations}
    />
  )
}
