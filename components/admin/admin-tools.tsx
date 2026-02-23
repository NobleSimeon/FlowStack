"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  CheckCircle2,
  XCircle,
  TrendingUp,
  Search,
  ExternalLink,
  Eye,
  Trash2,
} from "lucide-react"

interface Tool {
  id: string
  name: string
  slug: string
  tagline: string
  pricing_model: string
  is_verified: boolean
  is_trending: boolean
  average_rating: number
  review_count: number
  created_at: string
  category_name: string
}

export function AdminToolsTable({ tools: initialTools }: { tools: Tool[] }) {
  const supabase = createClient()
  const router = useRouter()
  const [tools, setTools] = useState(initialTools)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState<string | null>(null)

  const filteredTools = tools.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.tagline?.toLowerCase().includes(search.toLowerCase()),
  )

  const toggleVerified = async (toolId: string, current: boolean) => {
    setLoading(toolId)
    await supabase
      .from("tools")
      .update({ is_verified: !current })
      .eq("id", toolId)
    setTools((prev) =>
      prev.map((t) =>
        t.id === toolId ? { ...t, is_verified: !current } : t,
      ),
    )
    setLoading(null)
  }

  const toggleTrending = async (toolId: string, current: boolean) => {
    setLoading(toolId)
    await supabase
      .from("tools")
      .update({ is_trending: !current })
      .eq("id", toolId)
    setTools((prev) =>
      prev.map((t) =>
        t.id === toolId ? { ...t, is_trending: !current } : t,
      ),
    )
    setLoading(null)
  }

  const deleteTool = async (toolId: string) => {
    if (!confirm("Are you sure you want to delete this tool?")) return
    setLoading(toolId)
    await supabase.from("tools").delete().eq("id", toolId)
    setTools((prev) => prev.filter((t) => t.id !== toolId))
    setLoading(null)
  }

  return (
    <div>
      {/* Search */}
      <div className="mb-6 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 border-border bg-card pl-10"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {filteredTools.length} tools
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tool
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Rating
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTools.map((tool) => (
              <tr
                key={tool.id}
                className="border-b border-border transition-colors last:border-0 hover:bg-muted/30"
              >
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {tool.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {tool.tagline}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="secondary" className="text-xs">
                    {tool.category_name}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-foreground">
                    {Number(tool.average_rating).toFixed(1)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {" "}
                    ({tool.review_count})
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {tool.is_verified && (
                      <Badge className="gap-1 border-primary/20 bg-primary/10 text-xs text-primary">
                        <CheckCircle2 className="h-3 w-3" /> Verified
                      </Badge>
                    )}
                    {tool.is_trending && (
                      <Badge className="gap-1 border-amber-200 bg-amber-50 text-xs text-amber-700">
                        <TrendingUp className="h-3 w-3" /> Trending
                      </Badge>
                    )}
                    {!tool.is_verified && !tool.is_trending && (
                      <span className="text-xs text-muted-foreground">
                        Standard
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1 text-xs"
                      onClick={() => toggleVerified(tool.id, tool.is_verified)}
                      disabled={loading === tool.id}
                    >
                      {tool.is_verified ? (
                        <XCircle className="h-3.5 w-3.5" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      )}
                      {tool.is_verified ? "Unverify" : "Verify"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1 text-xs"
                      onClick={() => toggleTrending(tool.id, tool.is_trending)}
                      disabled={loading === tool.id}
                    >
                      <TrendingUp className="h-3.5 w-3.5" />
                      {tool.is_trending ? "Untrend" : "Trend"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs"
                      asChild
                    >
                      <a
                        href={`/dashboard/tools/${tool.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-destructive hover:text-destructive"
                      onClick={() => deleteTool(tool.id)}
                      disabled={loading === tool.id}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
