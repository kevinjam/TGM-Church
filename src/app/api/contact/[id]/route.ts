import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import {
  deleteContactMessage,
  getContactMessageById,
  updateContactMessageStatus,
} from "@/lib/db/services/contact";
import { CONTACT_OBJECT_ID, validateContactStatusPayload } from "../validate";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return null;
}

function invalidId() {
  return NextResponse.json({ error: "Invalid message id." }, { status: 400 });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  if (!CONTACT_OBJECT_ID.test(id)) return invalidId();

  try {
    const item = await getContactMessageById(id);
    if (!item) {
      return NextResponse.json({ error: "Message not found." }, { status: 404 });
    }
    return NextResponse.json({ item });
  } catch (error) {
    console.error("Loading contact message failed:", error);
    return NextResponse.json({ error: "Unable to load the message." }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  if (!CONTACT_OBJECT_ID.test(id)) return invalidId();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const result = validateContactStatusPayload(body);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    const item = await updateContactMessageStatus(id, result.data.status);
    if (!item) {
      return NextResponse.json({ error: "Message not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, item });
  } catch (error) {
    console.error("Updating contact message failed:", error);
    return NextResponse.json(
      { error: "Unable to update the message. Please try again." },
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
  if (!CONTACT_OBJECT_ID.test(id)) return invalidId();

  try {
    const removed = await deleteContactMessage(id);
    if (!removed) {
      return NextResponse.json({ error: "Message not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Deleting contact message failed:", error);
    return NextResponse.json(
      { error: "Unable to delete the message. Please try again." },
      { status: 500 }
    );
  }
}
