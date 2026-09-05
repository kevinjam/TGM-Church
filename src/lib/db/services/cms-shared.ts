import { connectToDatabase, PageModel } from "@/lib/db";

/**
 * Shared helpers for CMS-managed page documents (home / about / our-dna).
 * Parsing is defensive: missing or legacy fields fall back to defaults.
 */

export interface PageCta {
  label: string;
  href: string;
}

export interface PageSectionSeed {
  id: string;
  type: string;
  order: number;
  content: unknown;
}

export type AnyRecord = Record<string, unknown>;

export function asRecord(value: unknown): AnyRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as AnyRecord)
    : {};
}

export function stringValue(record: AnyRecord, key: string, fallback: string): string {
  const value = record[key];
  return typeof value === "string" ? value : fallback;
}

export function arrayValue(record: AnyRecord, key: string): unknown[] {
  return Array.isArray(record[key]) ? (record[key] as unknown[]) : [];
}

export function parseCta(raw: unknown, fallback: PageCta): PageCta {
  const record = asRecord(raw);
  return {
    label: stringValue(record, "label", fallback.label),
    href: stringValue(record, "href", fallback.href),
  };
}

export function sectionByType(
  sections: Array<{ type: string; content: unknown }>,
  type: string
): unknown {
  return sections.find((section) => section.type === type)?.content;
}

/**
 * Loads a page document, creating it (or appending missing sections) from
 * the provided defaults. Throws when the database is unavailable so callers
 * can fall back to in-memory defaults.
 */
export async function getOrCreateManagedPage(input: {
  slug: string;
  title: string;
  sections: PageSectionSeed[];
}): Promise<Array<{ type: string; content: unknown }>> {
  await connectToDatabase();

  let page = await PageModel.findOne({ slug: input.slug }).lean();

  if (!page) {
    await PageModel.create({
      slug: input.slug,
      title: input.title,
      status: "published",
      sections: input.sections.map((section) => ({ ...section })),
    });
    page = await PageModel.findOne({ slug: input.slug }).lean();
  } else {
    const existingTypes = new Set(
      (Array.isArray(page.sections) ? page.sections : []).map((section) => section.type)
    );
    const missing = input.sections.filter((section) => !existingTypes.has(section.type));
    if (missing.length > 0) {
      await PageModel.updateOne(
        { slug: input.slug },
        { $push: { sections: { $each: missing.map((section) => ({ ...section })) } } }
      );
      page = await PageModel.findOne({ slug: input.slug }).lean();
    }
  }

  return Array.isArray(page?.sections) ? page.sections : [];
}

/** Writes section payloads by `type` after the document is known to exist. */
export async function saveManagedPageSections(
  slug: string,
  contentsByType: Record<string, unknown>
): Promise<void> {
  const types = Object.keys(contentsByType);
  const $set: Record<string, unknown> = {};
  const arrayFilters: Array<Record<string, string>> = [];

  types.forEach((type, index) => {
    const key = `s${index}`;
    $set[`sections.$[${key}].content`] = contentsByType[type];
    arrayFilters.push({ [`${key}.type`]: type });
  });

  await PageModel.updateOne({ slug }, { $set }, { arrayFilters });
}
