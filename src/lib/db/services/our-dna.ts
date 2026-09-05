import { DNA_ICONS, type DnaIcon } from "@/lib/db/constants";
import {
  asRecord,
  arrayValue,
  getOrCreateManagedPage,
  parseCta,
  saveManagedPageSections,
  sectionByType,
  stringValue,
  type PageCta,
  type PageSectionSeed,
} from "@/lib/db/services/cms-shared";

export { DNA_ICONS, type DnaIcon };

/**
 * Our DNA page CMS service.
 *
 * Defaults reproduce the current hardcoded Our DNA page so the public site
 * looks identical before any administrator edits content.
 */

export interface DnaHeroSection {
  title: string;
  tagline: string;
  quote: string;
  reference: string;
}

export interface DnaHeadingSection {
  heading: string;
  subtitle: string;
}

export interface DnaVisionSection extends DnaHeadingSection {
  quote: string;
}

export interface DnaScripture {
  verse: string;
  reference: string;
}

export interface DnaFoundationSection extends DnaHeadingSection {
  scriptures: DnaScripture[];
  summaryEmphasis: string;
  summaryBody: string;
}

export interface DnaMissionSection extends DnaHeadingSection {
  quote: string;
  highlights: string[];
}

export interface DnaIconItem {
  title: string;
  quote: string;
  reference: string;
  icon: DnaIcon;
}

export interface DnaRootsSection extends DnaHeadingSection {
  items: DnaIconItem[];
}

export interface DnaFocusItem {
  title: string;
  verse: string;
  reference: string;
  icon: DnaIcon;
}

export interface DnaFocusSection extends DnaHeadingSection {
  items: DnaFocusItem[];
}

export interface DnaValueItem {
  title: string;
  description: string;
  verse: string;
  reference: string;
}

export interface DnaValuesSection extends DnaHeadingSection {
  items: DnaValueItem[];
}

export interface DnaContactSection {
  heading: string;
  email: string;
  phone: string;
  address: string;
}

export interface DnaCtaSection {
  heading: string;
  body: string;
  primaryCta: PageCta;
  secondaryCta: PageCta;
}

export interface OurDnaContent {
  hero: DnaHeroSection;
  vision: DnaVisionSection;
  foundation: DnaFoundationSection;
  mission: DnaMissionSection;
  roots: DnaRootsSection;
  focus: DnaFocusSection;
  values: DnaValuesSection;
  contact: DnaContactSection;
  cta: DnaCtaSection;
}

export const DEFAULT_DNA_HERO: DnaHeroSection = {
  title: "What Defines Us",
  tagline: "Rooted in Grace. Living for His Glory.",
  quote: "Connecting Hearts to His Grace",
  reference: "Hebrews 4:16",
};

export const DEFAULT_DNA_VISION: DnaVisionSection = {
  heading: "Vision",
  subtitle: "Our God-given vision for the future",
  quote:
    "To see a generation boldly dwelling in God's presence, transformed by grace, and advancing His Kingdom in every sphere of life.",
};

export const DEFAULT_DNA_FOUNDATION: DnaFoundationSection = {
  heading: "Biblical Foundation",
  subtitle: "Our faith is built on the solid rock of God's Word",
  scriptures: [
    {
      verse:
        "Therefore, since we have confidence to enter the Most Holy Place by the blood of Jesus... let us draw near to God.",
      reference: "Hebrews 10:19, 22",
    },
    {
      verse: "Your kingdom come, Your will be done on earth as it is in heaven.",
      reference: "Matthew 6:10",
    },
  ],
  summaryEmphasis: "Throne of Grace Ministries'",
  summaryBody:
    " vision is restoring confident intimacy with God (worship), equipping believers to live in grace (discipleship), and releasing grace into culture (outreach).",
};

export const DEFAULT_DNA_MISSION: DnaMissionSection = {
  heading: "Our Mission",
  subtitle: "What drives us forward in service to God and His people",
  quote:
    "To lead people into encounters with God's throne of grace through dynamic worship, biblical teaching, and radical acts of love, empowering them to walk in freedom, authority, and purpose.",
  highlights: ["grace", "freedom", "authority", "purpose"],
};

export const DEFAULT_DNA_ROOTS: DnaRootsSection = {
  heading: "Biblical Roots",
  subtitle: "The foundation of our calling and purpose",
  items: [
    {
      title: "Glory & Nations",
      quote: "Declare His glory among the nations, His marvelous deeds among all people.",
      reference: "Psalm 96:3",
      icon: "globe",
    },
    {
      title: "Discipleship",
      quote: "Go and make disciples... teaching them to obey everything I have commanded you.",
      reference: "Matthew 28:19–20",
      icon: "users",
    },
  ],
};

export const DEFAULT_DNA_FOCUS: DnaFocusSection = {
  heading: "Focus Areas",
  subtitle: "The three pillars that guide our ministry",
  items: [
    {
      title: "Worship",
      verse: "Create spaces where God's presence is tangible.",
      reference: "Psalm 22:3",
      icon: "music",
    },
    {
      title: "Discipleship",
      verse: "Teach grace-based identity and obedience.",
      reference: "Titus 2:11–12",
      icon: "book",
    },
    {
      title: "Outreach",
      verse: "Demonstrate grace through service.",
      reference: "James 2:18",
      icon: "heart",
    },
  ],
};

export const DEFAULT_DNA_VALUES: DnaValuesSection = {
  heading: "Core Values",
  subtitle: "The principles that shape our community and guide our decisions",
  items: [
    {
      title: "Confidence in Christ",
      description: "We approach God not in our strength, but in Jesus' finished work.",
      verse: "In Him and through faith in Him we may approach God with freedom and confidence.",
      reference: "Ephesians 3:12",
    },
    {
      title: "Grace-Driven Transformation",
      description: "We preach grace that empowers holiness, not excuses sin.",
      verse: "For the grace of God has appeared that offers salvation to all people…",
      reference: "Titus 2:11–12",
    },
    {
      title: "Authentic Community",
      description: "We reject performance-based faith; we grow together in vulnerability and truth.",
      verse: "Carry each other's burdens, and in this way you will fulfill the law of Christ.",
      reference: "Galatians 6:2",
    },
    {
      title: "Kingdom Generosity",
      description: "We give freely—whether resources, mercy, or time—because we've received freely.",
      verse: "Freely you have received; freely give.",
      reference: "Matthew 10:8",
    },
  ],
};

export const DEFAULT_DNA_CONTACT: DnaContactSection = {
  heading: "Get In Touch",
  email: "jkinene@gmail.com",
  phone: "+256 703 390633",
  address: "Nakawuka, Wakiso District, Uganda",
};

export const DEFAULT_DNA_CTA: DnaCtaSection = {
  heading: "Join Our Family",
  body:
    "Experience the love, unity, and grace that defines our community. " +
    "We welcome you to be part of our journey of faith and fellowship.",
  primaryCta: { label: "Learn More About Us", href: "/about" },
  secondaryCta: { label: "Get In Touch", href: "/contact" },
};

const DNA_SECTION_DEFAULTS: PageSectionSeed[] = [
  { id: "hero", type: "hero", order: 0, content: DEFAULT_DNA_HERO },
  { id: "vision", type: "vision", order: 1, content: DEFAULT_DNA_VISION },
  { id: "foundation", type: "foundation", order: 2, content: DEFAULT_DNA_FOUNDATION },
  { id: "mission", type: "mission", order: 3, content: DEFAULT_DNA_MISSION },
  { id: "roots", type: "roots", order: 4, content: DEFAULT_DNA_ROOTS },
  { id: "focus", type: "focus", order: 5, content: DEFAULT_DNA_FOCUS },
  { id: "values", type: "values", order: 6, content: DEFAULT_DNA_VALUES },
  { id: "contact", type: "contact", order: 7, content: DEFAULT_DNA_CONTACT },
  { id: "cta", type: "cta", order: 8, content: DEFAULT_DNA_CTA },
];

function isDnaIcon(value: string): value is DnaIcon {
  return (DNA_ICONS as readonly string[]).includes(value);
}

function parseHeading(raw: ReturnType<typeof asRecord>, fallback: DnaHeadingSection): DnaHeadingSection {
  return {
    heading: stringValue(raw, "heading", fallback.heading),
    subtitle: stringValue(raw, "subtitle", fallback.subtitle),
  };
}

function parseHero(rawContent: unknown): DnaHeroSection {
  const raw = asRecord(rawContent);
  const fallback = DEFAULT_DNA_HERO;
  return {
    title: stringValue(raw, "title", fallback.title),
    tagline: stringValue(raw, "tagline", fallback.tagline),
    quote: stringValue(raw, "quote", fallback.quote),
    reference: stringValue(raw, "reference", fallback.reference),
  };
}

function parseVision(rawContent: unknown): DnaVisionSection {
  const raw = asRecord(rawContent);
  const fallback = DEFAULT_DNA_VISION;
  return {
    ...parseHeading(raw, fallback),
    quote: stringValue(raw, "quote", fallback.quote),
  };
}

function parseFoundation(rawContent: unknown): DnaFoundationSection {
  const raw = asRecord(rawContent);
  const fallback = DEFAULT_DNA_FOUNDATION;
  const scriptures = arrayValue(raw, "scriptures").map((item, index) => {
    const record = asRecord(item);
    const fb = fallback.scriptures[index % fallback.scriptures.length] ?? fallback.scriptures[0];
    return {
      verse: stringValue(record, "verse", fb.verse),
      reference: stringValue(record, "reference", fb.reference),
    };
  });
  return {
    ...parseHeading(raw, fallback),
    scriptures: scriptures.length > 0 ? scriptures : fallback.scriptures,
    summaryEmphasis: stringValue(raw, "summaryEmphasis", fallback.summaryEmphasis),
    summaryBody: stringValue(raw, "summaryBody", fallback.summaryBody),
  };
}

function parseMission(rawContent: unknown): DnaMissionSection {
  const raw = asRecord(rawContent);
  const fallback = DEFAULT_DNA_MISSION;
  const highlights = arrayValue(raw, "highlights").filter(
    (item): item is string => typeof item === "string" && item.length > 0
  );
  return {
    ...parseHeading(raw, fallback),
    quote: stringValue(raw, "quote", fallback.quote),
    highlights: highlights.length > 0 ? highlights : fallback.highlights,
  };
}

function parseRoots(rawContent: unknown): DnaRootsSection {
  const raw = asRecord(rawContent);
  const fallback = DEFAULT_DNA_ROOTS;
  const items = arrayValue(raw, "items").map((item, index) => {
    const record = asRecord(item);
    const fb = fallback.items[index % fallback.items.length] ?? fallback.items[0];
    const iconValue = stringValue(record, "icon", fb.icon);
    return {
      title: stringValue(record, "title", fb.title),
      quote: stringValue(record, "quote", fb.quote),
      reference: stringValue(record, "reference", fb.reference),
      icon: isDnaIcon(iconValue) ? iconValue : fb.icon,
    };
  });
  return {
    ...parseHeading(raw, fallback),
    items: items.length > 0 ? items : fallback.items,
  };
}

function parseFocus(rawContent: unknown): DnaFocusSection {
  const raw = asRecord(rawContent);
  const fallback = DEFAULT_DNA_FOCUS;
  const items = arrayValue(raw, "items").map((item, index) => {
    const record = asRecord(item);
    const fb = fallback.items[index % fallback.items.length] ?? fallback.items[0];
    const iconValue = stringValue(record, "icon", fb.icon);
    return {
      title: stringValue(record, "title", fb.title),
      verse: stringValue(record, "verse", fb.verse),
      reference: stringValue(record, "reference", fb.reference),
      icon: isDnaIcon(iconValue) ? iconValue : fb.icon,
    };
  });
  return {
    ...parseHeading(raw, fallback),
    items: items.length > 0 ? items : fallback.items,
  };
}

function parseValues(rawContent: unknown): DnaValuesSection {
  const raw = asRecord(rawContent);
  const fallback = DEFAULT_DNA_VALUES;
  const items = arrayValue(raw, "items").map((item, index) => {
    const record = asRecord(item);
    const fb = fallback.items[index % fallback.items.length] ?? fallback.items[0];
    return {
      title: stringValue(record, "title", fb.title),
      description: stringValue(record, "description", fb.description),
      verse: stringValue(record, "verse", fb.verse),
      reference: stringValue(record, "reference", fb.reference),
    };
  });
  return {
    ...parseHeading(raw, fallback),
    items: items.length > 0 ? items : fallback.items,
  };
}

function parseContact(rawContent: unknown): DnaContactSection {
  const raw = asRecord(rawContent);
  const fallback = DEFAULT_DNA_CONTACT;
  return {
    heading: stringValue(raw, "heading", fallback.heading),
    email: stringValue(raw, "email", fallback.email),
    phone: stringValue(raw, "phone", fallback.phone),
    address: stringValue(raw, "address", fallback.address),
  };
}

function parseCtaSection(rawContent: unknown): DnaCtaSection {
  const raw = asRecord(rawContent);
  const fallback = DEFAULT_DNA_CTA;
  return {
    heading: stringValue(raw, "heading", fallback.heading),
    body: stringValue(raw, "body", fallback.body),
    primaryCta: parseCta(raw.primaryCta, fallback.primaryCta),
    secondaryCta: parseCta(raw.secondaryCta, fallback.secondaryCta),
  };
}

function fallbackContent(): OurDnaContent {
  return {
    hero: DEFAULT_DNA_HERO,
    vision: DEFAULT_DNA_VISION,
    foundation: DEFAULT_DNA_FOUNDATION,
    mission: DEFAULT_DNA_MISSION,
    roots: DEFAULT_DNA_ROOTS,
    focus: DEFAULT_DNA_FOCUS,
    values: DEFAULT_DNA_VALUES,
    contact: DEFAULT_DNA_CONTACT,
    cta: DEFAULT_DNA_CTA,
  };
}

let lastFailureLogged = false;

export async function getOurDnaContent(): Promise<OurDnaContent> {
  try {
    const sections = await getOrCreateManagedPage({
      slug: "our-dna",
      title: "Our DNA",
      sections: DNA_SECTION_DEFAULTS,
    });
    return {
      hero: parseHero(sectionByType(sections, "hero")),
      vision: parseVision(sectionByType(sections, "vision")),
      foundation: parseFoundation(sectionByType(sections, "foundation")),
      mission: parseMission(sectionByType(sections, "mission")),
      roots: parseRoots(sectionByType(sections, "roots")),
      focus: parseFocus(sectionByType(sections, "focus")),
      values: parseValues(sectionByType(sections, "values")),
      contact: parseContact(sectionByType(sections, "contact")),
      cta: parseCtaSection(sectionByType(sections, "cta")),
    };
  } catch (error) {
    if (!lastFailureLogged) {
      lastFailureLogged = true;
      console.warn(
        "Our DNA content unavailable — rendering defaults.",
        error instanceof Error ? error.message : error
      );
    }
    return fallbackContent();
  }
}

export async function saveOurDnaContent(content: OurDnaContent): Promise<void> {
  await getOurDnaContent();
  await saveManagedPageSections("our-dna", {
    hero: content.hero,
    vision: content.vision,
    foundation: content.foundation,
    mission: content.mission,
    roots: content.roots,
    focus: content.focus,
    values: content.values,
    contact: content.contact,
    cta: content.cta,
  });
}
