import { createClient } from "@/lib/supabase/server"
import { ToolDirectory } from "@/components/dashboard/tool-directory"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch all tools with categories
  const { data: tools } = await supabase
    .from("tools")
    .select(
      "id, name, slug, tagline, description, website_url, logo_url, pricing_model, is_verified, is_trending, average_rating, review_count, why_professionals_use, categories(id, name, slug)"
    )
    .order("is_trending", { ascending: false })
    .order("average_rating", { ascending: false })

  // Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, icon")
    .order("display_order", { ascending: true })

  // Fetch user bookmarks
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let bookmarkedToolIds: string[] = []
  if (user) {
    const { data: bookmarks } = await supabase
      .from("bookmarks")
      .select("tool_id")
      .eq("user_id", user.id)

    bookmarkedToolIds = (bookmarks || []).map((b) => b.tool_id)
  }

  const formattedTools = (tools || []).map((tool) => ({
    ...tool,
    category_name:
      (tool.categories as unknown as { name: string })?.name || "AI Tool",
    category_slug:
      (tool.categories as unknown as { slug: string })?.slug || "",
    category_id:
      (tool.categories as unknown as { id: string })?.id || "",
  }))

  return (
    <ToolDirectory
      tools={formattedTools}
      categories={categories || []}
      bookmarkedToolIds={bookmarkedToolIds}
    />
  )
}
