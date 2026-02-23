"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Shield, ShieldOff } from "lucide-react"

interface UserRow {
  id: string
  display_name: string
  email: string
  role_name: string
  is_admin: boolean
  onboarding_complete: boolean
  created_at: string
  review_count: number
  bookmark_count: number
}

export function AdminUsersTable({ users: initialUsers }: { users: UserRow[] }) {
  const supabase = createClient()
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState<string | null>(null)

  const filtered = users.filter(
    (u) =>
      u.display_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  )

  const toggleAdmin = async (userId: string, current: boolean) => {
    setLoading(userId)
    await supabase
      .from("profiles")
      .update({ is_admin: !current })
      .eq("id", userId)
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, is_admin: !current } : u,
      ),
    )
    setLoading(null)
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 border-border bg-card pl-10"
          />
        </div>
        <p className="text-sm text-muted-foreground">{filtered.length} users</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Activity
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Joined
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border transition-colors last:border-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {user.display_name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {user.display_name || "No name"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className="text-xs">
                      {user.role_name || "No role"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{user.review_count} reviews</span>
                      <span>{user.bookmark_count} saves</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {user.is_admin && (
                        <Badge className="gap-1 border-primary/20 bg-primary/10 text-xs text-primary">
                          <Shield className="h-3 w-3" /> Admin
                        </Badge>
                      )}
                      {user.onboarding_complete ? (
                        <Badge variant="secondary" className="text-xs">
                          Active
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-amber-200 bg-amber-50 text-xs text-amber-700"
                        >
                          Onboarding
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 text-xs"
                        onClick={() => toggleAdmin(user.id, user.is_admin)}
                        disabled={loading === user.id}
                      >
                        {user.is_admin ? (
                          <>
                            <ShieldOff className="h-3.5 w-3.5" /> Remove Admin
                          </>
                        ) : (
                          <>
                            <Shield className="h-3.5 w-3.5" /> Make Admin
                          </>
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
