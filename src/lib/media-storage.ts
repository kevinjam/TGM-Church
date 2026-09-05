import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

/**
 * Server-only media storage helpers.
 *
 * Image files are written to <project>/public/uploads and served statically
 * by Next.js at /uploads/... — MongoDB keeps only metadata + the URL.
 *
 * NOTE: this strategy persists on self-hosted / always-on deployments. On
 * serverless platforms (e.g. Vercel) the filesystem is ephemeral, so an
 * object-storage provider would be needed there instead.
 */

export const ALLOWED_MEDIA_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
] as const;

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

export function uploadDirAbsolute(): string {
  return path.join(process.cwd(), "public", "uploads");
}

export function ensureUploadDir(): string {
  const dir = uploadDirAbsolute();
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function isAllowedMimeType(mimeType: string): mimeType is (typeof ALLOWED_MEDIA_TYPES)[number] {
  return (ALLOWED_MEDIA_TYPES as readonly string[]).includes(mimeType);
}

export function extensionFor(mimeType: string): string | null {
  return EXTENSIONS[mimeType] ?? null;
}

/** Strips anything unsafe from the original file name, keeping the base name. */
export function sanitizeFilename(filename: string): string {
  const base = path.basename(filename).replace(/\.[^.]+$/, "");
  const cleaned = base.replace(/[^a-zA-Z0-9 _-]/g, "").trim().replace(/\s+/g, "-").slice(0, 80);
  return cleaned || "image";
}

/** Generates a collision-resistant name like "church-service-1720ab12cd34ef56.jpg". */
export function generateStoredName(baseName: string, mimeType: string): string | null {
  const extension = extensionFor(mimeType);
  if (!extension) return null;
  return `${sanitizeFilename(baseName)}-${crypto.randomBytes(6).toString("hex")}${extension}`;
}

/**
 * Deletes a stored file for a media URL if it points inside /uploads.
 * Returns whether something was removed (false when file was already gone).
 */
export function deleteStoredFile(publicUrl: string): boolean {
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
    // Fall through — treat as already gone.
  }
  return false;
}
