"use client"

import { Users, Workflow, ShieldCheck, HelpCircle } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const props = [
  {
    icon: Users,
    title: "Role-Specific",
    description:
      "Tools organized by what you do, not just what they do. A designer sees designer tools with designer context.",
    help: "Select your role during onboarding and we instantly filter the directory to show tools relevant to your daily work. No more scrolling through developer tools when you are a marketer.",
  },
  {
    icon: Workflow,
    title: "Workflow-First",
    description:
      "Every tool is mapped to real tasks in your workflow. Find what fits where you need it most.",
    help: "Instead of generic categories, tools are tagged with specific tasks like 'code generation' or 'content creation.' You see how each tool slots into the work you actually do.",
  },
  {
    icon: ShieldCheck,
    title: "Community Validated",
    description:
      "Reviews from real professionals who share your role. No paid placements. No hidden affiliates.",
    help: "Every review shows the reviewer's role, so you know if feedback comes from someone who uses tools the way you do. FlowStack Verified tools have earned consistent high marks.",
  },
]

export function ValueProps() {
  return (
    <section id="how-it-works" className="bg-card px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Why FlowStack
          </p>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl">
            Built for how professionals actually discover tools
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            Most directories dump every AI tool into one list and call it a day.
            FlowStack starts with your role and works outward.
          </p>
        </div>

        <TooltipProvider>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {props.map((prop, i) => (
              <div
                key={prop.title}
                className="group relative rounded-xl border border-border bg-background p-8 transition-all hover:border-primary/20 hover:shadow-sm animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${i * 150}ms`, animationFillMode: "both" }}
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                  <prop.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 font-serif text-xl font-bold text-foreground">{prop.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{prop.description}</p>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="absolute right-4 bottom-4 text-muted-foreground/40 transition-colors hover:text-muted-foreground"
                      aria-label={`Learn more about ${prop.title}`}
                    >
                      <HelpCircle className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-sm leading-relaxed">
                    {prop.help}
                  </TooltipContent>
                </Tooltip>
              </div>
            ))}
          </div>
        </TooltipProvider>
      </div>
    </section>
  )
}
