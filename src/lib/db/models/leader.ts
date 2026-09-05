import { Schema, model, models, type Model } from "mongoose";
import { CONTENT_STATUSES, type ContentStatus } from "@/lib/db/constants";
import { schemaJsonOptions } from "@/lib/db/schema-helpers";

/**
 * Church leadership / team member — mirrors the "Grace Team" section of the
 * About page (src/data/team.ts).
 */
export interface LeaderDoc {
  name: string;
  /** e.g. "Senior Pastor" */
  title: string;
  /** e.g. "Spiritual Leadership & Vision" */
  role: string;
  image?: string;
  bio: string;
  email?: string;
  /** Display order on the About page */
  order: number;
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
  id?: string;
}

const LeaderSchema = new Schema<LeaderDoc>(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    image: { type: String, trim: true },
    bio: { type: String, required: true },
    email: { type: String, trim: true, lowercase: true },
    order: { type: Number, default: 0 },
    status: { type: String, enum: [...CONTENT_STATUSES], default: "published" },
  },
  schemaJsonOptions<LeaderDoc>()
);

LeaderSchema.index({ order: 1, status: 1 });

export const LeaderModel: Model<LeaderDoc> =
  (models.Leader as Model<LeaderDoc> | undefined) ??
  model<LeaderDoc>("Leader", LeaderSchema, "leaders");
