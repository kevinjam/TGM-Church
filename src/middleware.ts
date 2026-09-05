import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/lib/auth/token";

/**
 * Protects every /admin route with the signed httpOnly session cookie.
 * /admin/login stays public; authenticated visitors there are sent to /admin.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  const loginUrl = new URL("/admin/login", request.url);
  const adminUrl = new URL("/admin", request.url);

  if (pathname === "/admin/login") {
    if (session) {
      return NextResponse.redirect(adminUrl);
    }
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
