"use client";

import {
  ALLOWED_MEDIA_TYPES,
  MAX_UPLOAD_BYTES,
  formatUploadLimit,
  isAllowedMimeType,
} from "@/lib/media-constants";
import type { MediaView } from "@/lib/db/services/media";

type SignResponse = {
  error?: string;
  timestamp?: number;
  signature?: string;
  folder?: string;
  apiKey?: string;
  cloudName?: string;
  allowedFormats?: string;
  storage?: "cloudinary" | "local";
};

type RegisterResponse = {
  error?: string;
  item?: MediaView;
};

function clientValidate(file: File): string | null {
  const mimeType = file.type.toLowerCase();
  if (!isAllowedMimeType(mimeType)) {
    return `Unsupported file type. Allowed: ${ALLOWED_MEDIA_TYPES.join(", ")}`;
  }
  if (file.size === 0) return "The uploaded file is empty.";
  if (file.size > MAX_UPLOAD_BYTES) {
    return `Image is too large. Maximum size is ${formatUploadLimit()}.`;
  }
  return null;
}

async function registerFromApi(init: RequestInit): Promise<MediaView> {
  const response = await fetch("/api/media", init);
  const data = (await response.json().catch(() => ({}))) as RegisterResponse;
  if (!response.ok || !data.item) {
    throw new Error(data.error ?? "Unable to save the image. Please try again.");
  }
  return data.item;
}

async function uploadViaServer(file: File): Promise<MediaView> {
  const formData = new FormData();
  formData.append("file", file);
  return registerFromApi({ method: "POST", body: formData });
}

async function uploadViaCloudinary(file: File, sign: Required<
  Pick<
    SignResponse,
    "timestamp" | "signature" | "folder" | "apiKey" | "cloudName" | "allowedFormats"
  >
>): Promise<MediaView> {
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sign.apiKey);
  form.append("timestamp", String(sign.timestamp));
  form.append("signature", sign.signature);
  form.append("folder", sign.folder);
  form.append("allowed_formats", sign.allowedFormats);
  form.append("use_filename", "true");
  form.append("unique_filename", "true");
  form.append("overwrite", "false");

  const cloudResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`,
    { method: "POST", body: form }
  );
  const uploaded = (await cloudResponse.json().catch(() => ({}))) as {
    error?: { message?: string };
    public_id?: string;
  };

  if (!cloudResponse.ok || !uploaded.public_id) {
    throw new Error(
      uploaded.error?.message ?? "Cloud upload failed. Please try again."
    );
  }

  return registerFromApi({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicId: uploaded.public_id }),
  });
}

/**
 * Uploads an image from the admin UI. Prefers a signed direct upload to
 * Cloudinary (CDN); falls back to the server route for local development.
 */
export async function uploadMediaFile(file: File): Promise<MediaView> {
  const invalid = clientValidate(file);
  if (invalid) throw new Error(invalid);

  const signResponse = await fetch("/api/media/sign", { method: "POST" });
  const sign = (await signResponse.json().catch(() => ({}))) as SignResponse;

  if (signResponse.status === 401) {
    throw new Error("Your session expired. Please sign in again.");
  }

  if (signResponse.status === 503 && sign.error) {
    throw new Error(sign.error);
  }

  if (
    signResponse.ok &&
    sign.storage === "cloudinary" &&
    sign.timestamp &&
    sign.signature &&
    sign.folder &&
    sign.apiKey &&
    sign.cloudName &&
    sign.allowedFormats
  ) {
    return uploadViaCloudinary(file, {
      timestamp: sign.timestamp,
      signature: sign.signature,
      folder: sign.folder,
      apiKey: sign.apiKey,
      cloudName: sign.cloudName,
      allowedFormats: sign.allowedFormats,
    });
  }

  return uploadViaServer(file);
}
