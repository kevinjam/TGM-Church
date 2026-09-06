import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createContactMessage, listContactMessages } from "@/lib/db/services/contact";
import { validateContactPayload } from "./validate";

export const dynamic = "force-dynamic";

/** List contact messages (admin only). */
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const items = await listContactMessages();
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Listing contact messages failed:", error);
    return NextResponse.json(
      { error: "Unable to load messages." },
      { status: 500 }
    );
  }
}

/** Public contact form submission. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const result = validateContactPayload(body);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  if (result.spam) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  try {
    await createContactMessage(result.data);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Creating contact message failed:", error);
    return NextResponse.json(
      { error: "Unable to send your message. Please try again." },
      { status: 500 }
    );
  }
}
