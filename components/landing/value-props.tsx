"use client"

import { HelpCircle } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/* Custom SVG icons — intentional, geometric, modern */

function WorkflowIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="3" width="7" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="15" y="3" width="7" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="8.5" y="16" width="7" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 8V11.5C5.5 12.3284 6.17157 13 7 13H12M18.5 8V11.5C18.5 12.3284 17.8284 13 17 13H12M12 13V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function RoleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 19.5C5.5 16.4624 8.41015 14 12 14C15.5899 14 18.5 16.4624 18.5 19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M17 7L20 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M17 10L19 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function ValidatedIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L14.09 4.26L17 3.34L17.18 6.36L20 7.77L18.82 10.54L20.5 13L18.07 14.54L18.18 17.58L15.17 17.96L13.5 20.5L12 18.56L10.5 20.5L8.83 17.96L5.82 17.58L5.93 14.54L3.5 13L5.18 10.54L4 7.77L6.82 6.36L7 3.34L9.91 4.26L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8.5 12.5L10.5 14.5L15.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const props = [
  {
    icon: WorkflowIcon,
    title: "Workflow-first",
    description:
      "Every tool is mapped to real tasks in your workflow. Find what fits where you need it most.",
    help: "Instead of generic categories, tools are tagged with specific tasks like code generation or content creation. You see how each tool slots into the work you actually do.",
  },
  {
    icon: RoleIcon,
    title: "Role-specific",
    description:
      "Tools organized by what you do, not just what they do. Designers see designer tools with designer context.",
    help: "Select your role during onboarding and we instantly filter the directory to show tools relevant to your daily work.",
  },
  {
    icon: ValidatedIcon,
    title: "Community validated",
    description:
      "Reviews from real professionals who share your role. No paid placements. No hidden affiliates.",
    help: "Every review shows the reviewer's role, so you know if feedback comes from someone who uses tools the way you do.",
  },
]

export function ValueProps() {
  return (
    <section id="how-it-works" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-xl text-center">
          <p className="mb-3 text-[13px] font-medium tracking-wide text-muted-foreground uppercase">
            Why FlowStack
          </p>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl">
            Built for how professionals actually discover tools
          </h2>
        </div>

        <TooltipProvider>
          <div className="mx-auto grid max-w-4xl gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 md:grid-cols-3">
            {props.map((prop, i) => (
              <div
                key={prop.title}
                className="group relative flex flex-col bg-card p-8 transition-colors hover:bg-secondary/30 animate-in fade-in slide-in-from-bottom-2 duration-500"
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground">
                  <prop.icon />
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground">{prop.title}</h3>
                <p className="flex-1 text-[14px] leading-relaxed text-muted-foreground">{prop.description}</p>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="absolute right-4 bottom-4 text-muted-foreground/30 transition-colors hover:text-muted-foreground"
                      aria-label={`Learn more about ${prop.title}`}
                    >
                      <HelpCircle className="h-3.5 w-3.5" />
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
