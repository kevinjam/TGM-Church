import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";
import { getSession } from "@/lib/auth/session";
import { createMediaEntry, findMediaByPublicId, listMedia } from "@/lib/db/services/media";
import {
  isCloudinaryConfigured,
  mediaFieldsFromCloudinary,
  uploadImageBuffer,
  verifyCloudinaryImage,
} from "@/lib/cloudinary";
import {
  ALLOWED_MEDIA_TYPES,
  MAX_UPLOAD_BYTES,
  canUseLocalDisk,
  ensureUploadDir,
  generateStoredName,
  isAllowedMimeType,
  sanitizeFilename,
} from "@/lib/media-storage";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return null;
}

/** List uploaded media (admin only). */
export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

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

async function registerCloudinaryPublicId(publicId: string) {
  const existing = await findMediaByPublicId(publicId);
  if (existing) return existing;
  const resource = await verifyCloudinaryImage(publicId);
  const fields = mediaFieldsFromCloudinary(resource);
  return createMediaEntry(fields);
}

async function saveLocalFile(file: File, buffer: Buffer, width: number, height: number) {
  const mimeType = file.type.toLowerCase();
  const storedName = generateStoredName(file.name, mimeType);
  if (!storedName) {
    return NextResponse.json({ error: "Unsupported file type." }, { status: 400 });
  }

  const dir = ensureUploadDir();
  fs.writeFileSync(path.join(dir, storedName), buffer);

  const item = await createMediaEntry({
    url: `/uploads/${storedName}`,
    filename: sanitizeFilename(file.name) + path.extname(file.name).toLowerCase(),
    mimeType,
    size: file.size,
    width,
    height,
  });

  return NextResponse.json({ ok: true, item }, { status: 201 });
}

/** Register a Cloudinary upload, or accept a file (cloud or local fallback). */
export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const contentType = request.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("application/json")) {
      const body = (await request.json().catch(() => null)) as { publicId?: unknown } | null;
      const publicId = typeof body?.publicId === "string" ? body.publicId.trim() : "";
      if (!publicId) {
        return NextResponse.json({ error: "Missing Cloudinary public id." }, { status: 400 });
      }
      if (!isCloudinaryConfigured()) {
        return NextResponse.json(
          { error: "Cloud image storage is not configured." },
          { status: 503 }
        );
      }

      const item = await registerCloudinaryPublicId(publicId);
      return NextResponse.json({ ok: true, item }, { status: 201 });
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
        { error: "Image is too large. Maximum size is 8 MB." },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "The uploaded file is empty." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let width: number | undefined;
    let height: number | undefined;
    try {
      const dimensions = imageSize(buffer);
      width = dimensions?.width;
      height = dimensions?.height;
    } catch {
      // fall through
    }
    if (!width || !height) {
      return NextResponse.json(
        { error: "The file does not look like a valid image." },
        { status: 400 }
      );
    }

    if (isCloudinaryConfigured()) {
      const uploaded = await uploadImageBuffer(buffer, file.name);
      const item = await createMediaEntry(mediaFieldsFromCloudinary(uploaded));
      return NextResponse.json({ ok: true, item }, { status: 201 });
    }

    if (!canUseLocalDisk()) {
      return NextResponse.json(
        {
          error:
            "Cloud image storage is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
        },
        { status: 503 }
      );
    }

    return saveLocalFile(file, buffer, width, height);
  } catch (error) {
    console.error("Media upload failed:", error);
    return NextResponse.json(
      { error: "Unable to save the image. Please try again." },
      { status: 500 }
    );
  }
}
