import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

/** Returns the current admin session (or null). Used by admin UI. */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({
    user: {
      id: session.sub,
      name: session.name,
      email: session.email,
      role: session.role,
    },
  });
}
