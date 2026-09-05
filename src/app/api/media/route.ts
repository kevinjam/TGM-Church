import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";
import { getSession } from "@/lib/auth/session";
import {
  createMediaEntry,
  listMedia,
} from "@/lib/db/services/media";
import {
  ALLOWED_MEDIA_TYPES,
  MAX_UPLOAD_BYTES,
  ensureUploadDir,
  generateStoredName,
  isAllowedMimeType,
  sanitizeFilename,
} from "@/lib/media-storage";

export const dynamic = "force-dynamic";

/** List uploaded media (admin only). */
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const items = await listMedia();
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Listing media failed:", error);
    return NextResponse.json(
      { error: "Unable to load the media library." },
      { status: 500 }
    );
  }
}

/** Upload a single image file (admin only). */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let file: File | null = null;
  try {
    const formData = await request.formData();
    const candidate = formData.get("file");
    if (candidate instanceof File) {
      file = candidate;
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid upload. Use a multipart form field named 'file'." },
      { status: 400 }
    );
  }

  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const mimeType = file.type.toLowerCase();
  if (!isAllowedMimeType(mimeType)) {
    return NextResponse.json(
      {
        error: `Unsupported file type. Allowed: ${ALLOWED_MEDIA_TYPES.join(", ")}`,
      },
      { status: 400 }
    );
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: "Image is too large. Maximum size is 5 MB." },
      { status: 400 }
    );
  }

  if (file.size === 0) {
    return NextResponse.json({ error: "The uploaded file is empty." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    // Decode the image as a real-format sanity check and to capture dimensions.
    let width: number | undefined;
    let height: number | undefined;
    try {
      const dimensions = imageSize(buffer);
      width = dimensions?.width;
      height = dimensions?.height;
    } catch {
      // fall through — dimensions stay undefined for unusual-but-valid images
    }
    if (!width || !height) {
      return NextResponse.json(
        { error: "The file does not look like a valid image." },
        { status: 400 }
      );
    }

    const storedName = generateStoredName(file.name, mimeType);
    if (!storedName) {
      return NextResponse.json({ error: "Unsupported file type." }, { status: 400 });
    }

    const dir = ensureUploadDir();
    const absolutePath = path.join(dir, storedName);
    fs.writeFileSync(absolutePath, buffer);

    const publicUrl = `/uploads/${storedName}`;
    const item = await createMediaEntry({
      url: publicUrl,
      filename: sanitizeFilename(file.name) + path.extname(file.name).toLowerCase(),
      mimeType,
      size: file.size,
      width,
      height,
    });

    return NextResponse.json({ ok: true, item }, { status: 201 });
  } catch (error) {
    console.error("Media upload failed:", error);
    return NextResponse.json(
      { error: "Unable to save the image. Please try again." },
      { status: 500 }
    );
  }
}
