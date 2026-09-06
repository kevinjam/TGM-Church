import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import {
  EVENT_CATEGORIES,
  SERMON_CATEGORIES,
  type EventCategory,
  type SermonCategory,
} from "@/lib/db/constants";
import { saveAboutContent } from "@/lib/db/services/about";
import { saveContactPageContent } from "@/lib/db/services/contact-page";
import {
  saveHomepageContent,
  type HomeFeaturedSermon,
  type HomeFeaturedSermonSection,
  type HomeHeroCta,
  type HomeHeroSection,
  type HomeHeroSlide,
  type HomepageContent,
  type HomeUpcomingEvent,
  type HomeUpcomingEventsSection,
  type HomeWelcomeCard,
  type HomeWelcomeSection,
} from "@/lib/db/services/homepage";
import { saveOurDnaContent } from "@/lib/db/services/our-dna";
import { validateAboutPayload } from "./validate-about";
import { validateContactPagePayload } from "./validate-contact";
import { validateOurDnaPayload } from "./validate-dna";

/**
 * Content editor endpoint for the CMS-managed pages.
 *
 * Editable slugs: "home", "about", "our-dna", and "contact". The payload shape mirrors
 * each public page's props; everything is trimmed, length-capped, and
 * validated server-side — never trust the client.
 */

type InputShape = Record<string, unknown>;

const SLIDE_LIMITS = {
  maxSlides: 6,
  title: 80,
  subtitle: 160,
  tagline: 160,
  verse: 120,
  image: 2048,
  description: 1000,
} as const;

const CTA_LIMITS = { label: 80, href: 500 } as const;

const WELCOME_LIMITS = {
  heading: 200,
  tagline: 300,
  verse: 120,
  title: 200,
  body: 4000,
  paragraph: 4000,
  closing: 500,
  cardTitle: 200,
  cardDescription: 2000,
  quote: 600,
  reference: 120,
} as const;

const FEATURED_LIMITS = {
  heading: 200,
  tagline: 300,
  title: 200,
  description: 2000,
  speaker: 160,
  date: 80,
  duration: 40,
  thumbnail: 2048,
} as const;

const EVENT_LIMITS = {
  heading: 200,
  tagline: 300,
  title: 200,
  description: 2000,
  date: 10,
  time: 80,
  location: 200,
  image: 2048,
  maxEvents: 6,
} as const;

const URL_OR_PATH = /^(\/|https?:\/\/)/i;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function readObject(value: unknown): InputShape {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as InputShape)
    : {};
}

/** Reads a trimmed string field. Returns null when missing/blank or too long. */
function readText(
  input: InputShape,
  key: string,
  maxLength: number,
  { optional = false }: { optional?: boolean } = {}
): string | null {
  const value = input[key];
  if (value === undefined) {
    return optional ? "" : null;
  }
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length > maxLength) return null;
  if (!optional && trimmed.length === 0) return null;
  return trimmed;
}

function validateCta(raw: unknown): { error: string } | { data: HomeHeroCta } {
  const input = readObject(raw);
  const label = readText(input, "label", CTA_LIMITS.label);
  const href = readText(input, "href", CTA_LIMITS.href);
  if (label === null) return { error: "Button labels are required." };
  if (href === null) return { error: "Button links are required." };
  if (!URL_OR_PATH.test(href)) {
    return { error: "Button links must start with / or http(s)://" };
  }
  return { data: { label, href } };
}

function validateSlides(rawSlides: unknown): { error: string } | { data: HomeHeroSlide[] } {
  if (!Array.isArray(rawSlides) || rawSlides.length === 0) {
    return { error: "At least one hero slide is required." };
  }
  if (rawSlides.length > SLIDE_LIMITS.maxSlides) {
    return { error: `A maximum of ${SLIDE_LIMITS.maxSlides} hero slides is allowed.` };
  }

  const slides: HomeHeroSlide[] = [];
  for (let index = 0; index < rawSlides.length; index++) {
    const input = readObject(rawSlides[index]);
    const id = readText(input, "id", 100, { optional: true }) || `slide-${index + 1}`;
    const title = readText(input, "title", SLIDE_LIMITS.title);
    const subtitle = readText(input, "subtitle", SLIDE_LIMITS.subtitle);
    const tagline = readText(input, "tagline", SLIDE_LIMITS.tagline);
    const verse = readText(input, "verse", SLIDE_LIMITS.verse);
    const image = readText(input, "image", SLIDE_LIMITS.image);
    const description = readText(input, "description", SLIDE_LIMITS.description);

    if (title === null || subtitle === null || tagline === null || verse === null) {
      return { error: `Slide ${index + 1} is missing required text (title, subtitle, tagline, verse).` };
    }
    if (description === null) {
      return { error: `Slide ${index + 1} needs a description.` };
    }
    if (image === null) {
      return { error: `Slide ${index + 1} needs a background image.` };
    }
    if (!URL_OR_PATH.test(image)) {
      return { error: `Slide ${index + 1} image must be a /path or http(s):// URL.` };
    }
    slides.push({ id, title, subtitle, tagline, verse, image, description });
  }
  return { data: slides };
}

function validateStringList(raw: unknown, label: string, maxLength: number, maxItems: number): { error: string } | { data: string[] } {
  if (!Array.isArray(raw) || raw.length === 0) {
    return { error: `${label} needs at least one paragraph.` };
  }
  if (raw.length > maxItems) {
    return { error: `${label} can have at most ${maxItems} paragraphs.` };
  }
  const list: string[] = [];
  for (const item of raw) {
    if (typeof item !== "string") return { error: `${label} must be text.` };
    const trimmed = item.trim();
    if (trimmed.length === 0) return { error: `${label} cannot contain empty paragraphs.` };
    if (trimmed.length > maxLength) return { error: `${label} paragraphs are too long.` };
    list.push(trimmed);
  }
  return { data: list };
}

function validateCards(rawCards: unknown): { error: string } | { data: HomeWelcomeCard[] } {
  if (!Array.isArray(rawCards) || rawCards.length === 0) {
    return { error: "At least one welcome card is required." };
  }
  if (rawCards.length > 6) return { error: "A maximum of 6 welcome cards is allowed." };

  const cards: HomeWelcomeCard[] = [];
  for (let index = 0; index < rawCards.length; index++) {
    const input = readObject(rawCards[index]);
    const title = readText(input, "title", WELCOME_LIMITS.cardTitle);
    const description = readText(input, "description", WELCOME_LIMITS.cardDescription);
    if (title === null) return { error: `Card ${index + 1} needs a title.` };
    if (description === null) return { error: `Card ${index + 1} needs a description.` };
    cards.push({ title, description });
  }
  return { data: cards };
}

function validateWelcome(rawWelcome: unknown): { error: string } | { data: HomeWelcomeSection } {
  const input = readObject(rawWelcome);
  const foundation = readObject(input.foundation);
  const missionBox = readObject(input.missionBox);
  const unityQuote = readObject(input.unityQuote);

  const heading = readText(input, "heading", WELCOME_LIMITS.heading);
  const tagline = readText(input, "tagline", WELCOME_LIMITS.tagline);
  const verse = readText(input, "verse", WELCOME_LIMITS.verse);

  const foundationTitle = readText(foundation, "title", WELCOME_LIMITS.title);
  const foundationBody = readText(foundation, "body", WELCOME_LIMITS.body);

  const missionTitle = readText(missionBox, "title", WELCOME_LIMITS.title);
  const missionClosing = readText(missionBox, "closing", WELCOME_LIMITS.closing);
  const missionBodyResult = validateStringList(
    missionBox.body,
    "Our Mission",
    WELCOME_LIMITS.paragraph,
    6
  );

  const quote = readText(unityQuote, "quote", WELCOME_LIMITS.quote);
  const reference = readText(unityQuote, "reference", WELCOME_LIMITS.reference);
  const cardsResult = validateCards(input.cards);

  if (heading === null) return { error: "The welcome heading is required." };
  if (tagline === null) return { error: "The welcome tagline is required." };
  if (verse === null) return { error: "The welcome verse reference is required." };
  if (foundationTitle === null) return { error: "The Biblical Foundation title is required." };
  if (foundationBody === null) return { error: "The Biblical Foundation text is required." };
  if (missionTitle === null) return { error: "The Our Mission title is required." };
  if (missionClosing === null) return { error: "The Our Mission closing line is required." };
  if ("error" in missionBodyResult) return missionBodyResult;
  if ("error" in cardsResult) return cardsResult;
  if (quote === null) return { error: "The unity quote is required." };
  if (reference === null) return { error: "The unity quote reference is required." };

  return {
    data: {
      heading,
      tagline,
      verse,
      foundation: { title: foundationTitle, body: foundationBody },
      missionBox: {
        title: missionTitle,
        body: missionBodyResult.data,
        closing: missionClosing,
      },
      cards: cardsResult.data,
      unityQuote: { quote, reference },
    },
  };
}

function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function validateOptionalImage(
  input: InputShape,
  key: string,
  maxLength: number,
  label: string
): { error: string } | { data: string } {
  const image = readText(input, key, maxLength, { optional: true });
  if (image === null) return { error: `${label} image is too long.` };
  if (image && !URL_OR_PATH.test(image)) {
    return { error: `${label} image must be a /path or http(s):// URL.` };
  }
  return { data: image };
}

function validateFeaturedSermon(
  raw: unknown
): { error: string } | { data: HomeFeaturedSermonSection } {
  const input = readObject(raw);
  const sermonInput = readObject(input.sermon);

  const heading = readText(input, "heading", FEATURED_LIMITS.heading);
  const tagline = readText(input, "tagline", FEATURED_LIMITS.tagline);
  const ctaResult = validateCta(input.cta);

  const id = readText(sermonInput, "id", 100, { optional: true }) || "featured";
  const title = readText(sermonInput, "title", FEATURED_LIMITS.title);
  const description = readText(sermonInput, "description", FEATURED_LIMITS.description);
  const speaker = readText(sermonInput, "speaker", FEATURED_LIMITS.speaker);
  const date = readText(sermonInput, "date", FEATURED_LIMITS.date);
  const duration = readText(sermonInput, "duration", FEATURED_LIMITS.duration, {
    optional: true,
  });
  const thumbnailResult = validateOptionalImage(
    sermonInput,
    "thumbnail",
    FEATURED_LIMITS.thumbnail,
    "Featured sermon"
  );

  const categoryRaw = readText(sermonInput, "category", 80);
  if (heading === null) return { error: "The featured sermon heading is required." };
  if (tagline === null) return { error: "The featured sermon tagline is required." };
  if ("error" in ctaResult) return ctaResult;
  if (title === null) return { error: "The featured sermon needs a title." };
  if (description === null) return { error: "The featured sermon needs a description." };
  if (speaker === null) return { error: "The featured sermon needs a speaker." };
  if (date === null) return { error: "The featured sermon needs a date." };
  if (duration === null) return { error: "The featured sermon duration is too long." };
  if ("error" in thumbnailResult) return thumbnailResult;
  if (categoryRaw === null || !(SERMON_CATEGORIES as readonly string[]).includes(categoryRaw)) {
    return { error: "The featured sermon needs a valid category." };
  }

  const sermon: HomeFeaturedSermon = {
    id,
    title,
    description,
    speaker,
    date,
    category: categoryRaw as SermonCategory,
    duration,
    thumbnail: thumbnailResult.data,
  };

  return { data: { heading, tagline, cta: ctaResult.data, sermon } };
}

function validateUpcomingEvents(
  raw: unknown
): { error: string } | { data: HomeUpcomingEventsSection } {
  const input = readObject(raw);
  const heading = readText(input, "heading", EVENT_LIMITS.heading);
  const tagline = readText(input, "tagline", EVENT_LIMITS.tagline);
  const ctaResult = validateCta(input.cta);

  if (heading === null) return { error: "The upcoming events heading is required." };
  if (tagline === null) return { error: "The upcoming events tagline is required." };
  if ("error" in ctaResult) return ctaResult;

  if (!Array.isArray(input.events) || input.events.length === 0) {
    return { error: "At least one upcoming event is required." };
  }
  if (input.events.length > EVENT_LIMITS.maxEvents) {
    return { error: `A maximum of ${EVENT_LIMITS.maxEvents} upcoming events is allowed.` };
  }

  const events: HomeUpcomingEvent[] = [];
  for (let index = 0; index < input.events.length; index++) {
    const eventInput = readObject(input.events[index]);
    const n = index + 1;
    const id = readText(eventInput, "id", 100, { optional: true }) || `event-${n}`;
    const title = readText(eventInput, "title", EVENT_LIMITS.title);
    const description = readText(eventInput, "description", EVENT_LIMITS.description);
    const date = readText(eventInput, "date", EVENT_LIMITS.date);
    const time = readText(eventInput, "time", EVENT_LIMITS.time);
    const location = readText(eventInput, "location", EVENT_LIMITS.location);
    const categoryRaw = readText(eventInput, "category", 80);
    const imageResult = validateOptionalImage(
      eventInput,
      "image",
      EVENT_LIMITS.image,
      `Event ${n}`
    );

    if (title === null) return { error: `Event ${n} needs a title.` };
    if (description === null) return { error: `Event ${n} needs a description.` };
    if (date === null || !isValidIsoDate(date)) {
      return { error: `Event ${n} needs a valid date.` };
    }
    if (time === null) return { error: `Event ${n} needs a time.` };
    if (location === null) return { error: `Event ${n} needs a location.` };
    if (categoryRaw === null || !(EVENT_CATEGORIES as readonly string[]).includes(categoryRaw)) {
      return { error: `Event ${n} needs a valid category.` };
    }
    if ("error" in imageResult) return imageResult;

    events.push({
      id,
      title,
      description,
      date,
      time,
      location,
      category: categoryRaw as EventCategory,
      image: imageResult.data,
    });
  }

  return { data: { heading, tagline, cta: ctaResult.data, events } };
}

function validatePayload(body: unknown): { error: string } | { data: HomepageContent } {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { error: "Invalid request body." };
  }
  const input = body as InputShape;
  const hero = readObject(input.hero);

  const slidesResult = validateSlides(hero.slides);
  const primaryCtaResult = validateCta(hero.primaryCta);
  const secondaryCtaResult = validateCta(hero.secondaryCta);
  const welcomeResult = validateWelcome(input.welcome);
  const featuredResult = validateFeaturedSermon(input.featuredSermon);
  const eventsResult = validateUpcomingEvents(input.upcomingEvents);

  if ("error" in slidesResult) return slidesResult;
  if ("error" in primaryCtaResult) return primaryCtaResult;
  if ("error" in secondaryCtaResult) return secondaryCtaResult;
  if ("error" in welcomeResult) return welcomeResult;
  if ("error" in featuredResult) return featuredResult;
  if ("error" in eventsResult) return eventsResult;

  const heroSection: HomeHeroSection = {
    slides: slidesResult.data,
    primaryCta: primaryCtaResult.data,
    secondaryCta: secondaryCtaResult.data,
  };

  return {
    data: {
      hero: heroSection,
      welcome: welcomeResult.data,
      featuredSermon: featuredResult.data,
      upcomingEvents: eventsResult.data,
    },
  };
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { slug } = await params;
  if (slug !== "home" && slug !== "about" && slug !== "our-dna" && slug !== "contact") {
    return NextResponse.json(
      { error: "This page is not editable yet." },
      { status: 400 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  try {
    if (slug === "about") {
      const result = validateAboutPayload(body);
      if ("error" in result) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      await saveAboutContent(result.data);
      return NextResponse.json({ ok: true, content: result.data });
    }

    if (slug === "our-dna") {
      const result = validateOurDnaPayload(body);
      if ("error" in result) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      await saveOurDnaContent(result.data);
      return NextResponse.json({ ok: true, content: result.data });
    }

    if (slug === "contact") {
      const result = validateContactPagePayload(body);
      if ("error" in result) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      await saveContactPageContent(result.data);
      return NextResponse.json({ ok: true, content: result.data });
    }

    const result = validatePayload(body);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    await saveHomepageContent(result.data);
    return NextResponse.json({ ok: true, content: result.data });
  } catch (error) {
    console.error(`Saving ${slug} content failed:`, error);
    return NextResponse.json(
      { error: "Unable to save changes. Please try again." },
      { status: 500 }
    );
  }
}
