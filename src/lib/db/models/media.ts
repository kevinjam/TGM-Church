import { Schema, model, models, type Model } from "mongoose";
import { schemaJsonOptions } from "@/lib/db/schema-helpers";

/**
 * Media library item. Only metadata + a URL are stored in MongoDB; the
 * binary file itself lives on disk / an object store (public/uploads or
 * an external provider), never inside the database.
 */
export interface MediaAssetDoc {
  /** Public URL or path, e.g. "/uploads/church-welcome.jpg" */
  url: string;
  /** Original file name, e.g. "church-welcome.jpg" */
  filename: string;
  alt?: string;
  mimeType?: string;
  /** Size in bytes */
  size?: number;
  width?: number;
  height?: number;
  createdAt: Date;
  updatedAt: Date;
  id?: string;
}

const MediaAssetSchema = new Schema<MediaAssetDoc>(
  {
    url: { type: String, required: true, trim: true },
    filename: { type: String, required: true, trim: true },
    alt: { type: String, trim: true },
    mimeType: { type: String, trim: true },
    size: { type: Number },
    width: { type: Number },
    height: { type: Number },
  },
  schemaJsonOptions<MediaAssetDoc>()
);

MediaAssetSchema.index({ filename: 1 });

export const MediaModel: Model<MediaAssetDoc> =
  (models.MediaAsset as Model<MediaAssetDoc> | undefined) ??
  model<MediaAssetDoc>("MediaAsset", MediaAssetSchema, "media");
