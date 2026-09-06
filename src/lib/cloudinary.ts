import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

/**
 * Server-only Cloudinary helpers. Credentials never leave the server except
 * the public cloud name + API key, which are returned with a short-lived
 * signed upload payload for the admin browser session.
 */

const FOLDER = process.env.CLOUDINARY_FOLDER?.trim() || "tgm-church";
const ALLOWED_FORMATS = "jpg,jpeg,png,webp,gif,avif";

let configured = false;

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
      process.env.CLOUDINARY_API_KEY?.trim() &&
      process.env.CLOUDINARY_API_SECRET?.trim()
  );
}

function configure(): void {
  if (configured) return;
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured.");
  }
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
}

export type SignedUploadParams = {
  timestamp: number;
  signature: string;
  folder: string;
  apiKey: string;
  cloudName: string;
  allowedFormats: string;
};

/** Params that must be signed AND posted with the file from the browser. */
function signatureParams(timestamp: number) {
  return {
    timestamp,
    folder: FOLDER,
    allowed_formats: ALLOWED_FORMATS,
    use_filename: "true",
    unique_filename: "true",
    overwrite: "false",
  };
}

export function createSignedUpload(): SignedUploadParams {
  configure();
  const timestamp = Math.round(Date.now() / 1000);
  const params = signatureParams(timestamp);
  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET as string
  );

  return {
    timestamp,
    signature,
    folder: FOLDER,
    apiKey: process.env.CLOUDINARY_API_KEY as string,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME as string,
    allowedFormats: ALLOWED_FORMATS,
  };
}

/** Serve auto-format / auto-quality from Cloudinary’s CDN. */
export function toDeliveryUrl(secureUrl: string): string {
  if (secureUrl.includes("/image/upload/f_auto")) return secureUrl;
  return secureUrl.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
}

export function belongsToMediaFolder(publicId: string): boolean {
  return publicId === FOLDER || publicId.startsWith(`${FOLDER}/`);
}

export async function verifyCloudinaryImage(publicId: string): Promise<UploadApiResponse> {
  configure();
  if (!belongsToMediaFolder(publicId)) {
    throw new Error("Image is not in the church media folder.");
  }
  const resource = await cloudinary.api.resource(publicId, {
    resource_type: "image",
  });
  return resource as UploadApiResponse;
}

export async function uploadImageBuffer(
  buffer: Buffer,
  originalName: string
): Promise<UploadApiResponse> {
  configure();
  const baseName = originalName.replace(/\.[^.]+$/, "").slice(0, 80) || "image";

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: FOLDER,
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp", "gif", "avif"],
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        filename_override: baseName,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload returned no result."));
          return;
        }
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

export async function destroyCloudinaryImage(publicId: string): Promise<void> {
  configure();
  await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}

/**
 * Best-effort public_id from a delivery URL. Prefer the stored `publicId`
 * field; this is only for older rows that only have a URL.
 */
export function publicIdFromCloudinaryUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "res.cloudinary.com") return null;
    const marker = "/image/upload/";
    const idx = parsed.pathname.indexOf(marker);
    if (idx === -1) return null;

    const parts = parsed.pathname
      .slice(idx + marker.length)
      .split("/")
      .filter(Boolean);

    let i = 0;
    while (i < parts.length && !/^v\d+$/.test(parts[i] ?? "")) {
      i += 1;
    }
    if (i < parts.length && /^v\d+$/.test(parts[i] ?? "")) {
      i += 1;
    }

    const idParts = parts.slice(i);
    if (idParts.length === 0) return null;
    const last = idParts[idParts.length - 1] ?? "";
    idParts[idParts.length - 1] = last.replace(/\.[a-z0-9]+$/i, "");
    return decodeURIComponent(idParts.join("/"));
  } catch {
    return null;
  }
}

export function mediaFieldsFromCloudinary(
  resource: Pick<
    UploadApiResponse,
    "public_id" | "secure_url" | "bytes" | "width" | "height" | "format" | "original_filename"
  >
) {
  const base =
    resource.original_filename ||
    resource.public_id.split("/").pop() ||
    "image";
  const format = resource.format ? `.${resource.format}` : "";
  const filename = `${base}${format}`;
  return {
    publicId: resource.public_id,
    url: toDeliveryUrl(resource.secure_url),
    filename,
    mimeType: mimeFromFormat(resource.format),
    size: resource.bytes ?? 0,
    width: resource.width,
    height: resource.height,
  };
}

function mimeFromFormat(format: string | undefined): string {
  switch ((format ?? "").toLowerCase()) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    case "avif":
      return "image/avif";
    default:
      return "image/jpeg";
  }
}
