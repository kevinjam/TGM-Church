import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {
  destroyCloudinaryImage,
  isCloudinaryConfigured,
  publicIdFromCloudinaryUrl,
} from "@/lib/cloudinary";
import {
  extensionFor,
  isAllowedMimeType,
} from "@/lib/media-constants";

export {
  ALLOWED_MEDIA_TYPES,
  MAX_UPLOAD_BYTES,
  extensionFor,
  formatUploadLimit,
  isAllowedMimeType,
} from "@/lib/media-constants";

/**
 * Local disk is only a development fallback. Production (especially Vercel)
 * has an ephemeral filesystem — images must live on Cloudinary.
 */
export function canUseLocalDisk(): boolean {
  return process.env.NODE_ENV !== "production" && process.env.VERCEL !== "1";
}

export function uploadDirAbsolute(): string {
  return path.join(process.cwd(), "public", "uploads");
}

export function ensureUploadDir(): string {
  const dir = uploadDirAbsolute();
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

/** Strips anything unsafe from the original file name, keeping the base name. */
export function sanitizeFilename(filename: string): string {
  const base = path.basename(filename).replace(/\.[^.]+$/, "");
  const cleaned = base
    .replace(/[^a-zA-Z0-9 _-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
  return cleaned || "image";
}

/** Generates a collision-resistant name like "church-service-1720ab12cd34ef56.jpg". */
export function generateStoredName(baseName: string, mimeType: string): string | null {
  const extension = extensionFor(mimeType);
  if (!extension) return null;
  return `${sanitizeFilename(baseName)}-${crypto.randomBytes(6).toString("hex")}${extension}`;
}

function deleteLocalFile(publicUrl: string): boolean {
  try {
    const resolved = path.resolve(process.cwd(), "public", publicUrl.replace(/^\/+/, ""));
    const allowedRoot = path.resolve(process.cwd(), "public", "uploads");
    if (!resolved.startsWith(`${allowedRoot}${path.sep}`)) {
      return false;
    }
    if (fs.existsSync(resolved)) {
      fs.unlinkSync(resolved);
      return true;
    }
  } catch {
    // Treat as already gone.
  }
  return false;
}

/**
 * Removes the binary from Cloudinary (or local /uploads in development).
 * MongoDB metadata is deleted separately by the media service.
 */
export async function deleteStoredAsset(asset: {
  url: string;
  publicId?: string;
}): Promise<void> {
  const publicId =
    asset.publicId?.trim() || publicIdFromCloudinaryUrl(asset.url) || "";

  if (publicId && isCloudinaryConfigured()) {
    try {
      await destroyCloudinaryImage(publicId);
    } catch (error) {
      console.error("Cloudinary destroy failed:", error);
    }
    return;
  }

  if (asset.url.startsWith("/uploads/")) {
    deleteLocalFile(asset.url);
  }
}
