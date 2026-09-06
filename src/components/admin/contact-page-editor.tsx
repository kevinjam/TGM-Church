"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  SaveBar,
  Section,
  type SaveStatus,
} from "@/components/admin/form-fields";
import type { ContactPageContent } from "@/lib/db/services/contact-page";

const PATH_OR_HREF = /^(\/|https?:\/\/|mailto:|tel:)/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Draft = ContactPageContent;

export function ContactPageEditor({ initial }: { initial: ContactPageContent }) {
  const [draft, setDraft] = useState<Draft>(() => structuredClone(initial));
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const updateAt = (path: Array<string | number>, value: string) =>
    setDraft((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const next: any = structuredClone(prev);
      let node: unknown = next;
      for (const key of path.slice(0, -1)) {
        node = (node as Record<string | number, unknown>)?.[key];
      }
      const last = path[path.length - 1];
      if (node && last !== undefined) {
        (node as Record<string | number, unknown>)[last] = value;
      }
      return next as Draft;
    });

  const validateOptionalHref = (value: string, label: string): string | null => {
    if (value.trim() && !PATH_OR_HREF.test(value.trim())) {
      return `${label} must start with /, http(s)://, mailto:, or tel:.`;
    }
    return null;
  };

  const validateClient = (): string | null => {
    if (!draft.hero.title.trim()) return "The Contact heading is required.";
    if (!draft.hero.subtitle.trim()) return "The Contact subtitle is required.";
    if (!draft.form.title.trim()) return "The form title is required.";
    if (!draft.form.submitLabel.trim()) return "The send button label is required.";
    if (!draft.form.successMessage.trim()) return "The success message is required.";
    if (!draft.details.title.trim()) return "The contact details title is required.";
    if (!draft.details.address.trim()) return "The address is required.";
    if (!draft.details.phone.trim()) return "The phone number is required.";
    if (!draft.details.email.trim() || !EMAIL_PATTERN.test(draft.details.email.trim())) {
      return "A valid contact email is required.";
    }
    if (!draft.details.serviceTimes.trim()) return "The service times are required.";
    if (!draft.social.title.trim()) return "The social heading is required.";
    const facebook = validateOptionalHref(draft.social.facebook, "The Facebook link");
    if (facebook) return facebook;
    const instagram = validateOptionalHref(draft.social.instagram, "The Instagram link");
    if (instagram) return instagram;
    const youtube = validateOptionalHref(draft.social.youtube, "The YouTube link");
    if (youtube) return youtube;
    if (!draft.map.title.trim()) return "The map title is required.";
    if (!draft.prayer.heading.trim()) return "The prayer heading is required.";
    if (!draft.prayer.body.trim()) return "The prayer text is required.";
    if (!draft.prayer.cta.label.trim()) return "The prayer request button label is required.";
    if (!draft.prayer.cta.href.trim() || !PATH_OR_HREF.test(draft.prayer.cta.href.trim())) {
      return "The prayer request button link must start with /, http(s)://, mailto:, or tel:.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clientError = validateClient();
    if (clientError) {
      setStatus("error");
      setMessage(clientError);
      return;
    }

    setStatus("saving");
    setMessage(null);

    try {
      const response = await fetch("/api/pages/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        content?: ContactPageContent;
      };
      if (!response.ok || !data.content) {
        setStatus("error");
        setMessage(data.error ?? "Unable to save changes. Please try again.");
        return;
      }
      setDraft(data.content);
      setStatus("saved");
      setMessage("Contact page saved successfully.");
    } catch {
      setStatus("error");
      setMessage("Unable to save changes. Please check your connection and try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Section title="Hero" description="The large banner at the top of the Contact page.">
        <Field label="Heading" htmlFor="contact.hero.title" required>
          <Input
            id="contact.hero.title"
            value={draft.hero.title}
            onChange={(e) => updateAt(["hero", "title"], e.target.value)}
            maxLength={200}
          />
        </Field>
        <Field label="Subtitle" htmlFor="contact.hero.subtitle" required>
          <Input
            id="contact.hero.subtitle"
            value={draft.hero.subtitle}
            onChange={(e) => updateAt(["hero", "subtitle"], e.target.value)}
            maxLength={300}
          />
        </Field>
      </Section>

      <Section title="Message form" description="Labels shown on the public contact form. Submissions still appear under Messages.">
        <Field label="Form title" htmlFor="contact.form.title" required>
          <Input
            id="contact.form.title"
            value={draft.form.title}
            onChange={(e) => updateAt(["form", "title"], e.target.value)}
            maxLength={200}
          />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Name label" htmlFor="contact.form.nameLabel" required>
            <Input
              id="contact.form.nameLabel"
              value={draft.form.nameLabel}
              onChange={(e) => updateAt(["form", "nameLabel"], e.target.value)}
              maxLength={80}
            />
          </Field>
          <Field label="Name placeholder" htmlFor="contact.form.namePlaceholder" required>
            <Input
              id="contact.form.namePlaceholder"
              value={draft.form.namePlaceholder}
              onChange={(e) => updateAt(["form", "namePlaceholder"], e.target.value)}
              maxLength={160}
            />
          </Field>
          <Field label="Email label" htmlFor="contact.form.emailLabel" required>
            <Input
              id="contact.form.emailLabel"
              value={draft.form.emailLabel}
              onChange={(e) => updateAt(["form", "emailLabel"], e.target.value)}
              maxLength={80}
            />
          </Field>
          <Field label="Email placeholder" htmlFor="contact.form.emailPlaceholder" required>
            <Input
              id="contact.form.emailPlaceholder"
              value={draft.form.emailPlaceholder}
              onChange={(e) => updateAt(["form", "emailPlaceholder"], e.target.value)}
              maxLength={160}
            />
          </Field>
          <Field label="Message label" htmlFor="contact.form.messageLabel" required>
            <Input
              id="contact.form.messageLabel"
              value={draft.form.messageLabel}
              onChange={(e) => updateAt(["form", "messageLabel"], e.target.value)}
              maxLength={80}
            />
          </Field>
          <Field label="Message placeholder" htmlFor="contact.form.messagePlaceholder" required>
            <Input
              id="contact.form.messagePlaceholder"
              value={draft.form.messagePlaceholder}
              onChange={(e) => updateAt(["form", "messagePlaceholder"], e.target.value)}
              maxLength={160}
            />
          </Field>
          <Field label="Send button" htmlFor="contact.form.submitLabel" required>
            <Input
              id="contact.form.submitLabel"
              value={draft.form.submitLabel}
              onChange={(e) => updateAt(["form", "submitLabel"], e.target.value)}
              maxLength={80}
            />
          </Field>
          <Field label="Sending label" htmlFor="contact.form.sendingLabel" required>
            <Input
              id="contact.form.sendingLabel"
              value={draft.form.sendingLabel}
              onChange={(e) => updateAt(["form", "sendingLabel"], e.target.value)}
              maxLength={80}
            />
          </Field>
        </div>
        <Field label="Success message" htmlFor="contact.form.successMessage" required>
          <Textarea
            id="contact.form.successMessage"
            rows={2}
            value={draft.form.successMessage}
            onChange={(e) => updateAt(["form", "successMessage"], e.target.value)}
            maxLength={4000}
          />
        </Field>
      </Section>

      <Section title="Contact details" description="Address, phone, email, and service times shown beside the form.">
        <Field label="Card title" htmlFor="contact.details.title" required>
          <Input
            id="contact.details.title"
            value={draft.details.title}
            onChange={(e) => updateAt(["details", "title"], e.target.value)}
            maxLength={200}
          />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Address label" htmlFor="contact.details.addressLabel" required>
            <Input
              id="contact.details.addressLabel"
              value={draft.details.addressLabel}
              onChange={(e) => updateAt(["details", "addressLabel"], e.target.value)}
              maxLength={80}
            />
          </Field>
          <Field label="Address" htmlFor="contact.details.address" required>
            <Input
              id="contact.details.address"
              value={draft.details.address}
              onChange={(e) => updateAt(["details", "address"], e.target.value)}
              maxLength={400}
            />
          </Field>
          <Field label="Phone label" htmlFor="contact.details.phoneLabel" required>
            <Input
              id="contact.details.phoneLabel"
              value={draft.details.phoneLabel}
              onChange={(e) => updateAt(["details", "phoneLabel"], e.target.value)}
              maxLength={80}
            />
          </Field>
          <Field label="Phone" htmlFor="contact.details.phone" required>
            <Input
              id="contact.details.phone"
              value={draft.details.phone}
              onChange={(e) => updateAt(["details", "phone"], e.target.value)}
              maxLength={80}
            />
          </Field>
          <Field label="Email label" htmlFor="contact.details.emailLabel" required>
            <Input
              id="contact.details.emailLabel"
              value={draft.details.emailLabel}
              onChange={(e) => updateAt(["details", "emailLabel"], e.target.value)}
              maxLength={80}
            />
          </Field>
          <Field label="Email" htmlFor="contact.details.email" required>
            <Input
              id="contact.details.email"
              type="email"
              value={draft.details.email}
              onChange={(e) => updateAt(["details", "email"], e.target.value)}
              maxLength={254}
            />
          </Field>
          <Field label="Service times label" htmlFor="contact.details.serviceTimesLabel" required>
            <Input
              id="contact.details.serviceTimesLabel"
              value={draft.details.serviceTimesLabel}
              onChange={(e) => updateAt(["details", "serviceTimesLabel"], e.target.value)}
              maxLength={80}
            />
          </Field>
          <Field label="Service times" htmlFor="contact.details.serviceTimes" required>
            <Input
              id="contact.details.serviceTimes"
              value={draft.details.serviceTimes}
              onChange={(e) => updateAt(["details", "serviceTimes"], e.target.value)}
              maxLength={200}
            />
          </Field>
        </div>
      </Section>

      <Section title="Social links" description="Optional. Leave blank to keep the icons without a link.">
        <Field label="Card title" htmlFor="contact.social.title" required>
          <Input
            id="contact.social.title"
            value={draft.social.title}
            onChange={(e) => updateAt(["social", "title"], e.target.value)}
            maxLength={200}
          />
        </Field>
        <Field label="Facebook URL" htmlFor="contact.social.facebook">
          <Input
            id="contact.social.facebook"
            value={draft.social.facebook}
            onChange={(e) => updateAt(["social", "facebook"], e.target.value)}
            placeholder="https://facebook.com/…"
            maxLength={500}
          />
        </Field>
        <Field label="Instagram URL" htmlFor="contact.social.instagram">
          <Input
            id="contact.social.instagram"
            value={draft.social.instagram}
            onChange={(e) => updateAt(["social", "instagram"], e.target.value)}
            placeholder="https://instagram.com/…"
            maxLength={500}
          />
        </Field>
        <Field label="YouTube URL" htmlFor="contact.social.youtube">
          <Input
            id="contact.social.youtube"
            value={draft.social.youtube}
            onChange={(e) => updateAt(["social", "youtube"], e.target.value)}
            placeholder="https://youtube.com/…"
            maxLength={500}
          />
        </Field>
      </Section>

      <Section title="Map card" description="The Find Us placeholder beside the form.">
        <Field label="Card title" htmlFor="contact.map.title" required>
          <Input
            id="contact.map.title"
            value={draft.map.title}
            onChange={(e) => updateAt(["map", "title"], e.target.value)}
            maxLength={200}
          />
        </Field>
        <Field label="Heading" htmlFor="contact.map.heading" required>
          <Input
            id="contact.map.heading"
            value={draft.map.heading}
            onChange={(e) => updateAt(["map", "heading"], e.target.value)}
            maxLength={200}
          />
        </Field>
        <Field label="Subtitle" htmlFor="contact.map.subtitle" required>
          <Input
            id="contact.map.subtitle"
            value={draft.map.subtitle}
            onChange={(e) => updateAt(["map", "subtitle"], e.target.value)}
            maxLength={300}
          />
        </Field>
      </Section>

      <Section title="Prayer requests" description="The section at the bottom of the Contact page.">
        <Field label="Heading" htmlFor="contact.prayer.heading" required>
          <Input
            id="contact.prayer.heading"
            value={draft.prayer.heading}
            onChange={(e) => updateAt(["prayer", "heading"], e.target.value)}
            maxLength={200}
          />
        </Field>
        <Field label="Text" htmlFor="contact.prayer.body" required>
          <Textarea
            id="contact.prayer.body"
            rows={3}
            value={draft.prayer.body}
            onChange={(e) => updateAt(["prayer", "body"], e.target.value)}
            maxLength={4000}
          />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Button text" htmlFor="contact.prayer.cta.label" required>
            <Input
              id="contact.prayer.cta.label"
              value={draft.prayer.cta.label}
              onChange={(e) => updateAt(["prayer", "cta", "label"], e.target.value)}
              maxLength={80}
            />
          </Field>
          <Field label="Button link" htmlFor="contact.prayer.cta.href" required>
            <Input
              id="contact.prayer.cta.href"
              value={draft.prayer.cta.href}
              onChange={(e) => updateAt(["prayer", "cta", "href"], e.target.value)}
              placeholder="mailto:prayer@tgmchurch.org"
              maxLength={500}
            />
          </Field>
        </div>
      </Section>

      <SaveBar status={status} message={message} />
    </form>
  );
}
