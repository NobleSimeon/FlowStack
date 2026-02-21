import { NextResponse, type NextRequest } from "next/server"

/**
 * Simplified middleware that checks for the Supabase auth token cookie.
 * Full @supabase/ssr integration will be added once the package installs.
 */
export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check for Supabase auth cookies (sb-*-auth-token)
  const hasAuthCookie = request.cookies
    .getAll()
    .some((c) => c.name.includes("-auth-token"))

  // Protected routes require authentication
  const protectedPaths = ["/dashboard", "/onboarding", "/admin"]
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))

  if (isProtected && !hasAuthCookie) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  // Redirect logged-in users away from auth pages
  if (hasAuthCookie && pathname.startsWith("/auth/")) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
