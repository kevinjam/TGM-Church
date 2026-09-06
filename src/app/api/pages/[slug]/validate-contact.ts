import type { ContactPageContent } from "@/lib/db/services/contact-page";
import type { PageCta } from "@/lib/db/services/cms-shared";
import {
  EMAIL_PATTERN,
  readObject,
  readText,
} from "@/app/api/pages/[slug]/page-validation";

const LIMITS = {
  title: 200,
  subtitle: 300,
  heading: 200,
  body: 4000,
  label: 80,
  placeholder: 160,
  address: 400,
  phone: 80,
  email: 254,
  href: 500,
  serviceTimes: 200,
} as const;

const OPTIONAL_HREF = /^(\/|https?:\/\/|mailto:|tel:)/i;

function validateOptionalHref(
  value: string,
  label: string
): { error: string } | { data: string } {
  if (value && !OPTIONAL_HREF.test(value)) {
    return { error: `${label} must start with /, http(s)://, mailto:, or tel:.` };
  }
  return { data: value };
}

function validatePrayerCta(raw: unknown): { error: string } | { data: PageCta } {
  const input = readObject(raw);
  const label = readText(input, "label", LIMITS.label);
  const href = readText(input, "href", LIMITS.href);
  if (label === null) return { error: "The prayer request button label is required." };
  if (href === null) return { error: "The prayer request button link is required." };
  const hrefResult = validateOptionalHref(href, "The prayer request button link");
  if ("error" in hrefResult) return hrefResult;
  return { data: { label, href: hrefResult.data } };
}

export function validateContactPagePayload(
  body: unknown
): { error: string } | { data: ContactPageContent } {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { error: "Invalid request body." };
  }
  const input = readObject(body);

  const heroInput = readObject(input.hero);
  const heroTitle = readText(heroInput, "title", LIMITS.title);
  const heroSubtitle = readText(heroInput, "subtitle", LIMITS.subtitle);
  if (heroTitle === null) return { error: "The Contact heading is required." };
  if (heroSubtitle === null) return { error: "The Contact subtitle is required." };

  const formInput = readObject(input.form);
  const formTitle = readText(formInput, "title", LIMITS.title);
  const nameLabel = readText(formInput, "nameLabel", LIMITS.label);
  const emailLabel = readText(formInput, "emailLabel", LIMITS.label);
  const messageLabel = readText(formInput, "messageLabel", LIMITS.label);
  const namePlaceholder = readText(formInput, "namePlaceholder", LIMITS.placeholder);
  const emailPlaceholder = readText(formInput, "emailPlaceholder", LIMITS.placeholder);
  const messagePlaceholder = readText(formInput, "messagePlaceholder", LIMITS.placeholder);
  const submitLabel = readText(formInput, "submitLabel", LIMITS.label);
  const sendingLabel = readText(formInput, "sendingLabel", LIMITS.label);
  const successMessage = readText(formInput, "successMessage", LIMITS.body);
  if (formTitle === null) return { error: "The form title is required." };
  if (nameLabel === null) return { error: "The name field label is required." };
  if (emailLabel === null) return { error: "The email field label is required." };
  if (messageLabel === null) return { error: "The message field label is required." };
  if (namePlaceholder === null) return { error: "The name placeholder is required." };
  if (emailPlaceholder === null) return { error: "The email placeholder is required." };
  if (messagePlaceholder === null) return { error: "The message placeholder is required." };
  if (submitLabel === null) return { error: "The send button label is required." };
  if (sendingLabel === null) return { error: "The sending button label is required." };
  if (successMessage === null) return { error: "The success message is required." };

  const detailsInput = readObject(input.details);
  const detailsTitle = readText(detailsInput, "title", LIMITS.title);
  const addressLabel = readText(detailsInput, "addressLabel", LIMITS.label);
  const address = readText(detailsInput, "address", LIMITS.address);
  const phoneLabel = readText(detailsInput, "phoneLabel", LIMITS.label);
  const phone = readText(detailsInput, "phone", LIMITS.phone);
  const detailsEmailLabel = readText(detailsInput, "emailLabel", LIMITS.label);
  const detailsEmail = readText(detailsInput, "email", LIMITS.email);
  const serviceTimesLabel = readText(detailsInput, "serviceTimesLabel", LIMITS.label);
  const serviceTimes = readText(detailsInput, "serviceTimes", LIMITS.serviceTimes);
  if (detailsTitle === null) return { error: "The contact details title is required." };
  if (addressLabel === null) return { error: "The address label is required." };
  if (address === null) return { error: "The address is required." };
  if (phoneLabel === null) return { error: "The phone label is required." };
  if (phone === null) return { error: "The phone number is required." };
  if (detailsEmailLabel === null) return { error: "The email label is required." };
  if (detailsEmail === null || !EMAIL_PATTERN.test(detailsEmail)) {
    return { error: "A valid contact email is required." };
  }
  if (serviceTimesLabel === null) return { error: "The service times label is required." };
  if (serviceTimes === null) return { error: "The service times are required." };

  const socialInput = readObject(input.social);
  const socialTitle = readText(socialInput, "title", LIMITS.title);
  const facebook = readText(socialInput, "facebook", LIMITS.href, { optional: true });
  const instagram = readText(socialInput, "instagram", LIMITS.href, { optional: true });
  const youtube = readText(socialInput, "youtube", LIMITS.href, { optional: true });
  if (socialTitle === null) return { error: "The social heading is required." };
  if (facebook === null) return { error: "The Facebook link is too long." };
  if (instagram === null) return { error: "The Instagram link is too long." };
  if (youtube === null) return { error: "The YouTube link is too long." };
  const facebookHref = validateOptionalHref(facebook, "The Facebook link");
  const instagramHref = validateOptionalHref(instagram, "The Instagram link");
  const youtubeHref = validateOptionalHref(youtube, "The YouTube link");
  if ("error" in facebookHref) return facebookHref;
  if ("error" in instagramHref) return instagramHref;
  if ("error" in youtubeHref) return youtubeHref;

  const mapInput = readObject(input.map);
  const mapTitle = readText(mapInput, "title", LIMITS.title);
  const mapHeading = readText(mapInput, "heading", LIMITS.heading);
  const mapSubtitle = readText(mapInput, "subtitle", LIMITS.subtitle);
  if (mapTitle === null) return { error: "The map title is required." };
  if (mapHeading === null) return { error: "The map heading is required." };
  if (mapSubtitle === null) return { error: "The map subtitle is required." };

  const prayerInput = readObject(input.prayer);
  const prayerHeading = readText(prayerInput, "heading", LIMITS.heading);
  const prayerBody = readText(prayerInput, "body", LIMITS.body);
  const prayerCta = validatePrayerCta(prayerInput.cta);
  if (prayerHeading === null) return { error: "The prayer heading is required." };
  if (prayerBody === null) return { error: "The prayer text is required." };
  if ("error" in prayerCta) return prayerCta;

  return {
    data: {
      hero: { title: heroTitle, subtitle: heroSubtitle },
      form: {
        title: formTitle,
        nameLabel,
        emailLabel,
        messageLabel,
        namePlaceholder,
        emailPlaceholder,
        messagePlaceholder,
        submitLabel,
        sendingLabel,
        successMessage,
      },
      details: {
        title: detailsTitle,
        addressLabel,
        address,
        phoneLabel,
        phone,
        emailLabel: detailsEmailLabel,
        email: detailsEmail,
        serviceTimesLabel,
        serviceTimes,
      },
      social: {
        title: socialTitle,
        facebook: facebookHref.data,
        instagram: instagramHref.data,
        youtube: youtubeHref.data,
      },
      map: { title: mapTitle, heading: mapHeading, subtitle: mapSubtitle },
      prayer: { heading: prayerHeading, body: prayerBody, cta: prayerCta.data },
    },
  };
}
