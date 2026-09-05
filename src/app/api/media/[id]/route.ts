import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { removeMediaEntry } from "@/lib/db/services/media";
import { deleteStoredFile } from "@/lib/media-storage";

export const dynamic = "force-dynamic";

/** Delete a media item and its stored file (admin only). */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  if (!id || !/^[a-f\d]{24}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid media id." }, { status: 400 });
  }

  try {
    const removed = await removeMediaEntry(id);
    if (!removed) {
      return NextResponse.json({ error: "Media item not found." }, { status: 404 });
    }

    deleteStoredFile(removed.url);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Deleting media failed:", error);
    return NextResponse.json(
      { error: "Unable to delete the image. Please try again." },
      { status: 500 }
    );
  }
}
