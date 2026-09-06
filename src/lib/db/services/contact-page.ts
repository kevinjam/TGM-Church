import {
  asRecord,
  getOrCreateManagedPage,
  parseCta,
  saveManagedPageSections,
  sectionByType,
  stringValue,
  type PageCta,
  type PageSectionSeed,
} from "@/lib/db/services/cms-shared";

/**
 * Contact page CMS service.
 *
 * Defaults reproduce the current hardcoded Contact page so the public site
 * looks identical before any administrator edits content. The message form
 * still posts to /api/contact; this document only stores the page copy.
 */

export interface ContactHeroSection {
  title: string;
  subtitle: string;
}

export interface ContactFormSection {
  title: string;
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  messagePlaceholder: string;
  submitLabel: string;
  sendingLabel: string;
  successMessage: string;
}

export interface ContactDetailsSection {
  title: string;
  addressLabel: string;
  address: string;
  phoneLabel: string;
  phone: string;
  emailLabel: string;
  email: string;
  serviceTimesLabel: string;
  serviceTimes: string;
}

export interface ContactSocialSection {
  title: string;
  facebook: string;
  instagram: string;
  youtube: string;
}

export interface ContactMapSection {
  title: string;
  heading: string;
  subtitle: string;
}

export interface ContactPrayerSection {
  heading: string;
  body: string;
  cta: PageCta;
}

export interface ContactPageContent {
  hero: ContactHeroSection;
  form: ContactFormSection;
  details: ContactDetailsSection;
  social: ContactSocialSection;
  map: ContactMapSection;
  prayer: ContactPrayerSection;
}

export const DEFAULT_CONTACT_HERO: ContactHeroSection = {
  title: "Contact Us",
  subtitle: "We'd love to hear from you and welcome you to our community",
};

export const DEFAULT_CONTACT_FORM: ContactFormSection = {
  title: "Send us a Message",
  nameLabel: "Name",
  emailLabel: "Email",
  messageLabel: "Message",
  namePlaceholder: "Your full name",
  emailPlaceholder: "your.email@example.com",
  messagePlaceholder: "Tell us how we can help you...",
  submitLabel: "Send Message",
  sendingLabel: "Sending...",
  successMessage: "Thank you. We received your message and will get back to you soon.",
};

export const DEFAULT_CONTACT_DETAILS: ContactDetailsSection = {
  title: "Get in Touch",
  addressLabel: "Address",
  address: "Wakiso Nakawuka, Uganda",
  phoneLabel: "Phone",
  phone: "+256 703 390633",
  emailLabel: "Email",
  email: "info@tgmchurch.org",
  serviceTimesLabel: "Service Times",
  serviceTimes: "Sundays at 10:00 AM",
};

export const DEFAULT_CONTACT_SOCIAL: ContactSocialSection = {
  title: "Follow Us",
  facebook: "",
  instagram: "",
  youtube: "",
};

export const DEFAULT_CONTACT_MAP: ContactMapSection = {
  title: "Find Us",
  heading: "Google Maps Integration",
  subtitle: "Wakiso Nakawuka, Uganda",
};

export const DEFAULT_CONTACT_PRAYER: ContactPrayerSection = {
  heading: "Prayer Requests",
  body: "We believe in the power of prayer. If you have a prayer request or need spiritual support, we're here for you.",
  cta: { label: "Submit Prayer Request", href: "mailto:prayer@tgmchurch.org" },
};

const CONTACT_SECTION_DEFAULTS: PageSectionSeed[] = [
  { id: "hero", type: "hero", order: 0, content: DEFAULT_CONTACT_HERO },
  { id: "form", type: "form", order: 1, content: DEFAULT_CONTACT_FORM },
  { id: "details", type: "details", order: 2, content: DEFAULT_CONTACT_DETAILS },
  { id: "social", type: "social", order: 3, content: DEFAULT_CONTACT_SOCIAL },
  { id: "map", type: "map", order: 4, content: DEFAULT_CONTACT_MAP },
  { id: "prayer", type: "prayer", order: 5, content: DEFAULT_CONTACT_PRAYER },
];

function parseHero(rawContent: unknown): ContactHeroSection {
  const raw = asRecord(rawContent);
  return {
    title: stringValue(raw, "title", DEFAULT_CONTACT_HERO.title),
    subtitle: stringValue(raw, "subtitle", DEFAULT_CONTACT_HERO.subtitle),
  };
}

function parseForm(rawContent: unknown): ContactFormSection {
  const raw = asRecord(rawContent);
  const fallback = DEFAULT_CONTACT_FORM;
  return {
    title: stringValue(raw, "title", fallback.title),
    nameLabel: stringValue(raw, "nameLabel", fallback.nameLabel),
    emailLabel: stringValue(raw, "emailLabel", fallback.emailLabel),
    messageLabel: stringValue(raw, "messageLabel", fallback.messageLabel),
    namePlaceholder: stringValue(raw, "namePlaceholder", fallback.namePlaceholder),
    emailPlaceholder: stringValue(raw, "emailPlaceholder", fallback.emailPlaceholder),
    messagePlaceholder: stringValue(raw, "messagePlaceholder", fallback.messagePlaceholder),
    submitLabel: stringValue(raw, "submitLabel", fallback.submitLabel),
    sendingLabel: stringValue(raw, "sendingLabel", fallback.sendingLabel),
    successMessage: stringValue(raw, "successMessage", fallback.successMessage),
  };
}

function parseDetails(rawContent: unknown): ContactDetailsSection {
  const raw = asRecord(rawContent);
  const fallback = DEFAULT_CONTACT_DETAILS;
  return {
    title: stringValue(raw, "title", fallback.title),
    addressLabel: stringValue(raw, "addressLabel", fallback.addressLabel),
    address: stringValue(raw, "address", fallback.address),
    phoneLabel: stringValue(raw, "phoneLabel", fallback.phoneLabel),
    phone: stringValue(raw, "phone", fallback.phone),
    emailLabel: stringValue(raw, "emailLabel", fallback.emailLabel),
    email: stringValue(raw, "email", fallback.email),
    serviceTimesLabel: stringValue(raw, "serviceTimesLabel", fallback.serviceTimesLabel),
    serviceTimes: stringValue(raw, "serviceTimes", fallback.serviceTimes),
  };
}

function parseSocial(rawContent: unknown): ContactSocialSection {
  const raw = asRecord(rawContent);
  const fallback = DEFAULT_CONTACT_SOCIAL;
  return {
    title: stringValue(raw, "title", fallback.title),
    facebook: stringValue(raw, "facebook", fallback.facebook),
    instagram: stringValue(raw, "instagram", fallback.instagram),
    youtube: stringValue(raw, "youtube", fallback.youtube),
  };
}

function parseMap(rawContent: unknown): ContactMapSection {
  const raw = asRecord(rawContent);
  return {
    title: stringValue(raw, "title", DEFAULT_CONTACT_MAP.title),
    heading: stringValue(raw, "heading", DEFAULT_CONTACT_MAP.heading),
    subtitle: stringValue(raw, "subtitle", DEFAULT_CONTACT_MAP.subtitle),
  };
}

function parsePrayer(rawContent: unknown): ContactPrayerSection {
  const raw = asRecord(rawContent);
  return {
    heading: stringValue(raw, "heading", DEFAULT_CONTACT_PRAYER.heading),
    body: stringValue(raw, "body", DEFAULT_CONTACT_PRAYER.body),
    cta: parseCta(raw.cta, DEFAULT_CONTACT_PRAYER.cta),
  };
}

function fallbackContent(): ContactPageContent {
  return {
    hero: DEFAULT_CONTACT_HERO,
    form: DEFAULT_CONTACT_FORM,
    details: DEFAULT_CONTACT_DETAILS,
    social: DEFAULT_CONTACT_SOCIAL,
    map: DEFAULT_CONTACT_MAP,
    prayer: DEFAULT_CONTACT_PRAYER,
  };
}

let lastFailureLogged = false;

export async function getContactPageContent(): Promise<ContactPageContent> {
  try {
    const sections = await getOrCreateManagedPage({
      slug: "contact",
      title: "Contact",
      sections: CONTACT_SECTION_DEFAULTS,
    });
    return {
      hero: parseHero(sectionByType(sections, "hero")),
      form: parseForm(sectionByType(sections, "form")),
      details: parseDetails(sectionByType(sections, "details")),
      social: parseSocial(sectionByType(sections, "social")),
      map: parseMap(sectionByType(sections, "map")),
      prayer: parsePrayer(sectionByType(sections, "prayer")),
    };
  } catch (error) {
    if (!lastFailureLogged) {
      lastFailureLogged = true;
      console.warn(
        "Contact page content unavailable — rendering defaults.",
        error instanceof Error ? error.message : error
      );
    }
    return fallbackContent();
  }
}

export async function saveContactPageContent(content: ContactPageContent): Promise<void> {
  await getContactPageContent();
  await saveManagedPageSections("contact", {
    hero: content.hero,
    form: content.form,
    details: content.details,
    social: content.social,
    map: content.map,
    prayer: content.prayer,
  });
}
