import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createMinistry, listMinistries } from "@/lib/db/services/ministry";
import { validateMinistryPayload } from "./validate";

export const dynamic = "force-dynamic";

/** List all ministries (admin only). Public pages read via the server service. */
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const items = await listMinistries();
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Listing ministries failed:", error);
    return NextResponse.json(
      { error: "Unable to load ministries." },
      { status: 500 }
    );
  }
}

/** Create a ministry (admin only). */
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

  const result = validateMinistryPayload(body);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    const item = await createMinistry(result.data);
    return NextResponse.json({ ok: true, item }, { status: 201 });
  } catch (error) {
    console.error("Creating ministry failed:", error);
    return NextResponse.json(
      { error: "Unable to create the ministry. Please try again." },
      { status: 500 }
    );
  }
}
