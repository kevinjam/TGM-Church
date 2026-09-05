import { Schema, model, models, type Model } from "mongoose";
import { CONTENT_STATUSES, type ContentStatus } from "@/lib/db/constants";
import { schemaJsonOptions } from "@/lib/db/schema-helpers";

/**
 * A page document represents one public website page (e.g. the homepage).
 * `sections` is intentionally flexible: each section carries a `type` the
 * frontend understands (e.g. "hero", "welcome", "featured-sermon") plus a
 * loosely-typed `content` object that mirrors the props of the existing
 * section components. This keeps the model lightweight — no generic
 * drag-and-drop builder is assumed.
 */
export interface PageSection {
  id: string;
  type: string;
  order: number;
  /** Arbitrary section payload (Mongo Mixed) — frontend sections parse it into typed props. */
  content: unknown;
}

export interface PageSeo {
  title?: string;
  description?: string;
  image?: string;
}

export interface PageDoc {
  /** Unique URL slug, e.g. "home", "about" */
  slug: string;
  title: string;
  status: ContentStatus;
  sections: PageSection[];
  seo?: PageSeo;
  createdAt: Date;
  updatedAt: Date;
  id?: string;
}

const sectionSchema = new Schema<PageSection>(
  {
    id: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    content: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const seoSchema = new Schema<PageSeo>(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const PageSchema = new Schema<PageDoc>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with dashes (e.g. our-dna)"],
    },
    title: { type: String, required: true, trim: true },
    status: { type: String, enum: [...CONTENT_STATUSES], default: "published" },
    sections: { type: [sectionSchema], default: [] },
    seo: { type: seoSchema, default: () => ({}) },
  },
  schemaJsonOptions<PageDoc>()
);

export const PageModel: Model<PageDoc> =
  (models.Page as Model<PageDoc> | undefined) ??
  model<PageDoc>("Page", PageSchema, "pages");
