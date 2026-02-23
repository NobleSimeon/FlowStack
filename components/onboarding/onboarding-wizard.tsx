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

  // Filter tasks dynamically based on selected role
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
    // Reset tasks when role changes
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
      {/* Logo and progress */}
      <div className="mb-10 flex flex-col items-center gap-4">
        <Image
          src="/images/logo.png"
          alt="FlowStack"
          width={48}
          height={48}
          className="rounded-xl"
        />
        <div className="flex items-center gap-2">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s <= step ? "w-14 bg-primary" : "w-8 bg-border"
              }`}
            />
          ))}
        </div>
      </div>

      <div>
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Step 1: Role selection */}
            <div className="text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
                Step 1 of {totalSteps}
              </p>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
                Tell us your role to personalize your stack
              </h1>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {"We'll curate AI tool recommendations tailored to your workflow."}
              </p>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {roles.map((role) => {
                const Icon = iconMap[role.icon] || Sparkles
                const isSelected = selectedRole === role.id
                return (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className={`group relative flex items-start gap-3.5 rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
                        : "border-border bg-card hover:border-primary/40 hover:bg-card/80"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
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
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-border"
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
                className="gap-2 rounded-xl px-8"
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
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Step 2: Task selection */}
            <div className="text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
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

            <div className="mt-10 flex flex-wrap justify-center gap-2.5">
              {filteredTasks.map((task) => {
                const isSelected = selectedTasks.includes(task.id)
                return (
                  <button
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full border-2 px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary shadow-sm shadow-primary/10"
                        : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5"
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

            <p className="mt-5 text-center text-sm text-muted-foreground">
              {selectedTasks.length === 0
                ? "Select at least one task, or skip to see all tools"
                : `${selectedTasks.length} task${selectedTasks.length !== 1 ? "s" : ""} selected`}
            </p>

            {error && (
              <div className="mx-auto mt-4 max-w-sm rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-center text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="mt-10 flex items-center justify-between">
              <Button
                variant="ghost"
                size="lg"
                className="gap-2 rounded-xl"
                onClick={() => setStep(1)}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-xl"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  Skip
                </Button>
                <Button
                  size="lg"
                  className="gap-2 rounded-xl px-8"
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
