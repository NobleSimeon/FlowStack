"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Code,
  Palette,
  Target,
  Megaphone,
  PenTool,
  BarChart3,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
} from "lucide-react"
/* CSS transitions replace framer-motion */

const iconMap: Record<string, React.ElementType> = {
  Code,
  Palette,
  Target,
  Megaphone,
  PenTool,
  BarChart3,
  Sparkles,
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

interface OnboardingWizardProps {
  userId: string
  roles: Role[]
  tasks: Task[]
}

export function OnboardingWizard({
  userId,
  roles,
  tasks,
}: OnboardingWizardProps) {
  const [step, setStep] = useState(1)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const totalSteps = 2

  const toggleTask = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((t) => t !== taskId)
        : [...prev, taskId]
    )
  }

  const handleSubmit = async () => {
    if (!selectedRole) return
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()

      // Update profile with role
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          role_id: selectedRole,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (profileError) throw profileError

      // Insert selected tasks
      if (selectedTasks.length > 0) {
        const taskRows = selectedTasks.map((taskId) => ({
          profile_id: userId,
          task_id: taskId,
        }))

        const { error: tasksError } = await supabase
          .from("profile_tasks")
          .insert(taskRows)

        if (tasksError) throw tasksError
      }

      router.push("/dashboard")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-2xl">
      {/* Progress indicator */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {[1, 2].map((s) => (
          <div
            key={s}
            className={`h-1.5 w-12 rounded-full transition-colors ${
              s <= step ? "bg-primary" : "bg-border"
            }`}
          />
        ))}
      </div>

      <div>
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">

            {/* Step 1: Role selection */}
            <div className="text-center">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
                Step 1 of {totalSteps}
              </p>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
                What best describes your role?
              </h1>
              <p className="mt-2 text-muted-foreground">
                {"We'll personalize your tool recommendations based on this."}
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {roles.map((role) => {
                const Icon = iconMap[role.icon] || Sparkles
                const isSelected = selectedRole === role.id
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        isSelected ? "bg-primary/15" : "bg-muted"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          isSelected
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-serif font-bold text-foreground">
                        {role.name}
                      </p>
                      <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                        {role.description}
                      </p>
                    </div>
                    {isSelected && (
                      <Check className="ml-auto h-5 w-5 shrink-0 text-primary" />
                    )}
                  </button>
                )
              })}
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                size="lg"
                className="gap-2"
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
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
                Step 2 of {totalSteps}
              </p>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
                What tasks matter most to you?
              </h1>
              <p className="mt-2 text-muted-foreground">
                Select the tasks you do regularly. This helps us show the most
                relevant tools.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {tasks.map((task) => {
                const isSelected = selectedTasks.includes(task.id)
                return (
                  <button
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-foreground hover:border-primary/30"
                    }`}
                  >
                    {isSelected && <Check className="mr-1.5 inline h-3.5 w-3.5" />}
                    {task.name}
                  </button>
                )
              })}
            </div>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              {selectedTasks.length === 0
                ? "Select at least one task, or skip to see all tools"
                : `${selectedTasks.length} task${selectedTasks.length !== 1 ? "s" : ""} selected`}
            </p>

            {error && (
              <p className="mt-4 text-center text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="mt-8 flex items-center justify-between">
              <Button
                variant="ghost"
                size="lg"
                className="gap-2"
                onClick={() => setStep(1)}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  Skip
                </Button>
                <Button
                  size="lg"
                  className="gap-2"
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
