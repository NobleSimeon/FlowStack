"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Code,
  Palette,
  Target,
  Megaphone,
  PenTool,
  BarChart3,
  Sparkles,
  Compass,
  Rocket,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
} from "lucide-react"

const iconMap: Record<string, React.ElementType> = {
  Code,
  Palette,
  Target,
  Megaphone,
  PenTool,
  BarChart3,
  Sparkles,
  Compass,
  Rocket,
}

interface Role {
  id: string
  name: string
  slug: string
  description: string
  icon: string
}

interface Task {
  id: string
  name: string
  slug: string
  description: string
}

interface RoleTask {
  role_id: string
  task_id: string
}

interface OnboardingWizardProps {
  userId: string
  roles: Role[]
  tasks: Task[]
  roleTasks: RoleTask[]
}

export function OnboardingWizard({
  userId,
  roles,
  tasks,
  roleTasks,
}: OnboardingWizardProps) {
  const [step, setStep] = useState(1)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const totalSteps = 2

  const filteredTasks = useMemo(() => {
    if (!selectedRole) return tasks
    const taskIdsForRole = roleTasks
      .filter((rt) => rt.role_id === selectedRole)
      .map((rt) => rt.task_id)
    const matched = tasks.filter((t) => taskIdsForRole.includes(t.id))
    return matched.length > 0 ? matched : tasks
  }, [selectedRole, tasks, roleTasks])

  const toggleTask = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((t) => t !== taskId)
        : [...prev, taskId],
    )
  }

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId)
    setSelectedTasks([])
  }

  const handleSubmit = async () => {
    if (!selectedRole) return
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          role_id: selectedRole,
          onboarding_complete: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (profileError) throw profileError

      if (selectedTasks.length > 0) {
        const taskRows = selectedTasks.map((taskId) => ({
          user_id: userId,
          task_id: taskId,
        }))

        const { error: tasksError } = await supabase
          .from("user_tasks")
          .insert(taskRows)

        if (tasksError) throw tasksError
      }

      router.push("/dashboard")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setIsSubmitting(false)
    }
  }

  const selectedRoleName = roles.find((r) => r.id === selectedRole)?.name

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-10 flex flex-col items-center gap-4">
        <Image
          src="/images/logo.png"
          alt="FlowStack"
          width={56}
          height={56}
        />
        <div className="flex items-center gap-2">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] ${
                s <= step ? "w-14 bg-primary" : "w-8 bg-white/10 shadow-none"
              }`}
            />
          ))}
        </div>
      </div>

      <div>
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]">
                Step 1 of {totalSteps}
              </p>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
                Tell us your role to personalize your stack
              </h1>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {"We'll curate AI tool recommendations tailored to your workflow."}
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {roles.map((role) => {
                const Icon = iconMap[role.icon] || Sparkles
                const isSelected = selectedRole === role.id
                return (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className={`group relative flex items-start gap-3.5 rounded-xl border p-4 text-left transition-all duration-300 backdrop-blur-md cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] ${
                      isSelected
                        ? "border-primary/50 bg-primary/10 ring-1 ring-primary/50 shadow-[0_0_20px_rgba(245,158,11,0.15),inset_0_1px_0_rgba(255,255,255,0.1)]"
                        : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                          : "bg-white/5 text-muted-foreground group-hover:bg-white/10 group-hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-sans text-sm font-semibold text-foreground">
                        {role.name}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {role.description}
                      </p>
                    </div>
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                        isSelected
                          ? "border-primary bg-primary shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                          : "border-white/20 bg-transparent"
                      }`}
                    >
                      {isSelected && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="mt-10 flex justify-end">
              <Button
                size="lg"
                className="gap-2 rounded-xl px-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_30px_rgba(245,158,11,0.6)] transition-all"
                disabled={!selectedRole}
                onClick={() => setStep(2)}
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]">
                Step 2 of {totalSteps}
              </p>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
                What tasks matter most to you?
              </h1>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {selectedRoleName
                  ? `Showing tasks relevant to ${selectedRoleName}s. Select the ones you do regularly.`
                  : "Select the tasks you do regularly to see the most relevant tools."}
              </p>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {filteredTasks.map((task) => {
                const isSelected = selectedTasks.includes(task.id)
                return (
                  <button
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] ${
                      isSelected
                        ? "border-primary/50 bg-primary/10 text-primary shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                        : "border-white/10 bg-white/5 text-foreground hover:border-white/20 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                    }`}
                  >
                    {isSelected && (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    {task.name}
                  </button>
                )
              })}
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {selectedTasks.length === 0
                ? "Select at least one task, or skip to see all tools"
                : `${selectedTasks.length} task${selectedTasks.length !== 1 ? "s" : ""} selected`}
            </p>

            {error && (
              <div className="mx-auto mt-4 max-w-sm rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-center text-sm text-destructive backdrop-blur-md">
                {error}
              </div>
            )}

            <div className="mt-10 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                variant="ghost"
                size="lg"
                className="gap-2 rounded-xl hover:bg-white/5"
                onClick={() => setStep(1)}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-xl border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/20"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  Skip
                </Button>
                <Button
                  size="lg"
                  className="gap-2 rounded-xl px-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_30px_rgba(245,158,11,0.6)] transition-all"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    <>
                      Find My AI Stack
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}