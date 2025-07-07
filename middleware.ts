import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("sb-access-token")?.value

  const isAuthPage = req.nextUrl.pathname.startsWith("/login")

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}
// This middleware checks if the user is authenticated by looking for a cookie named "sb-access-token".
// If the user is not authenticated and tries to access a protected route (anything other than "/login"), they will be redirected to the login page.
// If the user is authenticated and tries to access the login page, they will be redirected to the dashboard.
// The matcher specifies which routes the middleware should apply to, in this case, all routes under "/dashboard" and the "/login" route.