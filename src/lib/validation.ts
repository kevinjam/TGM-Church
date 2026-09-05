/**
 * Lightweight server-side validation helpers shared by CMS endpoints.
 * Client forms provide friendly UX; these enforce the same rules server-side.
 */

export const MAX_LENGTHS = {
  brandName: 120,
  shortName: 60,
  tagline: 200,
  verse: 80,
  email: 254,
  phone: 40,
  address: 250,
  url: 500,
  serviceTime: 120,
  copyright: 200,
  longText: 2000,
  seoTitle: 200,
  seoDescription: 500,
  keyword: 60,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_PATTERN = /^https?:\/\/.+/i;

export function isEmail(value: string): boolean {
  return value.length <= MAX_LENGTHS.email && EMAIL_PATTERN.test(value);
}

/** Full URL (http/https) — required form. */
export function isHttpUrl(value: string): boolean {
  return value.length <= MAX_LENGTHS.url && URL_PATTERN.test(value);
}

/** Optional URL — empty string allowed. */
export function isOptionalHttpUrl(value: string): boolean {
  return value === "" || isHttpUrl(value);
}
