import { Schema, model, models, type Model } from "mongoose";
import {
  CONTENT_STATUSES,
  SERMON_CATEGORIES,
  SERMON_TYPES,
  type ContentStatus,
  type SermonCategory,
  type SermonType,
} from "@/lib/db/constants";
import { schemaJsonOptions } from "@/lib/db/schema-helpers";

/**
 * Sermon content — mirrors src/data/sermons.ts. The `date` stays a display
 * string (e.g. "October 15, 2024") to match the existing public frontend,
 * which renders it verbatim.
 */
export interface SermonDoc {
  title: string;
  speaker: string;
  date: string;
  description: string;
  category: SermonCategory;
  scripture?: string;
  thumbnail?: string;
  youtubeUrl?: string;
  audioUrl?: string;
  castboxUrl?: string;
  castboxEmbedUrl?: string;
  duration?: string;
  type: SermonType;
  /** Pinned sermon shown in the homepage "Featured Sermon" section */
  featured: boolean;
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
  id?: string;
}

const SermonSchema = new Schema<SermonDoc>(
  {
    title: { type: String, required: true, trim: true },
    speaker: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: [...SERMON_CATEGORIES],
      default: "Sunday Service",
    },
    scripture: { type: String, trim: true },
    thumbnail: { type: String, trim: true },
    youtubeUrl: { type: String, trim: true },
    audioUrl: { type: String, trim: true },
    castboxUrl: { type: String, trim: true },
    castboxEmbedUrl: { type: String, trim: true },
    duration: { type: String, trim: true },
    type: { type: String, enum: [...SERMON_TYPES], default: "video" },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: [...CONTENT_STATUSES], default: "published" },
  },
  schemaJsonOptions<SermonDoc>()
);

SermonSchema.index({ category: 1, type: 1 });
SermonSchema.index({ status: 1, createdAt: -1 });

export const SermonModel: Model<SermonDoc> =
  (models.Sermon as Model<SermonDoc> | undefined) ??
  model<SermonDoc>("Sermon", SermonSchema, "sermons");
