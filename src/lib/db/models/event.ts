import { Schema, model, models, type Model } from "mongoose";
import {
  CONTENT_STATUSES,
  EVENT_CATEGORIES,
  type ContentStatus,
  type EventCategory,
} from "@/lib/db/constants";
import { schemaJsonOptions } from "@/lib/db/schema-helpers";

/**
 * Event content — mirrors the existing src/data/events.ts shape plus
 * a publish status for the CMS workflow.
 */
export interface EventDoc {
  title: string;
  description: string;
  date: Date;
  /** e.g. "10:00 AM" */
  time: string;
  location: string;
  /** Media URL (media-library reference or external image) */
  image?: string;
  category: EventCategory;
  /** Drives the public "Upcoming / Past" tabs exactly like the current data file */
  isUpcoming: boolean;
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
  id?: string;
}

const EventSchema = new Schema<EventDoc>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    image: { type: String, trim: true },
    category: { type: String, enum: [...EVENT_CATEGORIES], default: "Worship" },
    isUpcoming: { type: Boolean, default: true },
    status: { type: String, enum: [...CONTENT_STATUSES], default: "published" },
  },
  schemaJsonOptions<EventDoc>()
);

EventSchema.index({ date: 1 });
EventSchema.index({ status: 1, isUpcoming: 1 });

export const EventModel: Model<EventDoc> =
  (models.Event as Model<EventDoc> | undefined) ??
  model<EventDoc>("Event", EventSchema, "events");
