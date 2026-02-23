import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard"

export default async function OnboardingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if onboarding already completed
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_complete")
    .eq("id", user.id)
    .single()

  if (profile?.onboarding_complete) {
    redirect("/dashboard")
  }

  // Fetch roles
  const { data: roles } = await supabase
    .from("roles")
    .select("id, name, slug, description, icon")
    .order("display_order", { ascending: true })

  // Fetch all tasks
  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, name, slug, description")
    .order("name", { ascending: true })

  // Fetch role-task mapping so we can filter tasks by selected role
  const { data: roleTasks } = await supabase
    .from("role_tasks")
    .select("role_id, task_id")

  return (
    <OnboardingWizard
      userId={user.id}
      roles={roles || []}
      tasks={tasks || []}
      roleTasks={roleTasks || []}
    />
  )
}
