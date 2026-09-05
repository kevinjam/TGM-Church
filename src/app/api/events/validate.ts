import {
  CONTENT_STATUSES,
  EVENT_CATEGORIES,
  type ContentStatus,
  type EventCategory,
} from "@/lib/db/constants";
import type { EventInput } from "@/lib/db/services/event";
import {
  readObject,
  readText,
  validateOptionalImage,
} from "@/app/api/pages/[slug]/page-validation";

const LIMITS = {
  title: 200,
  description: 2000,
  date: 10,
  time: 80,
  location: 200,
  image: 2048,
} as const;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function validateEventPayload(body: unknown): { error: string } | { data: EventInput } {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { error: "Invalid request body." };
  }
  const input = readObject(body);

  const title = readText(input, "title", LIMITS.title);
  const description = readText(input, "description", LIMITS.description);
  const date = readText(input, "date", LIMITS.date);
  const time = readText(input, "time", LIMITS.time);
  const location = readText(input, "location", LIMITS.location);
  const category = readText(input, "category", 80);
  const imageResult = validateOptionalImage(input, "image", LIMITS.image, "Event");

  if (title === null) return { error: "The event title is required." };
  if (description === null) return { error: "The event description is required." };
  if (date === null || !isValidIsoDate(date)) return { error: "A valid event date is required." };
  if (time === null) return { error: "The event time is required." };
  if (location === null) return { error: "The event location is required." };
  if (category === null || !(EVENT_CATEGORIES as readonly string[]).includes(category)) {
    return { error: "A valid event category is required." };
  }
  if ("error" in imageResult) return imageResult;

  const isUpcoming = input.isUpcoming === true;
  const statusRaw = readText(input, "status", 20);
  if (statusRaw === null || !(CONTENT_STATUSES as readonly string[]).includes(statusRaw)) {
    return { error: "A valid publish status is required." };
  }

  return {
    data: {
      title,
      description,
      date,
      time,
      location,
      image: imageResult.data,
      category: category as EventCategory,
      isUpcoming,
      status: statusRaw as ContentStatus,
    },
  };
}

export const EVENT_OBJECT_ID = /^[a-f\d]{24}$/i;
