import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { deleteSermon, getSermonById, updateSermon } from "@/lib/db/services/sermon";
import { SERMON_OBJECT_ID, validateSermonPayload } from "../validate";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return null;
}

function invalidId() {
  return NextResponse.json({ error: "Invalid sermon id." }, { status: 400 });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  if (!SERMON_OBJECT_ID.test(id)) return invalidId();

  try {
    const item = await getSermonById(id);
    if (!item) {
      return NextResponse.json({ error: "Sermon not found." }, { status: 404 });
    }
    return NextResponse.json({ item });
  } catch (error) {
    console.error("Loading sermon failed:", error);
    return NextResponse.json({ error: "Unable to load the sermon." }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  if (!SERMON_OBJECT_ID.test(id)) return invalidId();

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
    const item = await updateSermon(id, result.data);
    if (!item) {
      return NextResponse.json({ error: "Sermon not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, item });
  } catch (error) {
    console.error("Updating sermon failed:", error);
    return NextResponse.json(
      { error: "Unable to save the sermon. Please try again." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  if (!SERMON_OBJECT_ID.test(id)) return invalidId();

  try {
    const removed = await deleteSermon(id);
    if (!removed) {
      return NextResponse.json({ error: "Sermon not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Deleting sermon failed:", error);
    return NextResponse.json(
      { error: "Unable to delete the sermon. Please try again." },
      { status: 500 }
    );
  }
}
