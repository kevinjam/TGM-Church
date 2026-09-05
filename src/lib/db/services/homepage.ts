import { connectToDatabase, PageModel } from "@/lib/db";
import {
  EVENT_CATEGORIES,
  SERMON_CATEGORIES,
  type EventCategory,
  type SermonCategory,
} from "@/lib/db/constants";

/**
 * Homepage content service.
 *
 * The homepage lives as a single "page" document (slug: "home") whose
 * `sections` mirror the existing homepage components (hero, welcome,
 * featured-sermon, upcoming-events). Defaults reproduce the current
 * hardcoded homepage exactly, so the public site looks identical before
 * any administrator edits content.
 */

export interface HomeHeroCta {
  label: string;
  href: string;
}

export interface HomeHeroSlide {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  verse: string;
  image: string;
  description: string;
}

export interface HomeHeroSection {
  slides: HomeHeroSlide[];
  primaryCta: HomeHeroCta;
  secondaryCta: HomeHeroCta;
}

export interface HomeWelcomeCard {
  title: string;
  description: string;
}

export interface HomeWelcomeSection {
  heading: string;
  tagline: string;
  verse: string;
  foundation: {
    title: string;
    body: string;
  };
  missionBox: {
    title: string;
    body: string[];
    closing: string;
  };
  cards: HomeWelcomeCard[];
  unityQuote: {
    quote: string;
    reference: string;
  };
}

export interface HomeFeaturedSermon {
  id: string;
  title: string;
  description: string;
  speaker: string;
  date: string;
  category: SermonCategory;
  duration: string;
  thumbnail: string;
}

export interface HomeFeaturedSermonSection {
  heading: string;
  tagline: string;
  cta: HomeHeroCta;
  sermon: HomeFeaturedSermon;
}

export interface HomeUpcomingEvent {
  id: string;
  title: string;
  description: string;
  /** Calendar date as YYYY-MM-DD (timezone-safe for admin date inputs). */
  date: string;
  time: string;
  location: string;
  category: EventCategory;
  image: string;
}

export interface HomeUpcomingEventsSection {
  heading: string;
  tagline: string;
  cta: HomeHeroCta;
  events: HomeUpcomingEvent[];
}

export const DEFAULT_HERO_SECTION: HomeHeroSection = {
  slides: [
    {
      id: "slide-1",
      title: "TGM",
      subtitle: "The Gospel Mission",
      tagline: "Connecting Hearts to His Grace",
      verse: "Hebrews 4:16",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=900&q=80",
      description:
        "Experience the power of God's Word through dynamic worship and biblical teaching.",
    },
    {
      id: "slide-2",
      title: "TGM",
      subtitle: "The Gospel Mission",
      tagline: "Building Kingdom Communities",
      verse: "Matthew 6:10",
      image:
        "https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=900&q=80",
      description: "Join us in advancing God's Kingdom through faith, hope, and love.",
    },
    {
      id: "slide-3",
      title: "TGM",
      subtitle: "The Gospel Mission",
      tagline: "Transforming Lives Through Grace",
      verse: "Ephesians 2:8",
      image:
        "https://images.unsplash.com/photo-1472905981516-5ac09f35b7f4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&h=900&q=80",
      description:
        "Discover your purpose and calling in Christ through our vibrant community.",
    },
  ],
  primaryCta: { label: "Learn More", href: "/about" },
  secondaryCta: { label: "Watch Sermons", href: "/sermons" },
};

export const DEFAULT_WELCOME_SECTION: HomeWelcomeSection = {
  heading: "THRONE OF GRACE MINISTRIES",
  tagline: "Connecting Hearts to His Grace",
  verse: "Hebrews 4:16",
  foundation: {
    title: "Biblical Foundation",
    body:
      "At Throne of Grace Ministries, we are honored to walk in the footsteps of biblical brothers " +
      "who ministered together in unity and purpose—like Peter and Andrew who dropped their nets to " +
      "follow Christ side by side, James and John whose fiery zeal was refined into humble service, " +
      "and Moses and Aaron who complemented each other's gifts to lead God's people.",
  },
  missionBox: {
    title: "Our Mission",
    body: [
      "Just as these brothers partnered in prayer, preaching, and perseverance, our team is united " +
        "by the same Spirit to boldly approach God's throne of grace (Hebrews 4:16) and extend " +
        "His mercy to the world.",
      "Together, we celebrate our differences, cover one another in prayer, and commit to the shared " +
        "mission of making disciples—because “how good and pleasant it is when brothers dwell " +
        "together in unity!” (Psalm 133:1).",
    ],
    closing: "Join us as we continue this legacy of faithful partnership for God's glory.",
  },
  cards: [
    {
      title: "Our Mission",
      description:
        "To extend God's mercy to the world and build a community rooted in prayer, " +
        "unity, and discipleship (Psalm 133:1).",
    },
    {
      title: "Our Community",
      description:
        "We believe in the power of unity and fellowship. Join us as we grow together " +
        "in faith and support one another in our spiritual journey.",
    },
    {
      title: "Our Foundation",
      description:
        "Grounded in the Word of God, we seek to live out our faith with authenticity " +
        "and share the love of Christ with everyone we meet.",
    },
  ],
  unityQuote: {
    quote: "How good and pleasant it is when brothers dwell together in unity!",
    reference: "Psalm 133:1",
  },
};

export const DEFAULT_FEATURED_SERMON_SECTION: HomeFeaturedSermonSection = {
  heading: "Featured Sermon",
  tagline: "Join us in worship and learning from God's Word",
  cta: { label: "View All Sermons", href: "/sermons" },
  sermon: {
    id: "1",
    title: "Walking in Grace",
    description:
      "Discover how to walk daily in the grace of God and experience His transforming power in your life.",
    speaker: "Pastor Joseph Kinene",
    date: "October 15, 2024",
    category: "Sunday Service",
    duration: "45:30",
    thumbnail: "",
  },
};

export const DEFAULT_UPCOMING_EVENTS_SECTION: HomeUpcomingEventsSection = {
  heading: "Upcoming Events",
  tagline: "Join us for worship, fellowship, and community events",
  cta: { label: "View All Events", href: "/events" },
  events: [
    {
      id: "1",
      title: "Sunday Service",
      description:
        "Join us for our weekly Sunday worship service. We gather to praise God, hear His word, and fellowship together.",
      date: "2024-01-21",
      time: "10:00 AM",
      location: "TGM Church, Wakiso Nakawuka",
      category: "Worship",
      image: "",
    },
    {
      id: "2",
      title: "Youth Conference 2024",
      description:
        "A powerful conference for young people to grow in their faith and connect with God and each other.",
      date: "2024-02-15",
      time: "9:00 AM - 5:00 PM",
      location: "TGM Church, Wakiso Nakawuka",
      category: "Special",
      image: "",
    },
    {
      id: "3",
      title: "Community Outreach",
      description:
        "Join us as we reach out to our community with love, hope, and practical assistance.",
      date: "2024-01-28",
      time: "8:00 AM - 2:00 PM",
      location: "Nakawuka Community Center",
      category: "Outreach",
      image: "",
    },
  ],
};

const HOMEPAGE_SECTION_DEFAULTS = [
  { id: "hero", type: "hero", order: 0, content: DEFAULT_HERO_SECTION },
  { id: "welcome", type: "welcome", order: 1, content: DEFAULT_WELCOME_SECTION },
  {
    id: "featured-sermon",
    type: "featured-sermon",
    order: 2,
    content: DEFAULT_FEATURED_SERMON_SECTION,
  },
  {
    id: "upcoming-events",
    type: "upcoming-events",
    order: 3,
    content: DEFAULT_UPCOMING_EVENTS_SECTION,
  },
] as const;

/* ------------------------------------------------------------------ */
/* Runtime parsing — unknown DB content is normalized field-by-field    */
/* against the defaults, so partial or legacy documents still render.   */
/* ------------------------------------------------------------------ */

type AnyRecord = Record<string, unknown>;

function asRecord(value: unknown): AnyRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as AnyRecord)
    : {};
}

function stringValue(record: AnyRecord, key: string, fallback: string): string {
  const value = record[key];
  return typeof value === "string" ? value : fallback;
}

function arrayValue(record: AnyRecord, key: string): unknown[] {
  return Array.isArray(record[key]) ? (record[key] as unknown[]) : [];
}

function parseCta(raw: unknown, fallback: HomeHeroCta): HomeHeroCta {
  const record = asRecord(raw);
  return {
    label: stringValue(record, "label", fallback.label),
    href: stringValue(record, "href", fallback.href),
  };
}

function parseHero(rawContent: unknown): HomeHeroSection {
  const raw = asRecord(rawContent);
  const rawSlides = arrayValue(raw, "slides");
  const fallbackSlides = DEFAULT_HERO_SECTION.slides;

  const slides = rawSlides.map((slide, index) => {
    const record = asRecord(slide);
    const fallback = fallbackSlides[index % fallbackSlides.length] ?? fallbackSlides[0];
    return {
      id: stringValue(record, "id", fallback.id),
      title: stringValue(record, "title", fallback.title),
      subtitle: stringValue(record, "subtitle", fallback.subtitle),
      tagline: stringValue(record, "tagline", fallback.tagline),
      verse: stringValue(record, "verse", fallback.verse),
      image: stringValue(record, "image", fallback.image),
      description: stringValue(record, "description", fallback.description),
    };
  });

  return {
    slides: slides.length > 0 ? slides : fallbackSlides,
    primaryCta: parseCta(raw.primaryCta, DEFAULT_HERO_SECTION.primaryCta),
    secondaryCta: parseCta(raw.secondaryCta, DEFAULT_HERO_SECTION.secondaryCta),
  };
}

function parseWelcome(rawContent: unknown): HomeWelcomeSection {
  const raw = asRecord(rawContent);
  const fallback = DEFAULT_WELCOME_SECTION;

  const foundation = asRecord(raw.foundation);
  const missionBox = asRecord(raw.missionBox);
  const unityQuote = asRecord(raw.unityQuote);

  const body = arrayValue(missionBox, "body")
    .filter((item): item is string => typeof item === "string" && item.length > 0);
  const cards = arrayValue(raw, "cards").map((card, index) => {
    const record = asRecord(card);
    const fb = fallback.cards[index % fallback.cards.length] ?? fallback.cards[0];
    return {
      title: stringValue(record, "title", fb.title),
      description: stringValue(record, "description", fb.description),
    };
  });

  return {
    heading: stringValue(raw, "heading", fallback.heading),
    tagline: stringValue(raw, "tagline", fallback.tagline),
    verse: stringValue(raw, "verse", fallback.verse),
    foundation: {
      title: stringValue(foundation, "title", fallback.foundation.title),
      body: stringValue(foundation, "body", fallback.foundation.body),
    },
    missionBox: {
      title: stringValue(missionBox, "title", fallback.missionBox.title),
      body: body.length > 0 ? body : fallback.missionBox.body,
      closing: stringValue(missionBox, "closing", fallback.missionBox.closing),
    },
    cards: cards.length > 0 ? cards : fallback.cards,
    unityQuote: {
      quote: stringValue(unityQuote, "quote", fallback.unityQuote.quote),
      reference: stringValue(unityQuote, "reference", fallback.unityQuote.reference),
    },
  };
}

function isSermonCategory(value: string): value is SermonCategory {
  return (SERMON_CATEGORIES as readonly string[]).includes(value);
}

function isEventCategory(value: string): value is EventCategory {
  return (EVENT_CATEGORIES as readonly string[]).includes(value);
}

function parseFeaturedSermon(rawContent: unknown): HomeFeaturedSermonSection {
  const raw = asRecord(rawContent);
  const fallback = DEFAULT_FEATURED_SERMON_SECTION;
  const sermon = asRecord(raw.sermon);
  const categoryValue = stringValue(sermon, "category", fallback.sermon.category);

  return {
    heading: stringValue(raw, "heading", fallback.heading),
    tagline: stringValue(raw, "tagline", fallback.tagline),
    cta: parseCta(raw.cta, fallback.cta),
    sermon: {
      id: stringValue(sermon, "id", fallback.sermon.id),
      title: stringValue(sermon, "title", fallback.sermon.title),
      description: stringValue(sermon, "description", fallback.sermon.description),
      speaker: stringValue(sermon, "speaker", fallback.sermon.speaker),
      date: stringValue(sermon, "date", fallback.sermon.date),
      category: isSermonCategory(categoryValue) ? categoryValue : fallback.sermon.category,
      duration: stringValue(sermon, "duration", fallback.sermon.duration),
      thumbnail: stringValue(sermon, "thumbnail", fallback.sermon.thumbnail),
    },
  };
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function parseUpcomingEvents(rawContent: unknown): HomeUpcomingEventsSection {
  const raw = asRecord(rawContent);
  const fallback = DEFAULT_UPCOMING_EVENTS_SECTION;
  const rawEvents = arrayValue(raw, "events");

  const events = rawEvents.map((event, index) => {
    const record = asRecord(event);
    const fb = fallback.events[index % fallback.events.length] ?? fallback.events[0];
    const dateValue = stringValue(record, "date", fb.date);
    const categoryValue = stringValue(record, "category", fb.category);
    return {
      id: stringValue(record, "id", fb.id),
      title: stringValue(record, "title", fb.title),
      description: stringValue(record, "description", fb.description),
      date: ISO_DATE.test(dateValue) ? dateValue : fb.date,
      time: stringValue(record, "time", fb.time),
      location: stringValue(record, "location", fb.location),
      category: isEventCategory(categoryValue) ? categoryValue : fb.category,
      image: stringValue(record, "image", fb.image),
    };
  });

  return {
    heading: stringValue(raw, "heading", fallback.heading),
    tagline: stringValue(raw, "tagline", fallback.tagline),
    cta: parseCta(raw.cta, fallback.cta),
    events: events.length > 0 ? events : fallback.events,
  };
}

export interface HomepageContent {
  hero: HomeHeroSection;
  welcome: HomeWelcomeSection;
  featuredSermon: HomeFeaturedSermonSection;
  upcomingEvents: HomeUpcomingEventsSection;
}

let lastFailureLogged = false;

/**
 * Persists validated homepage section content onto the "home" page document.
 * Creates the document first if it does not exist (via getHomepageContent),
 * so saving never hits a missing page.
 */
export async function saveHomepageContent(content: HomepageContent): Promise<void> {
  await getHomepageContent(); // ensure the document exists (creates with defaults)

  await PageModel.updateOne(
    { slug: "home" },
    {
      $set: {
        "sections.$[hero].content": content.hero,
        "sections.$[welcome].content": content.welcome,
        "sections.$[featuredSermon].content": content.featuredSermon,
        "sections.$[upcomingEvents].content": content.upcomingEvents,
      },
    },
    {
      arrayFilters: [
        { "hero.type": "hero" },
        { "welcome.type": "welcome" },
        { "featuredSermon.type": "featured-sermon" },
        { "upcomingEvents.type": "upcoming-events" },
      ],
    }
  );
}

/**
 * Returns the homepage CMS content (creating the document with current-site
 * defaults on first access). Never throws — falls back to defaults when the
 * database is unavailable so the public homepage keeps rendering.
 */
export async function getHomepageContent(): Promise<HomepageContent> {
  try {
    await connectToDatabase();

    let page = await PageModel.findOne({ slug: "home" }).lean();

    if (!page) {
      await PageModel.create({
        slug: "home",
        title: "Homepage",
        status: "published",
        sections: HOMEPAGE_SECTION_DEFAULTS.map((section) => ({ ...section })),
      });
      page = await PageModel.findOne({ slug: "home" }).lean();
    } else {
      const existingTypes = new Set(
        (Array.isArray(page.sections) ? page.sections : []).map((section) => section.type)
      );
      const missing = HOMEPAGE_SECTION_DEFAULTS.filter(
        (section) => !existingTypes.has(section.type)
      );
      if (missing.length > 0) {
        await PageModel.updateOne(
          { slug: "home" },
          { $push: { sections: { $each: missing.map((section) => ({ ...section })) } } }
        );
        page = await PageModel.findOne({ slug: "home" }).lean();
      }
    }

    const sections = Array.isArray(page?.sections) ? page.sections : [];
    const byType = (type: string) => sections.find((section) => section.type === type);

    return {
      hero: parseHero(byType("hero")?.content),
      welcome: parseWelcome(byType("welcome")?.content),
      featuredSermon: parseFeaturedSermon(byType("featured-sermon")?.content),
      upcomingEvents: parseUpcomingEvents(byType("upcoming-events")?.content),
    };
  } catch (error) {
    if (!lastFailureLogged) {
      lastFailureLogged = true;
      console.warn(
        "Homepage content unavailable — rendering defaults.",
        error instanceof Error ? error.message : error
      );
    }
    return {
      hero: DEFAULT_HERO_SECTION,
      welcome: DEFAULT_WELCOME_SECTION,
      featuredSermon: DEFAULT_FEATURED_SERMON_SECTION,
      upcomingEvents: DEFAULT_UPCOMING_EVENTS_SECTION,
    };
  }
}
