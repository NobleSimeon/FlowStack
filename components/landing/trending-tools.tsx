"use client";

import Link from "next/link";
import { ArrowRight, TrendingUp, Star, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolLogo } from "@/components/landing/tool-logo";
import { GlowCard } from "@/components/ui/glow-card";

interface TrendingTool {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  website_url: string;
  logo_url: string;
  pricing_model: string;
  is_verified: boolean;
  trending_reason: string;
  average_rating: number;
  review_count: number;
  category_name: string;
}

function PricingBadge({ model }: { model: string }) {
  const labels: Record<string, string> = {
    free: "Free",
    freemium: "Freemium",
    paid: "Paid",
    enterprise: "Enterprise",
    "open-source": "Open Source",
  };
  return (
    <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
      {labels[model] || model}
    </span>
  );
}

export function TrendingTools({ tools }: { tools: TrendingTool[] }) {
  if (!tools || tools.length === 0) return null;

  const marqueeTools = [...tools, ...tools, ...tools];

  return (
    <section id="trending" className="overflow-hidden py-20 md:py-32">
      <div className="mx-auto mb-14 max-w-xl text-center px-6">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-[12px] font-medium text-muted-foreground">
          <TrendingUp className="h-3 w-3" />
          Updated weekly
        </div>
        <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl">
          Trending this week
        </h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground text-pretty">
          The tools professionals are actually switching to this week.
        </p>
      </div>

      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <div className="flex w-max animate-marquee gap-4 px-4 py-4">
          {marqueeTools.map((tool, i) => (
            <Link
              key={`${tool.id}-${i}`}
              href={`/dashboard/tools/${tool.slug}`}
              className="group outline-none shrink-0 w-[320px] sm:w-[380px]"
            >
              <GlowCard className="flex h-full flex-col p-6 hover:border-primary/30 hover:shadow-md shadow-sm">
                <div className="mb-4 flex items-start gap-3">
                  <ToolLogo
                    name={tool.name}
                    logoUrl={tool.logo_url}
                    size={44}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="truncate text-base font-semibold text-foreground">
                        {tool.name}
                      </h3>
                      {tool.is_verified && (
                        <BadgeCheck className="h-4 w-4 shrink-0 text-accent" />
                      )}
                    </div>
                    <p className="text-[12px] text-muted-foreground">
                      {tool.category_name}
                    </p>
                  </div>
                  <PricingBadge model={tool.pricing_model} />
                </div>

                <p className="mb-4 text-[14px] leading-relaxed text-muted-foreground flex-1">
                  {tool.tagline}
                </p>

                <div className="mb-5 rounded-lg bg-secondary/60 px-3 py-2.5">
                  <p className="flex items-start gap-1.5 text-[12px] leading-relaxed text-muted-foreground">
                    <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground" />
                    {tool.trending_reason}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-[13px] font-medium text-foreground">
                        {Number(tool.average_rating).toFixed(1)}
                      </span>
                    </span>
                    <span className="text-[12px] text-muted-foreground">
                      {tool.review_count} reviews
                    </span>
                  </div>
                  <span className="text-[13px] font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    View <ArrowRight className="inline h-3.5 w-3.5" />
                  </span>
                </div>
              </GlowCard>
            </Link>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-[10%] bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[10%] bg-gradient-to-l from-background to-transparent" />
      </div>
    </section>
  );
}
