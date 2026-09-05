import { connectToDatabase, SiteSettingsModel } from "@/lib/db";
import type { SiteSettingsDoc } from "@/lib/db/models/site-settings";

/**
 * Site settings data service.
 *
 * Global site information lives in a single document (key: "global").
 * The defaults below reproduce the church information currently hardcoded
 * across the public website, so the site looks identical before any
 * administrator edits anything.
 */

export interface SiteSettingsView {
  id: string;
  brand: {
    name: string;
    shortName: string;
    displayName: string;
    tagline: string;
    verse: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  serviceTimes: string[];
  socials: {
    facebook: string;
    instagram: string;
    youtube: string;
    twitter: string;
    whatsapp: string;
  };
  footer: {
    description: string;
    copyright: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    image: string;
  };
}

/** Defaults mirroring today's public content (footer/navbar/metadata). */
export const DEFAULT_SITE_SETTINGS: Omit<SiteSettingsView, "id"> = {
  brand: {
    name: "Throne of Grace Ministries",
    shortName: "TGM",
    displayName: "The Gospel Mission",
    tagline: "Connecting Hearts to His Grace",
    verse: "Hebrews 4:16",
  },
  contact: {
    email: "jkinene@gmail.com",
    phone: "+256 703 390633",
    address: "Nakawuka, Wakiso District, Uganda",
  },
  serviceTimes: ["Sundays at 10:00 AM"],
  socials: {
    facebook: "",
    instagram: "",
    youtube: "",
    twitter: "",
    whatsapp: "",
  },
  footer: {
    description: "Connecting Hearts to His Grace (Hebrews 4:16)",
    copyright: "© 2024 TGM - The Gospel Mission. All rights reserved.",
  },
  seo: {
    title: "TGM - The Gospel Mission | Connecting Hearts to His Grace",
    description:
      "Throne of Grace Ministries (TGM) in Wakiso Nakawuka, Uganda. Connecting hearts to God's grace through worship, fellowship, and discipleship.",
    keywords: [
      "church",
      "Uganda",
      "Wakiso",
      "Nakawuka",
      "Christian",
      "worship",
      "ministry",
      "TGM",
    ],
    image: "",
  },
};

/** Stores whether we've already logged a DB outage (avoids log spam). */
let lastDbFailureLogged = false;

const str = (value: unknown): string => (typeof value === "string" ? value : "");
const strArr = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

export function toSiteSettingsView(doc: {
  _id: unknown;
  brand?: Partial<SiteSettingsDoc["brand"]>;
  contact?: Partial<SiteSettingsDoc["contact"]>;
  serviceTimes?: string[];
  socials?: Partial<SiteSettingsDoc["socials"]>;
  footer?: Partial<SiteSettingsDoc["footer"]>;
  seo?: Partial<SiteSettingsDoc["seo"]>;
}): SiteSettingsView {
  return {
    id: String(doc._id),
    brand: {
      name: str(doc.brand?.name) || DEFAULT_SITE_SETTINGS.brand.name,
      shortName: str(doc.brand?.shortName) || DEFAULT_SITE_SETTINGS.brand.shortName,
      displayName: str(doc.brand?.displayName) || DEFAULT_SITE_SETTINGS.brand.displayName,
      tagline: str(doc.brand?.tagline) || DEFAULT_SITE_SETTINGS.brand.tagline,
      verse: str(doc.brand?.verse) || DEFAULT_SITE_SETTINGS.brand.verse,
    },
    contact: {
      email: str(doc.contact?.email) || DEFAULT_SITE_SETTINGS.contact.email,
      phone: str(doc.contact?.phone) || DEFAULT_SITE_SETTINGS.contact.phone,
      address: str(doc.contact?.address) || DEFAULT_SITE_SETTINGS.contact.address,
    },
    serviceTimes: strArr(doc.serviceTimes).length
      ? strArr(doc.serviceTimes)
      : DEFAULT_SITE_SETTINGS.serviceTimes,
    socials: {
      facebook: str(doc.socials?.facebook),
      instagram: str(doc.socials?.instagram),
      youtube: str(doc.socials?.youtube),
      twitter: str(doc.socials?.twitter),
      whatsapp: str(doc.socials?.whatsapp),
    },
    footer: {
      description: str(doc.footer?.description) || DEFAULT_SITE_SETTINGS.footer.description,
      copyright: str(doc.footer?.copyright) || DEFAULT_SITE_SETTINGS.footer.copyright,
    },
    seo: {
      title: str(doc.seo?.title) || DEFAULT_SITE_SETTINGS.seo.title,
      description: str(doc.seo?.description) || DEFAULT_SITE_SETTINGS.seo.description,
      keywords: strArr(doc.seo?.keywords).length
        ? strArr(doc.seo?.keywords)
        : DEFAULT_SITE_SETTINGS.seo.keywords,
      image: str(doc.seo?.image),
    },
  };
}

/**
 * Returns the global settings document, creating it with the current
 * website content as defaults on first access.
 *
 * Public consumers should use this — it never throws, falling back to the
 * defaults above when MongoDB is unreachable so the site still renders.
 */
export async function getSiteSettingsView(): Promise<SiteSettingsView> {
  try {
    await connectToDatabase();
    const doc = await SiteSettingsModel.findOne({ key: "global" }).lean();

    if (doc) {
      lastDbFailureLogged = false;
      return toSiteSettingsView(doc);
    }

    // First run — persist the defaults once so admin edits start from them.
    await SiteSettingsModel.updateOne(
      { key: "global" },
      { $set: { ...DEFAULT_SITE_SETTINGS, key: "global" } },
      { upsert: true }
    );
    const created = await SiteSettingsModel.findOne({ key: "global" }).lean();
    return toSiteSettingsView(
      created ?? { _id: "" }
    );
  } catch (error) {
    if (!lastDbFailureLogged) {
      lastDbFailureLogged = true;
      console.warn(
        "Site settings unavailable — rendering with defaults.",
        error instanceof Error ? error.message : error
      );
    }
    return { id: "", ...DEFAULT_SITE_SETTINGS };
  }
}

export type EditableSiteSettings = Omit<SiteSettingsView, "id">;

/**
 * Persists edited settings (validated upstream) into the singleton
 * document. Throws on database failure so admin flows can surface errors.
 */
export async function saveSiteSettings(
  input: EditableSiteSettings
): Promise<SiteSettingsView> {
  await connectToDatabase();

  const patch = {
    key: "global",
    ...input,
    seo: { ...input.seo, keywords: [...input.seo.keywords] },
  };

  const doc = await SiteSettingsModel.findOneAndUpdate(
    { key: "global" },
    { $set: patch },
    { upsert: true, returnDocument: "after", runValidators: true }
  ).lean();

  return toSiteSettingsView(doc ?? { _id: "" });
}
