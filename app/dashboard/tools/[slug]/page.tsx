import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ToolDetail } from "@/components/dashboard/tool-detail"

export default async function ToolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: tool } = await supabase
    .from("tools")
    .select(`
      *,
      categories(name, slug),
      tool_roles(roles(name, slug, icon)),
      tool_tasks(tasks(name, slug))
    `)
    .eq("slug", slug)
    .single()

  if (!tool) notFound()

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, profiles:user_id(display_name, role_id, roles:role_id(name, slug))")
    .eq("tool_id", tool.id)
    .order("created_at", { ascending: false })

  const { data: relatedTools } = await supabase
    .from("tools")
    .select("id, name, slug, tagline, average_rating, review_count, is_verified, pricing_model, logo_url")
    .eq("category_id", tool.category_id)
    .neq("id", tool.id)
    .limit(3)

  return <ToolDetail tool={tool} reviews={reviews || []} relatedTools={relatedTools || []} />
}
