import {
  CONTENT_STATUSES,
  SERMON_CATEGORIES,
  SERMON_TYPES,
  type ContentStatus,
  type SermonCategory,
  type SermonType,
} from "@/lib/db/constants";
import type { SermonInput } from "@/lib/db/services/sermon";
import {
  readObject,
  readText,
  URL_OR_PATH,
  validateOptionalImage,
} from "@/app/api/pages/[slug]/page-validation";

const LIMITS = {
  title: 200,
  speaker: 120,
  date: 80,
  description: 2000,
  category: 80,
  scripture: 120,
  thumbnail: 2048,
  youtubeUrl: 2048,
  audioUrl: 2048,
  castboxUrl: 2048,
  castboxEmbedUrl: 2048,
  duration: 20,
} as const;

function validateOptionalUrl(
  input: ReturnType<typeof readObject>,
  key: string,
  maxLength: number,
  label: string
): { error: string } | { data: string } {
  const value = readText(input, key, maxLength, { optional: true });
  if (value === null) return { error: `The ${label} is too long.` };
  if (value && !URL_OR_PATH.test(value)) {
    return { error: `The ${label} must be a /path or http(s) URL.` };
  }
  return { data: value };
}

export function validateSermonPayload(
  body: unknown
): { error: string } | { data: SermonInput } {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { error: "Invalid request body." };
  }
  const input = readObject(body);

  const title = readText(input, "title", LIMITS.title);
  const speaker = readText(input, "speaker", LIMITS.speaker);
  const date = readText(input, "date", LIMITS.date);
  const description = readText(input, "description", LIMITS.description);
  const category = readText(input, "category", LIMITS.category);
  const type = readText(input, "type", 20);
  const scripture = readText(input, "scripture", LIMITS.scripture, { optional: true });
  const duration = readText(input, "duration", LIMITS.duration, { optional: true });
  const thumbnail = validateOptionalImage(input, "thumbnail", LIMITS.thumbnail, "Sermon");
  const youtubeUrl = validateOptionalUrl(input, "youtubeUrl", LIMITS.youtubeUrl, "YouTube URL");
  const audioUrl = validateOptionalUrl(input, "audioUrl", LIMITS.audioUrl, "audio URL");
  const castboxUrl = validateOptionalUrl(input, "castboxUrl", LIMITS.castboxUrl, "Castbox URL");
  const castboxEmbedUrl = validateOptionalUrl(
    input,
    "castboxEmbedUrl",
    LIMITS.castboxEmbedUrl,
    "Castbox embed URL"
  );

  if (title === null) return { error: "The sermon title is required." };
  if (speaker === null) return { error: "The speaker name is required." };
  if (date === null) return { error: "The sermon date is required." };
  if (description === null) return { error: "The sermon description is required." };
  if (category === null || !(SERMON_CATEGORIES as readonly string[]).includes(category)) {
    return { error: "A valid sermon category is required." };
  }
  if (type === null || !(SERMON_TYPES as readonly string[]).includes(type)) {
    return { error: "A valid sermon type is required." };
  }
  if (scripture === null) return { error: "The scripture reference is too long." };
  if (duration === null) return { error: "The duration is too long." };
  if ("error" in thumbnail) return thumbnail;
  if ("error" in youtubeUrl) return youtubeUrl;
  if ("error" in audioUrl) return audioUrl;
  if ("error" in castboxUrl) return castboxUrl;
  if ("error" in castboxEmbedUrl) return castboxEmbedUrl;

  const statusRaw = readText(input, "status", 20);
  if (statusRaw === null || !(CONTENT_STATUSES as readonly string[]).includes(statusRaw)) {
    return { error: "A valid publish status is required." };
  }

  return {
    data: {
      title,
      speaker,
      date,
      description,
      category: category as SermonCategory,
      scripture,
      thumbnail: thumbnail.data,
      youtubeUrl: youtubeUrl.data,
      audioUrl: audioUrl.data,
      castboxUrl: castboxUrl.data,
      castboxEmbedUrl: castboxEmbedUrl.data,
      duration,
      type: type as SermonType,
      featured: input.featured === true,
      status: statusRaw as ContentStatus,
    },
  };
}

export const SERMON_OBJECT_ID = /^[a-f\d]{24}$/i;
