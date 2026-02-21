import { createClient } from "@/lib/supabase/server"
import { BookmarksList } from "@/components/dashboard/bookmarks-list"

export default async function BookmarksPage() {
  const supabase = await createClient()

  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select(`
      id,
      tool_id,
      created_at,
      tools(
        id, name, slug, tagline, description, website_url,
        pricing_model, is_verified, is_trending, average_rating, review_count,
        categories(name, slug)
      )
    `)
    .order("created_at", { ascending: false })

  const bookmarkedTools = (bookmarks || [])
    .map((b: any) => ({
      bookmarkId: b.id,
      ...b.tools,
      category_name: b.tools?.categories?.name || "AI Tool",
      category_slug: b.tools?.categories?.slug || "",
    }))
    .filter((t: any) => t.id)

  return <BookmarksList tools={bookmarkedTools} />
}
