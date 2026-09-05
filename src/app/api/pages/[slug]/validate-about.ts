import {
  ABOUT_INFO_ICONS,
  type AboutContent,
  type AboutInfoCard,
  type AboutInfoIcon,
  type AboutTeamMember,
} from "@/lib/db/services/about";
import {
  EMAIL_PATTERN,
  readObject,
  readText,
  validateCta,
  validateOptionalImage,
} from "./page-validation";

const LIMITS = {
  title: 200,
  subtitle: 300,
  heading: 200,
  paragraph: 4000,
  body: 4000,
  cardTitle: 120,
  cardBody: 400,
  name: 160,
  role: 200,
  bio: 2000,
  email: 254,
  image: 2048,
  maxParagraphs: 8,
  maxCards: 6,
  maxMembers: 12,
} as const;

export function validateAboutPayload(body: unknown): { error: string } | { data: AboutContent } {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { error: "Invalid request body." };
  }
  const input = readObject(body);

  const heroInput = readObject(input.hero);
  const heroTitle = readText(heroInput, "title", LIMITS.title);
  const heroSubtitle = readText(heroInput, "subtitle", LIMITS.subtitle);
  if (heroTitle === null) return { error: "The About heading is required." };
  if (heroSubtitle === null) return { error: "The About subtitle is required." };

  const storyInput = readObject(input.story);
  const storyHeading = readText(storyInput, "heading", LIMITS.heading);
  if (storyHeading === null) return { error: "The Our Story heading is required." };
  if (!Array.isArray(storyInput.paragraphs) || storyInput.paragraphs.length === 0) {
    return { error: "Our Story needs at least one paragraph." };
  }
  if (storyInput.paragraphs.length > LIMITS.maxParagraphs) {
    return { error: `Our Story can have at most ${LIMITS.maxParagraphs} paragraphs.` };
  }
  const paragraphs: string[] = [];
  for (let index = 0; index < storyInput.paragraphs.length; index++) {
    const value = storyInput.paragraphs[index];
    if (typeof value !== "string" || !value.trim()) {
      return { error: `Story paragraph ${index + 1} cannot be empty.` };
    }
    if (value.trim().length > LIMITS.paragraph) {
      return { error: `Story paragraph ${index + 1} is too long.` };
    }
    paragraphs.push(value.trim());
  }

  const infoInput = readObject(input.info);
  const infoHeading = readText(infoInput, "heading", LIMITS.heading);
  const infoSubtitle = readText(infoInput, "subtitle", LIMITS.subtitle);
  if (infoHeading === null) return { error: "The church information heading is required." };
  if (infoSubtitle === null) return { error: "The church information subtitle is required." };
  if (!Array.isArray(infoInput.cards) || infoInput.cards.length === 0) {
    return { error: "At least one church information card is required." };
  }
  if (infoInput.cards.length > LIMITS.maxCards) {
    return { error: `A maximum of ${LIMITS.maxCards} church information cards is allowed.` };
  }
  const cards: AboutInfoCard[] = [];
  for (let index = 0; index < infoInput.cards.length; index++) {
    const card = readObject(infoInput.cards[index]);
    const title = readText(card, "title", LIMITS.cardTitle);
    const body = readText(card, "body", LIMITS.cardBody);
    const icon = readText(card, "icon", 40);
    if (title === null) return { error: `Information card ${index + 1} needs a title.` };
    if (body === null) return { error: `Information card ${index + 1} needs a description.` };
    if (icon === null || !(ABOUT_INFO_ICONS as readonly string[]).includes(icon)) {
      return { error: `Information card ${index + 1} needs a valid icon.` };
    }
    cards.push({ title, body, icon: icon as AboutInfoIcon });
  }

  const teamInput = readObject(input.team);
  const teamHeading = readText(teamInput, "heading", LIMITS.heading);
  const teamSubtitle = readText(teamInput, "subtitle", LIMITS.subtitle);
  if (teamHeading === null) return { error: "The Grace Team heading is required." };
  if (teamSubtitle === null) return { error: "The Grace Team subtitle is required." };
  if (!Array.isArray(teamInput.members) || teamInput.members.length === 0) {
    return { error: "At least one Grace Team member is required." };
  }
  if (teamInput.members.length > LIMITS.maxMembers) {
    return { error: `A maximum of ${LIMITS.maxMembers} team members is allowed.` };
  }
  const members: AboutTeamMember[] = [];
  for (let index = 0; index < teamInput.members.length; index++) {
    const member = readObject(teamInput.members[index]);
    const n = index + 1;
    const id = readText(member, "id", 100, { optional: true }) || `member-${n}`;
    const name = readText(member, "name", LIMITS.name);
    const title = readText(member, "title", LIMITS.role);
    const role = readText(member, "role", LIMITS.role);
    const bio = readText(member, "bio", LIMITS.bio);
    const email = readText(member, "email", LIMITS.email);
    const imageResult = validateOptionalImage(member, "image", LIMITS.image, `Team member ${n}`);
    if (name === null) return { error: `Team member ${n} needs a name.` };
    if (title === null) return { error: `Team member ${n} needs a title.` };
    if (role === null) return { error: `Team member ${n} needs a role.` };
    if (bio === null) return { error: `Team member ${n} needs a bio.` };
    if (email === null || !EMAIL_PATTERN.test(email)) {
      return { error: `Team member ${n} needs a valid email.` };
    }
    if ("error" in imageResult) return imageResult;
    members.push({
      id,
      name,
      title,
      role,
      bio,
      email,
      image: imageResult.data,
    });
  }

  const ctaInput = readObject(input.cta);
  const ctaHeading = readText(ctaInput, "heading", LIMITS.heading);
  const ctaBody = readText(ctaInput, "body", LIMITS.body);
  const primaryCta = validateCta(ctaInput.primaryCta);
  const secondaryCta = validateCta(ctaInput.secondaryCta);
  if (ctaHeading === null) return { error: "The About call-to-action heading is required." };
  if (ctaBody === null) return { error: "The About call-to-action text is required." };
  if ("error" in primaryCta) return primaryCta;
  if ("error" in secondaryCta) return secondaryCta;

  return {
    data: {
      hero: { title: heroTitle, subtitle: heroSubtitle },
      story: { heading: storyHeading, paragraphs },
      info: { heading: infoHeading, subtitle: infoSubtitle, cards },
      team: { heading: teamHeading, subtitle: teamSubtitle, members },
      cta: {
        heading: ctaHeading,
        body: ctaBody,
        primaryCta: primaryCta.data,
        secondaryCta: secondaryCta.data,
      },
    },
  };
}
