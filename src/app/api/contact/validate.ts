import {
  CONTACT_MESSAGE_STATUSES,
  type ContactMessageStatus,
} from "@/lib/db/constants";
import type { ContactMessageInput } from "@/lib/db/services/contact";
import {
  EMAIL_PATTERN,
  readObject,
  readText,
} from "@/app/api/pages/[slug]/page-validation";

const LIMITS = {
  name: 120,
  email: 254,
  message: 5000,
} as const;

export function validateContactPayload(
  body: unknown
): { error: string } | { data: ContactMessageInput; spam: boolean } {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { error: "Invalid request body." };
  }
  const input = readObject(body);

  // Hidden honeypot — bots that fill it are treated as success without saving.
  const honeypot = readText(input, "company", 200, { optional: true });
  if (honeypot === null) return { error: "Invalid request body." };
  if (honeypot) {
    return {
      spam: true,
      data: { name: "ignored", email: "ignored@example.com", message: "ignored" },
    };
  }

  const name = readText(input, "name", LIMITS.name);
  const email = readText(input, "email", LIMITS.email);
  const message = readText(input, "message", LIMITS.message);

  if (name === null) return { error: "Your name is required." };
  if (email === null || !EMAIL_PATTERN.test(email)) {
    return { error: "A valid email address is required." };
  }
  if (message === null) return { error: "A message is required." };

  return {
    spam: false,
    data: { name, email: email.toLowerCase(), message },
  };
}

export function validateContactStatusPayload(
  body: unknown
): { error: string } | { data: { status: ContactMessageStatus } } {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { error: "Invalid request body." };
  }
  const input = readObject(body);
  const status = readText(input, "status", 20);
  if (status === null || !(CONTACT_MESSAGE_STATUSES as readonly string[]).includes(status)) {
    return { error: "A valid message status is required." };
  }
  return { data: { status: status as ContactMessageStatus } };
}

export const CONTACT_OBJECT_ID = /^[a-f\d]{24}$/i;
