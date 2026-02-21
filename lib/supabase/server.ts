import { createClient as createSupabaseClient } from "@supabase/supabase-js"

/**
 * Server-side Supabase client for read-only operations in Server Components.
 * Uses the service role for server-side data fetching (no cookies needed for public reads).
 * For authenticated operations, use the middleware-based approach.
 */
export async function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
