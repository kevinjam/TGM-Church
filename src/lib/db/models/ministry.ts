import { Schema, model, models, type Model } from "mongoose";
import {
  CONTENT_STATUSES,
  MINISTRY_ICONS,
  type ContentStatus,
  type MinistryIconKey,
} from "@/lib/db/constants";
import { schemaJsonOptions } from "@/lib/db/schema-helpers";

/**
 * Ministry content — mirrors src/data/ministries.ts (name, description,
 * optional cta) plus an optional image and a semantic icon key. When the
 * icon key is absent the public page falls back to its current
 * name-based icon matching.
 */
export interface MinistryDoc {
  name: string;
  description: string;
  cta?: string;
  image?: string;
  icon?: MinistryIconKey;
  /** Display order on the public page */
  order: number;
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
  id?: string;
}

const MinistrySchema = new Schema<MinistryDoc>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    cta: { type: String, trim: true },
    image: { type: String, trim: true },
    icon: { type: String, enum: [...MINISTRY_ICONS] },
    order: { type: Number, default: 0 },
    status: { type: String, enum: [...CONTENT_STATUSES], default: "published" },
  },
  schemaJsonOptions<MinistryDoc>()
);

MinistrySchema.index({ order: 1, status: 1 });

export const MinistryModel: Model<MinistryDoc> =
  (models.Ministry as Model<MinistryDoc> | undefined) ??
  model<MinistryDoc>("Ministry", MinistrySchema, "ministries");
