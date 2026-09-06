/**
 * Shared media rules. Safe to import from client or server — no Node APIs.
 */

export const ALLOWED_MEDIA_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
] as const;

/** Direct-to-cloud uploads can be larger than Vercel’s 4.5 MB request cap. */
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

export function isAllowedMimeType(
  mimeType: string
): mimeType is (typeof ALLOWED_MEDIA_TYPES)[number] {
  return (ALLOWED_MEDIA_TYPES as readonly string[]).includes(mimeType);
}

export function extensionFor(mimeType: string): string | null {
  return EXTENSIONS[mimeType] ?? null;
}

export function formatUploadLimit(): string {
  return `${Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))} MB`;
}
