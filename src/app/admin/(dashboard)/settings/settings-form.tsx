"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  SaveBar,
  Section,
  type SaveStatus,
} from "@/components/admin/form-fields";
import type { SiteSettingsView } from "@/lib/db/services/site-settings";

type Draft = Omit<SiteSettingsView, "id">;

function cloneDraft(view: SiteSettingsView): Draft {
  return {
    brand: { ...view.brand },
    contact: { ...view.contact },
    serviceTimes: [...view.serviceTimes],
    socials: { ...view.socials },
    footer: { ...view.footer },
    seo: { ...view.seo, keywords: [...view.seo.keywords] },
  };
}

function setByPath(draft: Draft, path: string[], value: string): Draft {
  const next = structuredClone(draft);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let node: any = next;
  for (const key of path.slice(0, -1)) {
    node = node?.[key];
  }
  const last = path[path.length - 1];
  if (node && last) node[last] = value;
  return next;
}

export function SettingsForm({ initial }: { initial: SiteSettingsView }) {
  const [draft, setDraft] = useState<Draft>(() => cloneDraft(initial));
  const [keywordsInput, setKeywordsInput] = useState(initial.seo.keywords.join(", "));
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const set = (path: string[], value: string) =>
    setDraft((prev) => setByPath(prev, path, value));

  const setServiceTime = (index: number, value: string) =>
    setDraft((prev) => {
      const next = structuredClone(prev);
      next.serviceTimes[index] = value;
      return next;
    });

  const addServiceTime = () =>
    setDraft((prev) => ({ ...prev, serviceTimes: [...prev.serviceTimes, ""] }));

  const removeServiceTime = (index: number) =>
    setDraft((prev) => ({
      ...prev,
      serviceTimes: prev.serviceTimes.filter((_, i) => i !== index),
    }));

  const validateClient = (): string | null => {
    if (!draft.brand.name.trim()) return "Church name is required.";
    if (!draft.brand.shortName.trim()) return "Short name is required.";
    if (!draft.brand.displayName.trim()) return "Display name is required.";
    if (!draft.brand.tagline.trim()) return "Tagline is required.";
    if (!draft.brand.verse.trim()) return "Verse reference is required.";
    if (!draft.contact.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.contact.email)) {
      return "Please enter a valid contact email.";
    }
    if (!draft.contact.phone.trim()) return "Phone number is required.";
    if (!draft.contact.address.trim()) return "Address is required.";
    if (!draft.footer.description.trim()) return "Footer description is required.";
    if (!draft.footer.copyright.trim()) return "Copyright text is required.";

    const socialKeys = Object.keys(draft.socials) as Array<keyof Draft["socials"]>;
    for (const key of socialKeys) {
      const url = draft.socials[key].trim();
      if (url && !/^https?:\/\/.+/i.test(url)) {
        return `The ${key} link must start with http:// or https://`;
      }
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

    const keywords = keywordsInput
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean)
      .slice(0, 20);

    const payload: Draft = {
      ...draft,
      serviceTimes: draft.serviceTimes.map((t) => t.trim()).filter(Boolean),
      seo: { ...draft.seo, keywords },
    };

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        settings?: SiteSettingsView;
      };

      if (!response.ok || !data.settings) {
        setStatus("error");
        setMessage(data.error ?? "Unable to save changes. Please try again.");
        return;
      }

      setDraft(cloneDraft(data.settings));
      setKeywordsInput(data.settings.seo.keywords.join(", "));
      setStatus("saved");
      setMessage("Settings saved successfully.");
    } catch {
      setStatus("error");
      setMessage("Unable to save changes. Please check your connection and try again.");
    }
  };

  const socials: Array<{ key: keyof Draft["socials"]; label: string }> = [
    { key: "facebook", label: "Facebook URL" },
    { key: "instagram", label: "Instagram URL" },
    { key: "youtube", label: "YouTube URL" },
    { key: "twitter", label: "X / Twitter URL" },
    { key: "whatsapp", label: "WhatsApp URL" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Brand & identity */}
      <Section
        title="Church Identity"
        description="The name, tagline, and verse used in the navbar, footer, and hero areas."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Church name" htmlFor="brand.name" required>
            <Input
              id="brand.name"
              value={draft.brand.name}
              onChange={(e) => set(["brand", "name"], e.target.value)}
              placeholder="Throne of Grace Ministries"
            />
          </Field>
          <Field label="Short name" htmlFor="brand.shortName" required>
            <Input
              id="brand.shortName"
              value={draft.brand.shortName}
              onChange={(e) => set(["brand", "shortName"], e.target.value)}
              placeholder="TGM"
            />
          </Field>
          <Field label="Display name" htmlFor="brand.displayName" required>
            <Input
              id="brand.displayName"
              value={draft.brand.displayName}
              onChange={(e) => set(["brand", "displayName"], e.target.value)}
              placeholder="The Gospel Mission"
            />
          </Field>
          <Field label="Tagline" htmlFor="brand.tagline" required>
            <Input
              id="brand.tagline"
              value={draft.brand.tagline}
              onChange={(e) => set(["brand", "tagline"], e.target.value)}
              placeholder="Connecting Hearts to His Grace"
            />
          </Field>
          <Field label="Verse reference" htmlFor="brand.verse" required>
            <Input
              id="brand.verse"
              value={draft.brand.verse}
              onChange={(e) => set(["brand", "verse"], e.target.value)}
              placeholder="Hebrews 4:16"
            />
          </Field>
        </div>
      </Section>

      {/* Contact */}
      <Section title="Contact Information" description="Shown in the footer and on contact pages.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Email" htmlFor="contact.email" required>
            <Input
              id="contact.email"
              type="email"
              value={draft.contact.email}
              onChange={(e) => set(["contact", "email"], e.target.value)}
              placeholder="you@tgmchurch.org"
            />
          </Field>
          <Field label="Phone" htmlFor="contact.phone" required>
            <Input
              id="contact.phone"
              value={draft.contact.phone}
              onChange={(e) => set(["contact", "phone"], e.target.value)}
              placeholder="+256 703 390633"
            />
          </Field>
          <Field label="Address" htmlFor="contact.address" required className="sm:col-span-2">
            <Input
              id="contact.address"
              value={draft.contact.address}
              onChange={(e) => set(["contact", "address"], e.target.value)}
              placeholder="Nakawuka, Wakiso District, Uganda"
            />
          </Field>
        </div>
      </Section>

      {/* Service times */}
      <Section
        title="Service Times"
        description="One entry per gathering, e.g. “Sundays at 10:00 AM”."
      >
        <div className="space-y-3">
          {draft.serviceTimes.length === 0 && (
            <p className="text-sm text-gray-500">
              No service times yet — add the first one below.
            </p>
          )}
          {draft.serviceTimes.map((time, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                aria-label={`Service time ${index + 1}`}
                value={time}
                onChange={(e) => setServiceTime(index, e.target.value)}
                placeholder="e.g. Sundays at 10:00 AM"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 shrink-0 text-gray-400 hover:bg-red-50 hover:text-red-600"
                onClick={() => removeServiceTime(index)}
                aria-label={`Remove service time ${index + 1}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addServiceTime}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add service time
          </Button>
        </div>
      </Section>

      {/* Social links */}
      <Section
        title="Social Links"
        description="Leave blank to hide a platform. Links appear in the footer and contact page."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {socials.map((social) => (
            <Field key={social.key} label={social.label} htmlFor={`socials.${social.key}`}>
              <Input
                id={`socials.${social.key}`}
                value={draft.socials[social.key]}
                onChange={(e) => set(["socials", social.key], e.target.value)}
                placeholder="https://…"
              />
            </Field>
          ))}
        </div>
      </Section>

      {/* Footer */}
      <Section title="Footer" description="The church blurb and copyright line at the bottom of every page.">
        <Field label="Description" htmlFor="footer.description" required>
          <Textarea
            id="footer.description"
            rows={2}
            value={draft.footer.description}
            onChange={(e) => set(["footer", "description"], e.target.value)}
          />
        </Field>
        <Field label="Copyright" htmlFor="footer.copyright" required>
          <Input
            id="footer.copyright"
            value={draft.footer.copyright}
            onChange={(e) => set(["footer", "copyright"], e.target.value)}
            placeholder="© 2025 TGM - The Gospel Mission. All rights reserved."
          />
        </Field>
      </Section>

      {/* SEO */}
      <Section
        title="Search Engines (SEO)"
        description="Global defaults used when a page has no SEO of its own."
      >
        <Field label="SEO title" htmlFor="seo.title" required>
          <Input
            id="seo.title"
            value={draft.seo.title}
            onChange={(e) => set(["seo", "title"], e.target.value)}
          />
        </Field>
        <Field label="SEO description" htmlFor="seo.description" required>
          <Textarea
            id="seo.description"
            rows={2}
            value={draft.seo.description}
            onChange={(e) => set(["seo", "description"], e.target.value)}
          />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Keywords (comma separated)" htmlFor="seo.keywords">
            <Input
              id="seo.keywords"
              value={keywordsInput}
              onChange={(e) => setKeywordsInput(e.target.value)}
              placeholder="church, Uganda, worship"
            />
          </Field>
          <Field label="Social share image URL" htmlFor="seo.image">
            <Input
              id="seo.image"
              value={draft.seo.image}
              onChange={(e) => set(["seo", "image"], e.target.value)}
              placeholder="https://…"
            />
          </Field>
        </div>
      </Section>

      {/* Save area */}
      <SaveBar status={status} message={message} />
    </form>
  );
}
