"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Bookmark, Menu, X, User, LogOut } from "lucide-react";

interface DashboardShellProps {
  user: {
    id: string;
    email: string;
    displayName: string;
    roleName: string;
    roleSlug: string;
  };
  children: React.ReactNode;
}

const navItems = [
  { label: "Explore Tools", href: "/dashboard", icon: LayoutGrid },
  { label: "My Stack", href: "/dashboard/bookmarks", icon: Bookmark },
  // { label: "Profile", href: "/dashboard/profile", icon: User },
];

export function DashboardShell({ user, children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    router.prefetch("/dashboard");
    router.prefetch("/dashboard/bookmarks");
    router.prefetch("/dashboard/profile");
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:flex lg:flex-col h-full">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-border px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/images/logo.png"
              alt="FlowStack"
              width={36}
              height={36}
            />
            <span className="font-serif text-lg font-bold text-foreground">
              FlowStack
            </span>
          </Link>
        </div>

        {/* Desktop User Section */}
        <Link href="/dashboard/profile" className="px-4 pt-6 pb-2 shrink-0">
          <div className="flex items-center gap-3 rounded-xl p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-serif text-sm font-bold text-primary">
              {user.displayName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {user.displayName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user.roleName}
              </p>
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1 px-3 py-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Sign Out */}
        <div className="mt-auto border-t border-border p-4 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/images/logo.png"
              alt="FlowStack"
              width={36}
              height={36}
            />
            <span className="font-serif text-lg font-bold text-foreground">
              FlowStack
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <X className="h-5 w-5 text-foreground" />
            ) : (
              <Menu className="h-5 w-5 text-foreground" />
            )}
          </button>
        </header>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div className="border-b border-border bg-card p-4 lg:hidden animate-in fade-in slide-in-from-top-2 duration-200 shrink-0 shadow-md">
            {/* Mobile User Section */}
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-border bg-background p-3 shadow-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-serif text-sm font-bold text-primary">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {user.displayName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user.roleName}
                </p>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Sign Out */}
            <div className="mt-4 border-t border-border pt-4">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
