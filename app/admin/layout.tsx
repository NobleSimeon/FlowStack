import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"

export default async function AdminLayout({
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

  // Check if the user is an admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, is_admin")
    .eq("id", user.id)
    .single()

  if (!profile?.is_admin) {
    redirect("/dashboard")
  }

  return (
    <AdminShell
      user={{
        id: user.id,
        email: user.email || "",
        displayName: profile?.display_name || user.email?.split("@")[0] || "Admin",
      }}
    >
      {children}
    </AdminShell>
  )
}
