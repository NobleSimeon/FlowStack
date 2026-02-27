"use client";

import Link from "next/link";
import { BadgeCheck, Star, Quote, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolLogo } from "@/components/landing/tool-logo";
import { GlowCard } from "@/components/ui/glow-card";

interface VerifiedTool {
  id: string;
  name: string;
  tagline: string;
  logo_url: string;
  pricing_model: string;
  average_rating: number;
  review_count: number;
  why_professionals_use: string;
  category_name: string;
}

export function VerifiedPreview({ tool }: { tool: VerifiedTool | null }) {
  if (!tool) return null;

  return (
    <section className="bg-secondary/30 px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-4xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-medium text-accent">
                <BadgeCheck className="h-3 w-3" />
                FlowStack Verified
              </div>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl">
                Tools that earned their place
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
                FlowStack Verified is not a badge you can buy. It means real
                professionals have used this tool, reviewed it, and consistently
                rated it highly for their workflows.
              </p>

              <div className="mt-8">
                <Button className="h-9 gap-2 rounded-full text-[13px]" asChild>
                  <Link href="/dashboard">
                    Explore Verified Tools
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>

            <GlowCard className="p-6 hover:border-primary/30 shadow-lg">
              <div className="mb-4 flex items-start gap-3">
                <ToolLogo name={tool.name} logoUrl={tool.logo_url} size={44} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-semibold text-foreground">
                      {tool.name}
                    </h3>
                    <BadgeCheck className="h-4 w-4 text-accent" />
                  </div>
                  <p className="text-[13px] text-muted-foreground">
                    {tool.category_name}
                  </p>
                </div>
                <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground capitalize">
                  {tool.pricing_model}
                </span>
              </div>

              <p className="mb-4 text-[14px] text-foreground">{tool.tagline}</p>

              <div className="mb-4 rounded-xl bg-secondary/60 px-4 py-3">
                <div className="mb-1 flex items-center gap-1.5">
                  <Quote className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    Why professionals use this
                  </span>
                </div>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  {tool.why_professionals_use}
                </p>
              </div>

              <div className="flex items-center gap-2 border-t border-border/60 pt-4">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-3.5 w-3.5 ${
                        s <= Math.round(Number(tool.average_rating))
                          ? "fill-amber-400 text-amber-400"
                          : "text-border"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[13px] font-medium text-foreground">
                  {Number(tool.average_rating).toFixed(1)}
                </span>
                <span className="text-[12px] text-muted-foreground">
                  from {tool.review_count} reviews
                </span>
              </div>
            </GlowCard>
          </div>
        </div>
      </div>
    </section>
  );
}