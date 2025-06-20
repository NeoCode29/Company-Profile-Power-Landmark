import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { NextResponse } from "next/server"

// This middleware uses only the edge-compatible configuration
// It does not include the adapter or any database access
export const { auth } = NextAuth(authConfig)

// This function can be marked `async` if using `await` inside
export default auth(function middleware(req) {
  // Add any additional custom middleware logic here
  return NextResponse.next()
})

// Optionally, configure which routes require authentication
export const config = {
  matcher: [
    // Protected routes that require authentication
    "/admin/:path*",
    "/dashboard/:path*",
    
    // Skip auth check for these paths
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
} 