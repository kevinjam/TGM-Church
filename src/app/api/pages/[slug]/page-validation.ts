import type { PageCta } from "@/lib/db/services/cms-shared";

export type InputShape = Record<string, unknown>;

export const CTA_LIMITS = { label: 80, href: 500 } as const;
export const URL_OR_PATH = /^(\/|https?:\/\/)/i;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function readObject(value: unknown): InputShape {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as InputShape)
    : {};
}

export function readText(
  input: InputShape,
  key: string,
  maxLength: number,
  { optional = false }: { optional?: boolean } = {}
): string | null {
  const value = input[key];
  if (value === undefined) {
    return optional ? "" : null;
  }
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length > maxLength) return null;
  if (!optional && trimmed.length === 0) return null;
  return trimmed;
}

export function validateCta(raw: unknown): { error: string } | { data: PageCta } {
  const input = readObject(raw);
  const label = readText(input, "label", CTA_LIMITS.label);
  const href = readText(input, "href", CTA_LIMITS.href);
  if (label === null) return { error: "Button labels are required." };
  if (href === null) return { error: "Button links are required." };
  if (!URL_OR_PATH.test(href)) {
    return { error: "Button links must start with / or http(s)://" };
  }
  return { data: { label, href } };
}

export function validateOptionalImage(
  input: InputShape,
  key: string,
  maxLength: number,
  label: string
): { error: string } | { data: string } {
  const image = readText(input, key, maxLength, { optional: true });
  if (image === null) return { error: `${label} image is too long.` };
  if (image && !URL_OR_PATH.test(image)) {
    return { error: `${label} image must be a /path or http(s):// URL.` };
  }
  return { data: image };
}
