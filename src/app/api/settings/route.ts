import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import {
  saveSiteSettings,
  type EditableSiteSettings,
} from "@/lib/db/services/site-settings";
import { isEmail, isOptionalHttpUrl, MAX_LENGTHS } from "@/lib/validation";

type InputShape = Record<string, unknown>;

function readStringField(body: InputShape, key: string, maxLength: number): string | null {
  const value = body[key];
  if (value === undefined) return null;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length > maxLength) return null;
  return trimmed;
}

function readOptionalField(body: InputShape, key: string, maxLength: number): string {
  const value = readStringField(body, key, maxLength);
  return value === null ? "" : value;
}

/**
 * Validates the incoming payload against the site settings schema.
 * Returns { error } or a normalized EditableSiteSettings.
 */
function validateSettingsPayload(body: unknown): { error: string } | { data: EditableSiteSettings } {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { error: "Invalid request body." };
  }
  const input = body as InputShape;

  const brand = (input.brand ?? {}) as InputShape;
  const contact = (input.contact ?? {}) as InputShape;
  const socials = (input.socials ?? {}) as InputShape;
  const footer = (input.footer ?? {}) as InputShape;
  const seo = (input.seo ?? {}) as InputShape;

  const name = readStringField(brand, "name", MAX_LENGTHS.brandName);
  const shortName = readStringField(brand, "shortName", MAX_LENGTHS.shortName);
  const displayName = readStringField(brand, "displayName", MAX_LENGTHS.shortName);
  const tagline = readStringField(brand, "tagline", MAX_LENGTHS.tagline);
  const verse = readStringField(brand, "verse", MAX_LENGTHS.verse);

  const email = readStringField(contact, "email", MAX_LENGTHS.email);
  const phone = readStringField(contact, "phone", MAX_LENGTHS.phone);
  const address = readStringField(contact, "address", MAX_LENGTHS.address);

  const footerDescription = readStringField(footer, "description", MAX_LENGTHS.longText);
  const copyright = readStringField(footer, "copyright", MAX_LENGTHS.copyright);

  const seoTitle = readStringField(seo, "title", MAX_LENGTHS.seoTitle);
  const seoDescription = readStringField(seo, "description", MAX_LENGTHS.seoDescription);
  const seoImage = readOptionalField(seo, "image", MAX_LENGTHS.url);

  if (name === null) return { error: "Church name is required and must be short enough." };
  if (shortName === null) return { error: "Short name is required and must be short enough." };
  if (displayName === null) {
    return { error: "Display name is required and must be short enough." };
  }
  if (tagline === null) return { error: "Tagline is required and must be short enough." };
  if (verse === null) return { error: "Verse reference is required." };
  if (email === null || !isEmail(email)) {
    return { error: "Please enter a valid contact email address." };
  }
  if (phone === null) return { error: "Phone number is required." };
  if (address === null) return { error: "Address is required." };
  if (footerDescription === null) return { error: "Footer description is required." };
  if (copyright === null) return { error: "Copyright text is required." };
  if (seoTitle === null) return { error: "SEO title is required." };
  if (seoDescription === null) return { error: "SEO description is required." };

  // Optional social URLs must be valid http(s) URLs when provided.
  const socialKeys = ["facebook", "instagram", "youtube", "twitter", "whatsapp"] as const;
  const socialValues: Record<string, string> = {};
  for (const key of socialKeys) {
    const value = readOptionalField(socials, key, MAX_LENGTHS.url);
    if (!isOptionalHttpUrl(value)) {
      return { error: `The ${key} link must start with http:// or https://` };
    }
    socialValues[key] = value;
  }

  if (seoImage && !isOptionalHttpUrl(seoImage)) {
    return { error: "The SEO image must start with http:// or https://" };
  }

  // Service times: array of non-empty short strings.
  const serviceTimesRaw = input.serviceTimes;
  if (!Array.isArray(serviceTimesRaw) || serviceTimesRaw.some((item) => typeof item !== "string")) {
    return { error: "Service times must be a list of text entries." };
  }
  const serviceTimes = (serviceTimesRaw as string[])
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item) => item.length <= MAX_LENGTHS.serviceTime);
  if (serviceTimesRaw.some((item) => (item as string).trim().length > MAX_LENGTHS.serviceTime)) {
    return { error: "Each service time must be short." };
  }

  // Keywords: optional single string or array -> normalized array.
  let keywords: string[];
  const rawKeywords = seo.keywords;
  if (typeof rawKeywords === "string") {
    keywords = rawKeywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean)
      .slice(0, 20);
  } else if (Array.isArray(rawKeywords) && rawKeywords.every((k) => typeof k === "string")) {
    keywords = (rawKeywords as string[]).map((k) => k.trim()).filter(Boolean).slice(0, 20);
  } else {
    return { error: "SEO keywords must be text." };
  }
  if (keywords.some((k) => k.length > MAX_LENGTHS.keyword)) {
    return { error: "SEO keywords must be short." };
  }

  return {
    data: {
      brand: { name, shortName, displayName, tagline, verse },
      contact: { email, phone, address },
      serviceTimes,
      socials: socialValues as EditableSiteSettings["socials"],
      footer: { description: footerDescription, copyright },
      seo: { title: seoTitle, description: seoDescription, keywords, image: seoImage },
    },
  };
}

export async function PUT(request: Request) {
  // Only signed-in administrators may change site settings.
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const result = validateSettingsPayload(body);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    const saved = await saveSiteSettings(result.data);
    return NextResponse.json({ ok: true, settings: saved });
  } catch (error) {
    console.error("Saving site settings failed:", error);
    return NextResponse.json(
      { error: "Unable to save changes. Please try again." },
      { status: 500 }
    );
  }
}
