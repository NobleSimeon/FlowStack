import { createClient } from "@/lib/supabase/server"
import { AdminToolsTable } from "@/components/admin/admin-tools"

export default async function AdminToolsPage() {
  const supabase = await createClient()

  const { data: tools } = await supabase
    .from("tools")
    .select("id, name, slug, tagline, pricing_model, is_verified, is_trending, average_rating, review_count, created_at, categories(name)")
    .order("created_at", { ascending: false })

  const formattedTools = (tools || []).map((tool: any) => ({
    ...tool,
    category_name: tool.categories?.name || "Uncategorized",
  }))

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Manage Tools
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Approve, verify, and manage AI tools in the directory.
        </p>
      </div>
      <AdminToolsTable tools={formattedTools} />
    </div>
  )
}
