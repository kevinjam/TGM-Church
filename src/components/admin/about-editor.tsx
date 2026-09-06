"use client";

import { useState } from "react";
import Image from "next/image";
import { ImagePlus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  SaveBar,
  Section,
  adminSelectClass,
  type SaveStatus,
} from "@/components/admin/form-fields";
import { MediaPicker } from "@/components/admin/media-picker";
import { ABOUT_INFO_ICONS, type AboutInfoIcon } from "@/lib/db/constants";
import type { AboutContent, AboutTeamMember } from "@/lib/db/services/about";

const PATH_OR_URL = /^(\/|https?:\/\/)/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PARAGRAPHS = 8;
const MAX_CARDS = 6;
const MAX_MEMBERS = 12;

const ICON_LABELS: Record<AboutInfoIcon, string> = {
  location: "Location pin",
  calendar: "Calendar",
  community: "Community",
};

type Draft = AboutContent;

function newMemberId(): string {
  return `member-${Date.now().toString(36)}`;
}

function blankMember(): AboutTeamMember {
  return {
    id: newMemberId(),
    name: "",
    title: "",
    role: "",
    image: "",
    bio: "",
    email: "",
  };
}

export function AboutEditor({ initial }: { initial: AboutContent }) {
  const [draft, setDraft] = useState<Draft>(() => structuredClone(initial));
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [pickerFor, setPickerFor] = useState<number | null>(null);

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

  const addParagraph = () =>
    setDraft((prev) =>
      prev.story.paragraphs.length >= MAX_PARAGRAPHS
        ? prev
        : { ...prev, story: { ...prev.story, paragraphs: [...prev.story.paragraphs, ""] } }
    );

  const removeParagraph = (index: number) =>
    setDraft((prev) =>
      prev.story.paragraphs.length <= 1
        ? prev
        : {
            ...prev,
            story: {
              ...prev.story,
              paragraphs: prev.story.paragraphs.filter((_, i) => i !== index),
            },
          }
    );

  const addCard = () =>
    setDraft((prev) =>
      prev.info.cards.length >= MAX_CARDS
        ? prev
        : {
            ...prev,
            info: {
              ...prev.info,
              cards: [...prev.info.cards, { title: "", body: "", icon: "location" }],
            },
          }
    );

  const removeCard = (index: number) =>
    setDraft((prev) =>
      prev.info.cards.length <= 1
        ? prev
        : { ...prev, info: { ...prev.info, cards: prev.info.cards.filter((_, i) => i !== index) } }
    );

  const addMember = () =>
    setDraft((prev) =>
      prev.team.members.length >= MAX_MEMBERS
        ? prev
        : { ...prev, team: { ...prev.team, members: [...prev.team.members, blankMember()] } }
    );

  const removeMember = (index: number) =>
    setDraft((prev) =>
      prev.team.members.length <= 1
        ? prev
        : {
            ...prev,
            team: { ...prev.team, members: prev.team.members.filter((_, i) => i !== index) },
          }
    );

  const validateClient = (): string | null => {
    if (!draft.hero.title.trim()) return "The About heading is required.";
    if (!draft.hero.subtitle.trim()) return "The About subtitle is required.";
    if (!draft.story.heading.trim()) return "The Our Story heading is required.";
    if (draft.story.paragraphs.some((paragraph) => !paragraph.trim())) {
      return "Story paragraphs cannot be empty.";
    }
    if (!draft.info.heading.trim()) return "The church information heading is required.";
    if (!draft.info.subtitle.trim()) return "The church information subtitle is required.";
    for (let i = 0; i < draft.info.cards.length; i++) {
      if (!draft.info.cards[i].title.trim()) return `Information card ${i + 1} needs a title.`;
      if (!draft.info.cards[i].body.trim()) return `Information card ${i + 1} needs a description.`;
    }
    if (!draft.team.heading.trim()) return "The Grace Team heading is required.";
    if (!draft.team.subtitle.trim()) return "The Grace Team subtitle is required.";
    for (let i = 0; i < draft.team.members.length; i++) {
      const member = draft.team.members[i];
      const n = i + 1;
      if (!member.name.trim()) return `Team member ${n} needs a name.`;
      if (!member.title.trim()) return `Team member ${n} needs a title.`;
      if (!member.role.trim()) return `Team member ${n} needs a role.`;
      if (!member.bio.trim()) return `Team member ${n} needs a bio.`;
      if (!member.email.trim() || !EMAIL_PATTERN.test(member.email.trim())) {
        return `Team member ${n} needs a valid email.`;
      }
      if (member.image.trim() && !PATH_OR_URL.test(member.image.trim())) {
        return `Team member ${n} image must be a /path or http(s) URL.`;
      }
    }
    if (!draft.cta.heading.trim()) return "The call-to-action heading is required.";
    if (!draft.cta.body.trim()) return "The call-to-action text is required.";
    for (const cta of [draft.cta.primaryCta, draft.cta.secondaryCta]) {
      if (!cta.label.trim()) return "Both button labels are required.";
      if (!cta.href.trim() || !PATH_OR_URL.test(cta.href.trim())) {
        return "Button links must start with / or http(s)://";
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

    try {
      const response = await fetch("/api/pages/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        content?: AboutContent;
      };
      if (!response.ok || !data.content) {
        setStatus("error");
        setMessage(data.error ?? "Unable to save changes. Please try again.");
        return;
      }
      setDraft(data.content);
      setStatus("saved");
      setMessage("About page saved successfully.");
    } catch {
      setStatus("error");
      setMessage("Unable to save changes. Please check your connection and try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Section title="Hero" description="The large banner at the top of the About page.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Heading" htmlFor="about.hero.title" required>
            <Input
              id="about.hero.title"
              value={draft.hero.title}
              onChange={(e) => updateAt(["hero", "title"], e.target.value)}
              maxLength={200}
            />
          </Field>
          <Field label="Subtitle" htmlFor="about.hero.subtitle" required>
            <Input
              id="about.hero.subtitle"
              value={draft.hero.subtitle}
              onChange={(e) => updateAt(["hero", "subtitle"], e.target.value)}
              maxLength={300}
            />
          </Field>
        </div>
      </Section>

      <Section title="Our Story" description="The church story paragraphs below the hero.">
        <Field label="Heading" htmlFor="about.story.heading" required>
          <Input
            id="about.story.heading"
            value={draft.story.heading}
            onChange={(e) => updateAt(["story", "heading"], e.target.value)}
            maxLength={200}
          />
        </Field>
        <div className="space-y-3">
          {draft.story.paragraphs.map((paragraph, index) => (
            <div key={index} className="flex items-start gap-2">
              <Textarea
                aria-label={`Story paragraph ${index + 1}`}
                rows={4}
                value={paragraph}
                onChange={(e) => updateAt(["story", "paragraphs", index], e.target.value)}
                maxLength={4000}
                className="flex-1"
              />
              {draft.story.paragraphs.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mt-1 h-9 w-9 shrink-0 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  onClick={() => removeParagraph(index)}
                  aria-label={`Remove paragraph ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addParagraph}>
          <Plus className="mr-1.5 h-4 w-4" />
          Add paragraph
        </Button>
      </Section>

      <Section
        title="Church Information"
        description="The three cards for location, service times, and community."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Heading" htmlFor="about.info.heading" required>
            <Input
              id="about.info.heading"
              value={draft.info.heading}
              onChange={(e) => updateAt(["info", "heading"], e.target.value)}
              maxLength={200}
            />
          </Field>
          <Field label="Subtitle" htmlFor="about.info.subtitle" required>
            <Input
              id="about.info.subtitle"
              value={draft.info.subtitle}
              onChange={(e) => updateAt(["info", "subtitle"], e.target.value)}
              maxLength={300}
            />
          </Field>
        </div>
        {draft.info.cards.map((card, index) => (
          <div key={index} className="space-y-3 rounded-xl border border-gray-200 bg-gray-50/60 p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-700">Card {index + 1}</h4>
              {draft.info.cards.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  onClick={() => removeCard(index)}
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Remove
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Title" htmlFor={`info-card-${index}-title`} required>
                <Input
                  id={`info-card-${index}-title`}
                  value={card.title}
                  onChange={(e) => updateAt(["info", "cards", index, "title"], e.target.value)}
                  maxLength={120}
                />
              </Field>
              <Field label="Icon" htmlFor={`info-card-${index}-icon`} required>
                <select
                  id={`info-card-${index}-icon`}
                  value={card.icon}
                  onChange={(e) => updateAt(["info", "cards", index, "icon"], e.target.value)}
                  className={adminSelectClass}
                >
                  {ABOUT_INFO_ICONS.map((icon) => (
                    <option key={icon} value={icon}>
                      {ICON_LABELS[icon]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Text" htmlFor={`info-card-${index}-body`} required className="sm:col-span-2">
                <Input
                  id={`info-card-${index}-body`}
                  value={card.body}
                  onChange={(e) => updateAt(["info", "cards", index, "body"], e.target.value)}
                  maxLength={400}
                />
              </Field>
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addCard}>
          <Plus className="mr-1.5 h-4 w-4" />
          Add card
        </Button>
      </Section>

      <Section title="Grace Team" description="Leaders shown on the About page.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Heading" htmlFor="about.team.heading" required>
            <Input
              id="about.team.heading"
              value={draft.team.heading}
              onChange={(e) => updateAt(["team", "heading"], e.target.value)}
              maxLength={200}
            />
          </Field>
          <Field label="Subtitle" htmlFor="about.team.subtitle" required className="sm:col-span-2">
            <Input
              id="about.team.subtitle"
              value={draft.team.subtitle}
              onChange={(e) => updateAt(["team", "subtitle"], e.target.value)}
              maxLength={300}
            />
          </Field>
        </div>
        {draft.team.members.map((member, index) => (
          <div key={member.id} className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/60 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-700">Member {index + 1}</h4>
              {draft.team.members.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  onClick={() => removeMember(index)}
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Remove
                </Button>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
                {member.image ? (
                  <Image src={member.image} alt="" fill sizes="80px" className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                    Photo
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 sm:flex-row">
                <Input
                  aria-label={`${member.name || `Member ${index + 1}`} photo`}
                  value={member.image}
                  onChange={(e) => updateAt(["team", "members", index, "image"], e.target.value)}
                  placeholder="Image path or URL"
                  maxLength={2048}
                />
                <Button type="button" variant="outline" onClick={() => setPickerFor(index)}>
                  <ImagePlus className="mr-1.5 h-4 w-4" />
                  Choose
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Name" htmlFor={`member-${index}-name`} required>
                <Input
                  id={`member-${index}-name`}
                  value={member.name}
                  onChange={(e) => updateAt(["team", "members", index, "name"], e.target.value)}
                  maxLength={160}
                />
              </Field>
              <Field label="Title" htmlFor={`member-${index}-title`} required>
                <Input
                  id={`member-${index}-title`}
                  value={member.title}
                  onChange={(e) => updateAt(["team", "members", index, "title"], e.target.value)}
                  maxLength={200}
                />
              </Field>
              <Field label="Role" htmlFor={`member-${index}-role`} required>
                <Input
                  id={`member-${index}-role`}
                  value={member.role}
                  onChange={(e) => updateAt(["team", "members", index, "role"], e.target.value)}
                  maxLength={200}
                />
              </Field>
              <Field label="Email" htmlFor={`member-${index}-email`} required>
                <Input
                  id={`member-${index}-email`}
                  type="email"
                  value={member.email}
                  onChange={(e) => updateAt(["team", "members", index, "email"], e.target.value)}
                  maxLength={254}
                />
              </Field>
              <Field label="Bio" htmlFor={`member-${index}-bio`} required className="sm:col-span-2">
                <Textarea
                  id={`member-${index}-bio`}
                  rows={3}
                  value={member.bio}
                  onChange={(e) => updateAt(["team", "members", index, "bio"], e.target.value)}
                  maxLength={2000}
                />
              </Field>
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addMember}>
          <Plus className="mr-1.5 h-4 w-4" />
          Add team member
        </Button>
      </Section>

      <Section title="Call to Action" description="The blue banner at the bottom of the About page.">
        <Field label="Heading" htmlFor="about.cta.heading" required>
          <Input
            id="about.cta.heading"
            value={draft.cta.heading}
            onChange={(e) => updateAt(["cta", "heading"], e.target.value)}
            maxLength={200}
          />
        </Field>
        <Field label="Text" htmlFor="about.cta.body" required>
          <Textarea
            id="about.cta.body"
            rows={3}
            value={draft.cta.body}
            onChange={(e) => updateAt(["cta", "body"], e.target.value)}
            maxLength={4000}
          />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Primary button text" htmlFor="about.cta.primaryCta.label" required>
            <Input
              id="about.cta.primaryCta.label"
              value={draft.cta.primaryCta.label}
              onChange={(e) => updateAt(["cta", "primaryCta", "label"], e.target.value)}
              maxLength={80}
            />
          </Field>
          <Field label="Primary button link" htmlFor="about.cta.primaryCta.href" required>
            <Input
              id="about.cta.primaryCta.href"
              value={draft.cta.primaryCta.href}
              onChange={(e) => updateAt(["cta", "primaryCta", "href"], e.target.value)}
              maxLength={500}
            />
          </Field>
          <Field label="Secondary button text" htmlFor="about.cta.secondaryCta.label" required>
            <Input
              id="about.cta.secondaryCta.label"
              value={draft.cta.secondaryCta.label}
              onChange={(e) => updateAt(["cta", "secondaryCta", "label"], e.target.value)}
              maxLength={80}
            />
          </Field>
          <Field label="Secondary button link" htmlFor="about.cta.secondaryCta.href" required>
            <Input
              id="about.cta.secondaryCta.href"
              value={draft.cta.secondaryCta.href}
              onChange={(e) => updateAt(["cta", "secondaryCta", "href"], e.target.value)}
              maxLength={500}
            />
          </Field>
        </div>
      </Section>

      <SaveBar status={status} message={message} />

      <MediaPicker
        open={pickerFor !== null}
        onOpenChange={(open) => !open && setPickerFor(null)}
        onSelect={(url) => {
          if (pickerFor !== null) {
            updateAt(["team", "members", pickerFor, "image"], url);
          }
          setPickerFor(null);
        }}
      />
    </form>
  );
}
