import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE_NAME,
  createSessionToken,
  verifySessionToken,
  DEFAULT_SESSION_TTL_SECONDS,
  type SessionPayload,
} from "@/lib/auth/token";
import type { UserRole } from "@/lib/db";

/**
 * Server-side session helpers built on an httpOnly, SameSite cookie.
 * Reading is allowed from Server Components and route handlers; writing
 * (set/clear) is only allowed from Server Actions and Route Handlers.
 */

function cookieOptions() {
  const ttlSeconds = Number(process.env.AUTH_SESSION_TTL) || DEFAULT_SESSION_TTL_SECONDS;
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ttlSeconds,
  };
}

export function sessionCookieName(): string {
  return SESSION_COOKIE_NAME;
}

/** Returns the current session payload, or null when signed out / invalid. */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/** Redirects to /admin/login when there is no valid admin session. */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    redirect("/admin/login");
  }
  return session;
}

export async function setSessionCookie(user: {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}): Promise<void> {
  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, cookieOptions());
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", { ...cookieOptions(), maxAge: 0 });
}
