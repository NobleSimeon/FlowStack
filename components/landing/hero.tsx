"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Star, Layers, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolLogo } from "@/components/landing/tool-logo";

interface StackTool {
  name: string;
  slug: string;
  tagline: string;
  logo_url: string;
  average_rating: number;
  pricing_model: string;
}

interface RoleStack {
  role_slug: string;
  role_name: string;
  tools: StackTool[];
}

const roleChips = [
  { slug: "developer", label: "Developer" },
  { slug: "designer", label: "Designer" },
  { slug: "product-manager", label: "Product Manager" },
  { slug: "marketer", label: "Marketer" },
  { slug: "writer", label: "Writer" },
  { slug: "data-analyst", label: "Analyst" },
];

export function Hero({ roleStacks }: { roleStacks: RoleStack[] }) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const selectedStack = roleStacks.find((rs) => rs.role_slug === selectedRole);
  const previewTools = selectedStack?.tools.slice(0, 5) || [];

  return (
    <section className="relative overflow-hidden px-6 pt-24 pb-20 md:pt-32 md:pb-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div className="max-w-2xl">
            <div className="mb-6 animate-in fade-in slide-in-from-bottom-1 duration-500">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/50 backdrop-blur-md px-3.5 py-1.5 text-[13px] font-medium tracking-wide text-foreground shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Ditch the endless scrolling
              </span>
            </div>

            <h1
              className="font-serif text-[42px] font-extrabold leading-[1.1] tracking-tight text-foreground text-balance md:text-[64px] animate-in fade-in slide-in-from-bottom-2 duration-500"
              style={{ animationDelay: "80ms", animationFillMode: "both" }}
            >
              The AI tools that actually fit your workflow.
            </h1>

            <p
              className="mt-6 max-w-lg text-base leading-relaxed text-foreground/20 text-pretty md:text-lg animate-in fade-in slide-in-from-bottom-2 duration-500"
              style={{ animationDelay: "160ms", animationFillMode: "both" }}
            >
              Curated by role, validated by real professionals, and organized
              around the tasks you do every day. No marketing fluff.
            </p>

            <div
              className="mt-10 animate-in fade-in slide-in-from-bottom-2 duration-500"
              style={{ animationDelay: "240ms", animationFillMode: "both" }}
            >
              <p className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-foreground">
                Select your role to preview your stack
              </p>
              <div className="flex flex-wrap gap-2.5">
                {roleChips.map((role) => (
                  <button
                    key={role.slug}
                    onClick={() =>
                      setSelectedRole(
                        selectedRole === role.slug ? null : role.slug,
                      )
                    }
                    className={`rounded-xl border px-5 py-2.5 text-[14px] font-medium transition-all duration-300 ${
                      selectedRole === role.slug
                        ? "border-primary bg-primary text-primary-foreground shadow-md scale-105"
                        : "border-border/50 bg-card/50 text-foreground backdrop-blur-sm hover:border-border hover:bg-card hover:text-foreground"
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            <div
              className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-[13px] text-foreground/40 animate-in fade-in duration-500"
              style={{ animationDelay: "400ms", animationFillMode: "both" }}
            >
              <span className="flex items-center gap-1.5">
                <Layers className="h-4 w-4" /> 40+ curated tools
              </span>
              <span className="hidden sm:block h-3 w-px bg-border" />
              <span>Community validated</span>
              <span className="hidden sm:block h-3 w-px bg-border" />
              <span>Free forever</span>
            </div>
          </div>

          <div
            className="relative mx-auto w-full max-w-md lg:max-w-none animate-in fade-in slide-in-from-right-8 duration-700"
            style={{ animationDelay: "300ms", animationFillMode: "both" }}
          >
            <div className="relative rounded-xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl dark:border-white/5 dark:bg-black/20 p-6 md:p-8">
              {selectedRole && previewTools.length > 0 ? (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                  <div className="mb-6 flex items-center justify-between border-b border-border/50 pb-4">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-foreground">
                        {selectedStack?.role_name} Stack
                      </h3>
                      <p className="text-[13px] text-muted-foreground">
                        Top rated tools in this category
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                      {selectedStack?.tools.length}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {previewTools.map((tool, idx) => (
                      <div
                        key={tool.slug}
                        className="group flex items-center gap-4 rounded-xl border border-border/30 bg-background/50 p-3.5 transition-all hover:border-primary/30 hover:bg-card hover:shadow-md animate-in slide-in-from-bottom-2"
                        style={{
                          animationDelay: `${idx * 50}ms`,
                          animationFillMode: "both",
                        }}
                      >
                        <div className="shrink-0 overflow-hidden rounded-lg shadow-sm">
                          <ToolLogo
                            name={tool.name}
                            logoUrl={tool.logo_url}
                            size={42}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[15px] font-semibold text-foreground group-hover:text-primary transition-colors">
                            {tool.name}
                          </p>
                          <p className="truncate text-[13px] text-muted-foreground">
                            {tool.tagline}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1.5">
                          <span className="flex items-center gap-1 rounded-full bg-amber-400/10 px-2 py-0.5">
                            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                            <span className="text-[12px] font-bold text-amber-600 dark:text-amber-400">
                              {Number(tool.average_rating).toFixed(1)}
                            </span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/50">
                    <Button
                      className="w-full h-11 gap-2 rounded-xl bg-foreground text-background hover:bg-foreground/90 text-[14px] shadow-lg transition-all hover:scale-[1.02]"
                      asChild
                    >
                      <Link href="/dashboard">
                        Explore Full Directory
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in-95 duration-300">
                  <div className="relative mb-8 h-40 w-full max-w-70">
                    <div className="absolute left-4 top-0 h-24 w-48 rounded-xl border border-white/20 bg-linear-to-br from-white/40 to-white/5 backdrop-blur-md shadow-lg transform -rotate-6 transition-transform hover:rotate-0 dark:border-white/10 dark:from-white/10 dark:to-transparent" />
                    <div className="absolute right-4 top-6 h-24 w-48 rounded-xl border border-white/20 bg-linear-to-br from-primary/30 to-primary/5 backdrop-blur-md shadow-lg transform rotate-3 transition-transform hover:rotate-0 dark:border-primary/20 dark:from-primary/20" />
                    <div className="absolute left-1/2 top-12 h-28 w-56 -translate-x-1/2 rounded-xl border border-white/30 bg-background/80 backdrop-blur-xl shadow-xl flex items-center justify-center gap-3 p-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Layers className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="h-2.5 w-full rounded-full bg-muted-foreground/20" />
                        <div className="h-2.5 w-2/3 rounded-full bg-muted-foreground/20" />
                      </div>
                    </div>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-foreground">
                    Discover your perfect stack
                  </h3>
                  <p className="mt-2 text-[14px] text-muted-foreground px-4">
                    Tap a role on the left to see the tools professionals use to
                    get work done.
                  </p>
                </div>
              )}
            </div>

            <div className="absolute -bottom-6 -right-6 -z-10 h-24 w-24 rounded-full border border-primary/20 bg-primary/10 blur-xl" />
            <div className="absolute -top-6 -left-6 -z-10 h-32 w-32 rounded-full border border-primary/20 bg-primary/10 blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
