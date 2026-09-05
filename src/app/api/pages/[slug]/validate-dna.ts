import {
  DNA_ICONS,
  type DnaFocusItem,
  type DnaIcon,
  type DnaIconItem,
  type DnaScripture,
  type DnaValueItem,
  type OurDnaContent,
} from "@/lib/db/services/our-dna";
import {
  EMAIL_PATTERN,
  readObject,
  readText,
  validateCta,
} from "./page-validation";

const LIMITS = {
  title: 200,
  tagline: 300,
  heading: 200,
  subtitle: 300,
  quote: 2000,
  reference: 120,
  verse: 2000,
  body: 4000,
  emphasis: 200,
  highlight: 40,
  email: 254,
  phone: 40,
  address: 250,
  description: 1000,
  maxScriptures: 6,
  maxRoots: 6,
  maxFocus: 6,
  maxValues: 8,
  maxHighlights: 12,
} as const;

function readIcon(input: ReturnType<typeof readObject>, label: string): { error: string } | { data: DnaIcon } {
  const icon = readText(input, "icon", 40);
  if (icon === null || !(DNA_ICONS as readonly string[]).includes(icon)) {
    return { error: `${label} needs a valid icon.` };
  }
  return { data: icon as DnaIcon };
}

export function validateOurDnaPayload(body: unknown): { error: string } | { data: OurDnaContent } {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { error: "Invalid request body." };
  }
  const input = readObject(body);

  const heroInput = readObject(input.hero);
  const heroTitle = readText(heroInput, "title", LIMITS.title);
  const heroTagline = readText(heroInput, "tagline", LIMITS.tagline);
  const heroQuote = readText(heroInput, "quote", LIMITS.quote);
  const heroReference = readText(heroInput, "reference", LIMITS.reference);
  if (heroTitle === null) return { error: "The Our DNA heading is required." };
  if (heroTagline === null) return { error: "The Our DNA tagline is required." };
  if (heroQuote === null) return { error: "The Our DNA verse quote is required." };
  if (heroReference === null) return { error: "The Our DNA verse reference is required." };

  const visionInput = readObject(input.vision);
  const visionHeading = readText(visionInput, "heading", LIMITS.heading);
  const visionSubtitle = readText(visionInput, "subtitle", LIMITS.subtitle);
  const visionQuote = readText(visionInput, "quote", LIMITS.quote);
  if (visionHeading === null) return { error: "The Vision heading is required." };
  if (visionSubtitle === null) return { error: "The Vision subtitle is required." };
  if (visionQuote === null) return { error: "The Vision quote is required." };

  const foundationInput = readObject(input.foundation);
  const foundationHeading = readText(foundationInput, "heading", LIMITS.heading);
  const foundationSubtitle = readText(foundationInput, "subtitle", LIMITS.subtitle);
  const summaryEmphasis = readText(foundationInput, "summaryEmphasis", LIMITS.emphasis);
  const summaryBody = readText(foundationInput, "summaryBody", LIMITS.body);
  if (foundationHeading === null) return { error: "The Biblical Foundation heading is required." };
  if (foundationSubtitle === null) return { error: "The Biblical Foundation subtitle is required." };
  if (summaryEmphasis === null) return { error: "The foundation summary emphasis is required." };
  if (summaryBody === null) return { error: "The foundation summary text is required." };
  if (!Array.isArray(foundationInput.scriptures) || foundationInput.scriptures.length === 0) {
    return { error: "At least one foundation scripture is required." };
  }
  if (foundationInput.scriptures.length > LIMITS.maxScriptures) {
    return { error: `A maximum of ${LIMITS.maxScriptures} foundation scriptures is allowed.` };
  }
  const scriptures: DnaScripture[] = [];
  for (let index = 0; index < foundationInput.scriptures.length; index++) {
    const item = readObject(foundationInput.scriptures[index]);
    const verse = readText(item, "verse", LIMITS.verse);
    const reference = readText(item, "reference", LIMITS.reference);
    if (verse === null) return { error: `Foundation scripture ${index + 1} needs a verse.` };
    if (reference === null) return { error: `Foundation scripture ${index + 1} needs a reference.` };
    scriptures.push({ verse, reference });
  }

  const missionInput = readObject(input.mission);
  const missionHeading = readText(missionInput, "heading", LIMITS.heading);
  const missionSubtitle = readText(missionInput, "subtitle", LIMITS.subtitle);
  const missionQuote = readText(missionInput, "quote", LIMITS.quote);
  if (missionHeading === null) return { error: "The Mission heading is required." };
  if (missionSubtitle === null) return { error: "The Mission subtitle is required." };
  if (missionQuote === null) return { error: "The Mission quote is required." };
  if (!Array.isArray(missionInput.highlights) || missionInput.highlights.length === 0) {
    return { error: "At least one highlighted mission word is required." };
  }
  if (missionInput.highlights.length > LIMITS.maxHighlights) {
    return { error: `A maximum of ${LIMITS.maxHighlights} highlighted words is allowed.` };
  }
  const highlights: string[] = [];
  for (const item of missionInput.highlights) {
    if (typeof item !== "string" || !item.trim()) {
      return { error: "Highlighted words cannot be empty." };
    }
    if (item.trim().length > LIMITS.highlight) {
      return { error: "A highlighted word is too long." };
    }
    highlights.push(item.trim());
  }

  const rootsInput = readObject(input.roots);
  const rootsHeading = readText(rootsInput, "heading", LIMITS.heading);
  const rootsSubtitle = readText(rootsInput, "subtitle", LIMITS.subtitle);
  if (rootsHeading === null) return { error: "The Biblical Roots heading is required." };
  if (rootsSubtitle === null) return { error: "The Biblical Roots subtitle is required." };
  if (!Array.isArray(rootsInput.items) || rootsInput.items.length === 0) {
    return { error: "At least one biblical root is required." };
  }
  if (rootsInput.items.length > LIMITS.maxRoots) {
    return { error: `A maximum of ${LIMITS.maxRoots} biblical roots is allowed.` };
  }
  const roots: DnaIconItem[] = [];
  for (let index = 0; index < rootsInput.items.length; index++) {
    const item = readObject(rootsInput.items[index]);
    const title = readText(item, "title", LIMITS.title);
    const quote = readText(item, "quote", LIMITS.quote);
    const reference = readText(item, "reference", LIMITS.reference);
    const icon = readIcon(item, `Biblical root ${index + 1}`);
    if (title === null) return { error: `Biblical root ${index + 1} needs a title.` };
    if (quote === null) return { error: `Biblical root ${index + 1} needs a quote.` };
    if (reference === null) return { error: `Biblical root ${index + 1} needs a reference.` };
    if ("error" in icon) return icon;
    roots.push({ title, quote, reference, icon: icon.data });
  }

  const focusInput = readObject(input.focus);
  const focusHeading = readText(focusInput, "heading", LIMITS.heading);
  const focusSubtitle = readText(focusInput, "subtitle", LIMITS.subtitle);
  if (focusHeading === null) return { error: "The Focus Areas heading is required." };
  if (focusSubtitle === null) return { error: "The Focus Areas subtitle is required." };
  if (!Array.isArray(focusInput.items) || focusInput.items.length === 0) {
    return { error: "At least one focus area is required." };
  }
  if (focusInput.items.length > LIMITS.maxFocus) {
    return { error: `A maximum of ${LIMITS.maxFocus} focus areas is allowed.` };
  }
  const focusItems: DnaFocusItem[] = [];
  for (let index = 0; index < focusInput.items.length; index++) {
    const item = readObject(focusInput.items[index]);
    const title = readText(item, "title", LIMITS.title);
    const verse = readText(item, "verse", LIMITS.verse);
    const reference = readText(item, "reference", LIMITS.reference);
    const icon = readIcon(item, `Focus area ${index + 1}`);
    if (title === null) return { error: `Focus area ${index + 1} needs a title.` };
    if (verse === null) return { error: `Focus area ${index + 1} needs a verse.` };
    if (reference === null) return { error: `Focus area ${index + 1} needs a reference.` };
    if ("error" in icon) return icon;
    focusItems.push({ title, verse, reference, icon: icon.data });
  }

  const valuesInput = readObject(input.values);
  const valuesHeading = readText(valuesInput, "heading", LIMITS.heading);
  const valuesSubtitle = readText(valuesInput, "subtitle", LIMITS.subtitle);
  if (valuesHeading === null) return { error: "The Core Values heading is required." };
  if (valuesSubtitle === null) return { error: "The Core Values subtitle is required." };
  if (!Array.isArray(valuesInput.items) || valuesInput.items.length === 0) {
    return { error: "At least one core value is required." };
  }
  if (valuesInput.items.length > LIMITS.maxValues) {
    return { error: `A maximum of ${LIMITS.maxValues} core values is allowed.` };
  }
  const values: DnaValueItem[] = [];
  for (let index = 0; index < valuesInput.items.length; index++) {
    const item = readObject(valuesInput.items[index]);
    const title = readText(item, "title", LIMITS.title);
    const description = readText(item, "description", LIMITS.description);
    const verse = readText(item, "verse", LIMITS.verse);
    const reference = readText(item, "reference", LIMITS.reference);
    if (title === null) return { error: `Core value ${index + 1} needs a title.` };
    if (description === null) return { error: `Core value ${index + 1} needs a description.` };
    if (verse === null) return { error: `Core value ${index + 1} needs a verse.` };
    if (reference === null) return { error: `Core value ${index + 1} needs a reference.` };
    values.push({ title, description, verse, reference });
  }

  const contactInput = readObject(input.contact);
  const contactHeading = readText(contactInput, "heading", LIMITS.heading);
  const email = readText(contactInput, "email", LIMITS.email);
  const phone = readText(contactInput, "phone", LIMITS.phone);
  const address = readText(contactInput, "address", LIMITS.address);
  if (contactHeading === null) return { error: "The contact heading is required." };
  if (email === null || !EMAIL_PATTERN.test(email)) {
    return { error: "A valid contact email is required." };
  }
  if (phone === null) return { error: "The contact phone is required." };
  if (address === null) return { error: "The contact address is required." };

  const ctaInput = readObject(input.cta);
  const ctaHeading = readText(ctaInput, "heading", LIMITS.heading);
  const ctaBody = readText(ctaInput, "body", LIMITS.body);
  const primaryCta = validateCta(ctaInput.primaryCta);
  const secondaryCta = validateCta(ctaInput.secondaryCta);
  if (ctaHeading === null) return { error: "The Our DNA call-to-action heading is required." };
  if (ctaBody === null) return { error: "The Our DNA call-to-action text is required." };
  if ("error" in primaryCta) return primaryCta;
  if ("error" in secondaryCta) return secondaryCta;

  return {
    data: {
      hero: { title: heroTitle, tagline: heroTagline, quote: heroQuote, reference: heroReference },
      vision: { heading: visionHeading, subtitle: visionSubtitle, quote: visionQuote },
      foundation: {
        heading: foundationHeading,
        subtitle: foundationSubtitle,
        scriptures,
        summaryEmphasis,
        summaryBody,
      },
      mission: {
        heading: missionHeading,
        subtitle: missionSubtitle,
        quote: missionQuote,
        highlights,
      },
      roots: { heading: rootsHeading, subtitle: rootsSubtitle, items: roots },
      focus: { heading: focusHeading, subtitle: focusSubtitle, items: focusItems },
      values: { heading: valuesHeading, subtitle: valuesSubtitle, items: values },
      contact: { heading: contactHeading, email, phone, address },
      cta: {
        heading: ctaHeading,
        body: ctaBody,
        primaryCta: primaryCta.data,
        secondaryCta: secondaryCta.data,
      },
    },
  };
}
