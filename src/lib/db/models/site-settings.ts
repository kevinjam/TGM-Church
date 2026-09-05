import { Schema, model, models, type Model } from "mongoose";
import { schemaJsonOptions } from "@/lib/db/schema-helpers";

/**
 * Global site settings — a single document (key: "global") holding the
 * church-wide information that repeats across the navbar, footer, and
 * every public page today (names, tagline, contact info, socials...).
 */
export interface SiteBrandSettings {
  /** Full official name, e.g. "Throne of Grace Ministries" */
  name: string;
  /** Abbreviation, e.g. "TGM" */
  shortName: string;
  /** Compact name shown next to the logo, e.g. "The Gospel Mission" */
  displayName: string;
  /** e.g. "Connecting Hearts to His Grace" */
  tagline: string;
  /** e.g. "Hebrews 4:16" */
  verse: string;
}

export interface SiteContactSettings {
  email: string;
  phone: string;
  /** e.g. "Nakawuka, Wakiso District, Uganda" */
  address: string;
}

export interface SiteSocials {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  twitter?: string;
  whatsapp?: string;
}

export interface SiteFooterSettings {
  /** Short description shown in the footer */
  description: string;
  /** e.g. "© 2024 TGM - The Gospel Mission. All rights reserved." */
  copyright: string;
}

export interface SiteSeoSettings {
  title?: string;
  description?: string;
  keywords?: string[];
  /** Social/share image URL */
  image?: string;
}

export interface SiteSettingsDoc {
  key: "global";
  brand: SiteBrandSettings;
  contact: SiteContactSettings;
  /** e.g. "Sundays at 10:00 AM" */
  serviceTimes: string[];
  socials: SiteSocials;
  footer: SiteFooterSettings;
  seo?: SiteSeoSettings;
  createdAt: Date;
  updatedAt: Date;
  id?: string;
}

const brandSchema = new Schema<SiteBrandSettings>(
  {
    name: { type: String, default: "" },
    shortName: { type: String, default: "" },
    displayName: { type: String, default: "" },
    tagline: { type: String, default: "" },
    verse: { type: String, default: "" },
  },
  { _id: false }
);

const contactSchema = new Schema<SiteContactSettings>(
  {
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
  },
  { _id: false }
);

const socialsSchema = new Schema<SiteSocials>(
  {
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    youtube: { type: String, default: "" },
    twitter: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
  },
  { _id: false }
);

const footerSchema = new Schema<SiteFooterSettings>(
  {
    description: { type: String, default: "" },
    copyright: { type: String, default: "" },
  },
  { _id: false }
);

const seoSchema = new Schema<SiteSeoSettings>(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    keywords: { type: [String], default: [] },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const SiteSettingsSchema = new Schema<SiteSettingsDoc>(
  {
    key: { type: String, default: "global", unique: true },
    brand: { type: brandSchema, required: true, default: () => ({}) },
    contact: { type: contactSchema, required: true, default: () => ({}) },
    serviceTimes: { type: [String], default: [] },
    socials: { type: socialsSchema, default: () => ({}) },
    footer: { type: footerSchema, required: true, default: () => ({}) },
    seo: { type: seoSchema, default: () => ({}) },
  },
  schemaJsonOptions<SiteSettingsDoc>()
);

export const SiteSettingsModel: Model<SiteSettingsDoc> =
  (models.SiteSettings as Model<SiteSettingsDoc> | undefined) ??
  model<SiteSettingsDoc>("SiteSettings", SiteSettingsSchema, "site_settings");
