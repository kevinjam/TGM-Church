/**
 * Shared constants for the CMS data layer.
 * These mirror the content types already used by the TMG website
 * (see src/data/*.ts) so MongoDB documents stay consistent with
 * what the public frontend expects.
 */

export const CONTENT_STATUSES = ["draft", "published"] as const;
export type ContentStatus = (typeof CONTENT_STATUSES)[number];

/** Categories used by events across the site (matches src/data/events.ts). */
export const EVENT_CATEGORIES = [
  "Worship",
  "Fellowship",
  "Outreach",
  "Training",
  "Special",
] as const;
export type EventCategory = (typeof EVENT_CATEGORIES)[number];

/** Sermon categories surfaced in the public Sermons page filters. */
export const SERMON_CATEGORIES = [
  "Sunday Service",
  "Bible Study",
  "Youth",
  "Worship",
] as const;
export type SermonCategory = (typeof SERMON_CATEGORIES)[number];

export const SERMON_TYPES = ["video", "audio", "both"] as const;
export type SermonType = (typeof SERMON_TYPES)[number];

/** Semantic icon keys used by the Ministries page (name matching is the fallback). */
/** Icons used by About page church-information cards. */
export const ABOUT_INFO_ICONS = ["location", "calendar", "community"] as const;
export type AboutInfoIcon = (typeof ABOUT_INFO_ICONS)[number];

/** Icons used by Our DNA roots and focus-area cards. */
export const DNA_ICONS = ["globe", "users", "music", "book", "heart"] as const;
export type DnaIcon = (typeof DNA_ICONS)[number];

export const MINISTRY_ICONS = [
  "youth",
  "men",
  "women",
  "marrieds",
  "children",
  "schools",
  "default",
] as const;
export type MinistryIconKey = (typeof MINISTRY_ICONS)[number];
