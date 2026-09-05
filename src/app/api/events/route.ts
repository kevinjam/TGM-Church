import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createEvent, listEvents } from "@/lib/db/services/event";
import { validateEventPayload } from "./validate";

export const dynamic = "force-dynamic";

/** List all events (admin only). Public pages read via the server service. */
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const items = await listEvents();
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Listing events failed:", error);
    return NextResponse.json(
      { error: "Unable to load events." },
      { status: 500 }
    );
  }
}

/** Create an event (admin only). */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const result = validateEventPayload(body);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    const item = await createEvent(result.data);
    return NextResponse.json({ ok: true, item }, { status: 201 });
  } catch (error) {
    console.error("Creating event failed:", error);
    return NextResponse.json(
      { error: "Unable to create the event. Please try again." },
      { status: 500 }
    );
  }
}
