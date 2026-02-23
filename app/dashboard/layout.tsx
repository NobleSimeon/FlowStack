import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if onboarding is completed
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, onboarding_complete, role_id, roles(name, slug)")
    .eq("id", user.id)
    .single()

  if (!profile?.onboarding_complete) {
    redirect("/onboarding")
  }

  return (
    <DashboardShell
      user={{
        id: user.id,
        email: user.email || "",
        displayName: profile?.display_name || user.email?.split("@")[0] || "User",
        roleName: (profile?.roles as unknown as { name: string })?.name || "Explorer",
        roleSlug: (profile?.roles as unknown as { slug: string })?.slug || "",
      }}
    >
      {children}
    </DashboardShell>
  )
}
