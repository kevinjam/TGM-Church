import type { SchemaOptions } from "mongoose";

/**
 * Shared Mongoose schema options used by every CMS model.
 *
 * - `timestamps: true`        → automatic createdAt / updatedAt
 * - `versionKey: false`       → no __v noise on documents
 * - toJSON/toObject transform → expose a plain `id` string and drop the
 *   internal `_id` ObjectId, matching how the existing frontend data
 *   files model content ({ id: string, ... }).
 */
interface SerializedDoc {
  id: string;
  [key: string]: unknown;
}

function serialize(_doc: unknown, ret: SerializedDoc): SerializedDoc {
  ret.id = String(ret._id ?? "");
  delete ret._id;
  return ret;
}

export function schemaJsonOptions<DocType>(): SchemaOptions<DocType> {
  return {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true, transform: serialize },
    toObject: { virtuals: true, transform: serialize },
  } as unknown as SchemaOptions<DocType>;
}
