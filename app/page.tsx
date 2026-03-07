import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { ValueProps } from "@/components/landing/value-props";
import { TrendingTools } from "@/components/landing/trending-tools";
import { VerifiedPreview } from "@/components/landing/verified-preview";
import { RolePreview } from "@/components/landing/role-preview";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default async function LandingPage() {
  const supabase = await createClient();

  const { data: trendingTools } = await supabase
    .from("tools")
    .select(
      "id, name, slug, tagline, description, website_url, logo_url, pricing_model, is_verified, trending_reason, average_rating, review_count, categories(name)",
    )
    .eq("is_trending", true)
    .order("featured_at", { ascending: false })
    .limit(6);

  const { data: verifiedTools } = await supabase
    .from("tools")
    .select(
      "id, name, tagline, logo_url, pricing_model, average_rating, review_count, why_professionals_use, categories(name)",
    )
    .eq("is_verified", true)
    .order("average_rating", { ascending: false })
    .limit(1);

  const { data: roles } = await supabase
    .from("roles")
    .select("id, name, slug, description, icon")
    .order("display_order", { ascending: true });

  const { data: toolRoleCounts } = await supabase
    .from("tool_roles")
    .select("role_id");

  const mainRoleSlugs = [
    "developer",
    "designer",
    "product-manager",
    "marketer",
    "writer",
    "data-analyst",
  ];
  const { data: roleStacksRaw } = await supabase
    .from("tool_roles")
    .select(
      "roles(slug, name), tools(name, slug, tagline, logo_url, average_rating, pricing_model)",
    );

  type RoleStackMap = Record<
    string,
    {
      role_slug: string;
      role_name: string;
      tools: Array<{
        name: string;
        slug: string;
        tagline: string;
        logo_url: string;
        average_rating: number;
        pricing_model: string;
      }>;
    }
  >;

  const roleStackMap: RoleStackMap = {};
  if (roleStacksRaw) {
    for (const entry of roleStacksRaw) {
      const role = entry.roles as unknown as { slug: string; name: string };
      const tool = entry.tools as unknown as {
        name: string;
        slug: string;
        tagline: string;
        logo_url: string;
        average_rating: number;
        pricing_model: string;
      };
      if (!role || !tool) continue;
      if (!mainRoleSlugs.includes(role.slug)) continue;

      if (!roleStackMap[role.slug]) {
        roleStackMap[role.slug] = {
          role_slug: role.slug,
          role_name: role.name,
          tools: [],
        };
      }
      roleStackMap[role.slug].tools.push(tool);
    }
  }

  const roleStacks = Object.values(roleStackMap).map((rs) => ({
    ...rs,
    tools: rs.tools.sort(
      (a, b) => Number(b.average_rating) - Number(a.average_rating),
    ),
  }));

  const roleCounts: Record<string, number> = {};
  if (toolRoleCounts) {
    for (const tr of toolRoleCounts) {
      roleCounts[tr.role_id] = (roleCounts[tr.role_id] || 0) + 1;
    }
  }

  const formattedTrending = (trendingTools || []).map((tool) => ({
    ...tool,
    category_name:
      (tool.categories as unknown as { name: string })?.name || "AI Tool",
  }));

  const formattedVerified = verifiedTools?.[0]
    ? {
        ...verifiedTools[0],
        category_name:
          (verifiedTools[0].categories as unknown as { name: string })?.name ||
          "AI Tool",
      }
    : null;

  const formattedRoles = (roles || []).map((role) => ({
    ...role,
    tool_count: roleCounts[role.id] || 0,
  }));

  return (
    <main className="min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <div className="absolute -top-[10%] left-[20%] h-125 w-125 rounded-full bg-primary/10 mix-blend-multiply blur-[120px] filter dark:bg-primary/20 dark:mix-blend-screen" />
        <div className="absolute bottom-[10%] -right-[10%] h-150 w-150 rounded-full bg-primary/10 mix-blend-multiply blur-[120px] filter dark:bg-primary/20 dark:mix-blend-screen" />
      </div>
      <Navbar />
      <Hero roleStacks={roleStacks} />
      <RolePreview roles={formattedRoles} />
      <TrendingTools tools={formattedTrending} />
      <ValueProps />
      {/* <VerifiedPreview tool={formattedVerified} /> */}
      <CTASection />
      <Footer />
    </main>
  );
}
