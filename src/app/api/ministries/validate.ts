import {
  CONTENT_STATUSES,
  MINISTRY_ICONS,
  type ContentStatus,
  type MinistryIconKey,
} from "@/lib/db/constants";
import type { MinistryInput } from "@/lib/db/services/ministry";
import {
  readObject,
  readText,
  validateOptionalImage,
} from "@/app/api/pages/[slug]/page-validation";

const LIMITS = {
  name: 200,
  description: 3000,
  cta: 400,
  image: 2048,
} as const;

function readOrder(value: unknown): number | null {
  if (typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 9999) {
    return value;
  }
  if (typeof value === "string" && /^\d+$/.test(value.trim())) {
    const parsed = Number(value.trim());
    if (parsed >= 0 && parsed <= 9999) return parsed;
  }
  return null;
}

export function validateMinistryPayload(
  body: unknown
): { error: string } | { data: MinistryInput } {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { error: "Invalid request body." };
  }
  const input = readObject(body);

  const name = readText(input, "name", LIMITS.name);
  const description = readText(input, "description", LIMITS.description);
  const cta = readText(input, "cta", LIMITS.cta, { optional: true });
  const image = validateOptionalImage(input, "image", LIMITS.image, "Ministry");
  const order = readOrder(input.order);
  const iconRaw = readText(input, "icon", 40, { optional: true });

  if (name === null) return { error: "The ministry name is required." };
  if (description === null) return { error: "The ministry description is required." };
  if (cta === null) return { error: "The call to action is too long." };
  if ("error" in image) return image;
  if (order === null) return { error: "A valid display order is required." };
  if (iconRaw === null) return { error: "The ministry icon is invalid." };
  if (iconRaw && !(MINISTRY_ICONS as readonly string[]).includes(iconRaw)) {
    return { error: "A valid ministry icon is required." };
  }

  const statusRaw = readText(input, "status", 20);
  if (statusRaw === null || !(CONTENT_STATUSES as readonly string[]).includes(statusRaw)) {
    return { error: "A valid publish status is required." };
  }

  return {
    data: {
      name,
      description,
      cta,
      image: image.data,
      icon: (iconRaw || "") as MinistryIconKey | "",
      order,
      status: statusRaw as ContentStatus,
    },
  };
}

export const MINISTRY_OBJECT_ID = /^[a-f\d]{24}$/i;
