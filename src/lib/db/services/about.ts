import {
  ABOUT_INFO_ICONS,
  type AboutInfoIcon,
} from "@/lib/db/constants";
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

export { ABOUT_INFO_ICONS, type AboutInfoIcon };

/**
 * About page CMS service.
 *
 * Defaults reproduce the current hardcoded About page so the public site
 * looks identical before any administrator edits content.
 */

export interface AboutHeroSection {
  title: string;
  subtitle: string;
}

export interface AboutStorySection {
  heading: string;
  paragraphs: string[];
}

export interface AboutInfoCard {
  title: string;
  body: string;
  icon: AboutInfoIcon;
}

export interface AboutInfoSection {
  heading: string;
  subtitle: string;
  cards: AboutInfoCard[];
}

export interface AboutTeamMember {
  id: string;
  name: string;
  title: string;
  role: string;
  image: string;
  bio: string;
  email: string;
}

export interface AboutTeamSection {
  heading: string;
  subtitle: string;
  members: AboutTeamMember[];
}

export interface AboutCtaSection {
  heading: string;
  body: string;
  primaryCta: PageCta;
  secondaryCta: PageCta;
}

export interface AboutContent {
  hero: AboutHeroSection;
  story: AboutStorySection;
  info: AboutInfoSection;
  team: AboutTeamSection;
  cta: AboutCtaSection;
}

export const DEFAULT_ABOUT_HERO: AboutHeroSection = {
  title: "About TGM",
  subtitle: "Our Story, Our Mission, Our Family",
};

export const DEFAULT_ABOUT_STORY: AboutStorySection = {
  heading: "Our Story",
  paragraphs: [
    "Throne of Grace Ministries (TGM) was born out of a deep calling to serve the community of Wakiso Nakawuka, Uganda. Our journey began with a simple yet profound vision: to create a place where hearts could be connected to God's grace and where believers could grow together in unity and purpose.",
    "Inspired by the biblical examples of brothers who ministered together—like Peter and Andrew, James and John, Moses and Aaron—we established TGM as a community rooted in prayer, unity, and discipleship. Our mission is to extend God's mercy to the world and build a strong foundation of faith that transforms lives and communities.",
    "Today, TGM stands as a beacon of hope in Wakiso Nakawuka, welcoming people from all walks of life to experience the love of Christ. We are committed to creating an environment where everyone can grow in their relationship with God and find their place in His family.",
  ],
};

export const DEFAULT_ABOUT_INFO: AboutInfoSection = {
  heading: "Church Information",
  subtitle: "Learn more about our church and how to connect with us",
  cards: [
    { title: "Location", body: "Wakiso Nakawuka, Uganda", icon: "location" },
    { title: "Service Times", body: "Sundays at 10:00 AM", icon: "calendar" },
    { title: "Community", body: "Growing family of believers", icon: "community" },
  ],
};

export const DEFAULT_ABOUT_TEAM: AboutTeamSection = {
  heading: "Grace Team",
  subtitle: "Meet the dedicated leaders who serve our community with love, wisdom, and commitment",
  members: [
    {
      id: "1",
      name: "Pastor John Mwesigwa",
      title: "Senior Pastor",
      role: "Spiritual Leadership & Vision",
      image: "/images/team-pastor-john.jpg",
      bio: "Pastor John has been serving at TGM for over 10 years, leading with wisdom and compassion. He is passionate about connecting hearts to God's grace and building a strong community of believers.",
      email: "pastor.john@tgmchurch.org",
    },
    {
      id: "2",
      name: "Pastor Sarah Nakato",
      title: "Associate Pastor",
      role: "Women Ministry & Discipleship",
      image: "/images/team-pastor-sarah.jpg",
      bio: "Pastor Sarah brings warmth and dedication to her ministry, focusing on women's spiritual growth and community discipleship. She has a heart for mentoring and nurturing believers.",
      email: "pastor.sarah@tgmchurch.org",
    },
    {
      id: "3",
      name: "Pastor David Kato",
      title: "Youth Pastor",
      role: "Youth Ministry & Evangelism",
      image: "/images/team-pastor-david.jpg",
      bio: "Pastor David is passionate about reaching the next generation for Christ. He leads our youth ministry with energy and creativity, helping young people discover their purpose in God.",
      email: "pastor.david@tgmchurch.org",
    },
    {
      id: "4",
      name: "Grace Mbabazi",
      title: "Children Ministry Director",
      role: "Children Ministry & Education",
      image: "/images/team-grace.jpg",
      bio: "Grace has a special gift for working with children and creating engaging programs that help them learn about Jesus in fun and meaningful ways.",
      email: "grace@tgmchurch.org",
    },
    {
      id: "5",
      name: "Michael Ssemwogerere",
      title: "Worship Leader",
      role: "Music & Worship",
      image: "/images/team-michael.jpg",
      bio: "Michael leads our worship team with passion and excellence, creating an atmosphere where people can connect with God through music and praise.",
      email: "michael@tgmchurch.org",
    },
  ],
};

export const DEFAULT_ABOUT_CTA: AboutCtaSection = {
  heading: "Join Our Family",
  body:
    "We welcome you to be part of our community. Whether you're new to faith or have been " +
    "walking with Christ for years, there's a place for you at TGM.",
  primaryCta: { label: "Visit Us", href: "/contact" },
  secondaryCta: { label: "Get Involved", href: "/ministries" },
};

const ABOUT_SECTION_DEFAULTS: PageSectionSeed[] = [
  { id: "hero", type: "hero", order: 0, content: DEFAULT_ABOUT_HERO },
  { id: "story", type: "story", order: 1, content: DEFAULT_ABOUT_STORY },
  { id: "info", type: "info", order: 2, content: DEFAULT_ABOUT_INFO },
  { id: "team", type: "team", order: 3, content: DEFAULT_ABOUT_TEAM },
  { id: "cta", type: "cta", order: 4, content: DEFAULT_ABOUT_CTA },
];

function isInfoIcon(value: string): value is AboutInfoIcon {
  return (ABOUT_INFO_ICONS as readonly string[]).includes(value);
}

function parseHero(rawContent: unknown): AboutHeroSection {
  const raw = asRecord(rawContent);
  return {
    title: stringValue(raw, "title", DEFAULT_ABOUT_HERO.title),
    subtitle: stringValue(raw, "subtitle", DEFAULT_ABOUT_HERO.subtitle),
  };
}

function parseStory(rawContent: unknown): AboutStorySection {
  const raw = asRecord(rawContent);
  const paragraphs = arrayValue(raw, "paragraphs").filter(
    (item): item is string => typeof item === "string" && item.length > 0
  );
  return {
    heading: stringValue(raw, "heading", DEFAULT_ABOUT_STORY.heading),
    paragraphs: paragraphs.length > 0 ? paragraphs : DEFAULT_ABOUT_STORY.paragraphs,
  };
}

function parseInfo(rawContent: unknown): AboutInfoSection {
  const raw = asRecord(rawContent);
  const fallback = DEFAULT_ABOUT_INFO;
  const cards = arrayValue(raw, "cards").map((card, index) => {
    const record = asRecord(card);
    const fb = fallback.cards[index % fallback.cards.length] ?? fallback.cards[0];
    const iconValue = stringValue(record, "icon", fb.icon);
    return {
      title: stringValue(record, "title", fb.title),
      body: stringValue(record, "body", fb.body),
      icon: isInfoIcon(iconValue) ? iconValue : fb.icon,
    };
  });
  return {
    heading: stringValue(raw, "heading", fallback.heading),
    subtitle: stringValue(raw, "subtitle", fallback.subtitle),
    cards: cards.length > 0 ? cards : fallback.cards,
  };
}

function parseTeam(rawContent: unknown): AboutTeamSection {
  const raw = asRecord(rawContent);
  const fallback = DEFAULT_ABOUT_TEAM;
  const members = arrayValue(raw, "members").map((member, index) => {
    const record = asRecord(member);
    const fb = fallback.members[index % fallback.members.length] ?? fallback.members[0];
    return {
      id: stringValue(record, "id", fb.id),
      name: stringValue(record, "name", fb.name),
      title: stringValue(record, "title", fb.title),
      role: stringValue(record, "role", fb.role),
      image: stringValue(record, "image", fb.image),
      bio: stringValue(record, "bio", fb.bio),
      email: stringValue(record, "email", fb.email),
    };
  });
  return {
    heading: stringValue(raw, "heading", fallback.heading),
    subtitle: stringValue(raw, "subtitle", fallback.subtitle),
    members: members.length > 0 ? members : fallback.members,
  };
}

function parseCtaSection(rawContent: unknown): AboutCtaSection {
  const raw = asRecord(rawContent);
  const fallback = DEFAULT_ABOUT_CTA;
  return {
    heading: stringValue(raw, "heading", fallback.heading),
    body: stringValue(raw, "body", fallback.body),
    primaryCta: parseCta(raw.primaryCta, fallback.primaryCta),
    secondaryCta: parseCta(raw.secondaryCta, fallback.secondaryCta),
  };
}

function fallbackContent(): AboutContent {
  return {
    hero: DEFAULT_ABOUT_HERO,
    story: DEFAULT_ABOUT_STORY,
    info: DEFAULT_ABOUT_INFO,
    team: DEFAULT_ABOUT_TEAM,
    cta: DEFAULT_ABOUT_CTA,
  };
}

let lastFailureLogged = false;

export async function getAboutContent(): Promise<AboutContent> {
  try {
    const sections = await getOrCreateManagedPage({
      slug: "about",
      title: "About",
      sections: ABOUT_SECTION_DEFAULTS,
    });
    return {
      hero: parseHero(sectionByType(sections, "hero")),
      story: parseStory(sectionByType(sections, "story")),
      info: parseInfo(sectionByType(sections, "info")),
      team: parseTeam(sectionByType(sections, "team")),
      cta: parseCtaSection(sectionByType(sections, "cta")),
    };
  } catch (error) {
    if (!lastFailureLogged) {
      lastFailureLogged = true;
      console.warn(
        "About content unavailable — rendering defaults.",
        error instanceof Error ? error.message : error
      );
    }
    return fallbackContent();
  }
}

export async function saveAboutContent(content: AboutContent): Promise<void> {
  await getAboutContent();
  await saveManagedPageSections("about", {
    hero: content.hero,
    story: content.story,
    info: content.info,
    team: content.team,
    cta: content.cta,
  });
}
