import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { UserProfile } from "@/components/dashboard/user-profile"

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, roles(name, slug)")
    .eq("id", user.id)
    .single()

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, tools:tool_id(name, slug, is_verified)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("user_id", user.id)

  return (
    <UserProfile
      user={{
        id: user.id,
        email: user.email || "",
        displayName: profile?.display_name || "",
        roleName: (profile?.roles as any)?.name || "Explorer",
        roleSlug: (profile?.roles as any)?.slug || "",
        createdAt: user.created_at,
      }}
      reviews={reviews || []}
      bookmarkCount={bookmarks?.length || 0}
    />
  )
}
