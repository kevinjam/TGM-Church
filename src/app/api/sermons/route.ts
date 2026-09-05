import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createSermon, listSermons } from "@/lib/db/services/sermon";
import { validateSermonPayload } from "./validate";

export const dynamic = "force-dynamic";

/** List all sermons (admin only). Public pages read via the server service. */
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const items = await listSermons();
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Listing sermons failed:", error);
    return NextResponse.json(
      { error: "Unable to load sermons." },
      { status: 500 }
    );
  }
}

/** Create a sermon (admin only). */
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

  const result = validateSermonPayload(body);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    const item = await createSermon(result.data);
    return NextResponse.json({ ok: true, item }, { status: 201 });
  } catch (error) {
    console.error("Creating sermon failed:", error);
    return NextResponse.json(
      { error: "Unable to create the sermon. Please try again." },
      { status: 500 }
    );
  }
}
