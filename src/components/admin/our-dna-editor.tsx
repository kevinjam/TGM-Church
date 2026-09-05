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
import { DNA_ICONS, type DnaIcon } from "@/lib/db/constants";
import type {
  DnaFocusItem,
  DnaIconItem,
  DnaScripture,
  DnaValueItem,
  OurDnaContent,
} from "@/lib/db/services/our-dna";

const PATH_OR_URL = /^(\/|https?:\/\/)/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_SCRIPTURES = 6;
const MAX_ROOTS = 6;
const MAX_FOCUS = 6;
const MAX_VALUES = 8;
const MAX_HIGHLIGHTS = 12;

const ICON_LABELS: Record<DnaIcon, string> = {
  globe: "Globe",
  users: "People",
  music: "Music",
  book: "Book",
  heart: "Heart",
};

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm";

type Draft = OurDnaContent;

function blankScripture(): DnaScripture {
  return { verse: "", reference: "" };
}

function blankRoot(): DnaIconItem {
  return { title: "", quote: "", reference: "", icon: "globe" };
}

function blankFocus(): DnaFocusItem {
  return { title: "", verse: "", reference: "", icon: "music" };
}

function blankValue(): DnaValueItem {
  return { title: "", description: "", verse: "", reference: "" };
}

export function OurDnaEditor({ initial }: { initial: OurDnaContent }) {
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

  const addScripture = () =>
    setDraft((prev) =>
      prev.foundation.scriptures.length >= MAX_SCRIPTURES
        ? prev
        : {
            ...prev,
            foundation: {
              ...prev.foundation,
              scriptures: [...prev.foundation.scriptures, blankScripture()],
            },
          }
    );

  const removeScripture = (index: number) =>
    setDraft((prev) =>
      prev.foundation.scriptures.length <= 1
        ? prev
        : {
            ...prev,
            foundation: {
              ...prev.foundation,
              scriptures: prev.foundation.scriptures.filter((_, i) => i !== index),
            },
          }
    );

  const addHighlight = () =>
    setDraft((prev) =>
      prev.mission.highlights.length >= MAX_HIGHLIGHTS
        ? prev
        : { ...prev, mission: { ...prev.mission, highlights: [...prev.mission.highlights, ""] } }
    );

  const removeHighlight = (index: number) =>
    setDraft((prev) =>
      prev.mission.highlights.length <= 1
        ? prev
        : {
            ...prev,
            mission: {
              ...prev.mission,
              highlights: prev.mission.highlights.filter((_, i) => i !== index),
            },
          }
    );

  const addRoot = () =>
    setDraft((prev) =>
      prev.roots.items.length >= MAX_ROOTS
        ? prev
        : { ...prev, roots: { ...prev.roots, items: [...prev.roots.items, blankRoot()] } }
    );

  const removeRoot = (index: number) =>
    setDraft((prev) =>
      prev.roots.items.length <= 1
        ? prev
        : { ...prev, roots: { ...prev.roots, items: prev.roots.items.filter((_, i) => i !== index) } }
    );

  const addFocus = () =>
    setDraft((prev) =>
      prev.focus.items.length >= MAX_FOCUS
        ? prev
        : { ...prev, focus: { ...prev.focus, items: [...prev.focus.items, blankFocus()] } }
    );

  const removeFocus = (index: number) =>
    setDraft((prev) =>
      prev.focus.items.length <= 1
        ? prev
        : { ...prev, focus: { ...prev.focus, items: prev.focus.items.filter((_, i) => i !== index) } }
    );

  const addValue = () =>
    setDraft((prev) =>
      prev.values.items.length >= MAX_VALUES
        ? prev
        : { ...prev, values: { ...prev.values, items: [...prev.values.items, blankValue()] } }
    );

  const removeValue = (index: number) =>
    setDraft((prev) =>
      prev.values.items.length <= 1
        ? prev
        : { ...prev, values: { ...prev.values, items: prev.values.items.filter((_, i) => i !== index) } }
    );

  const validateClient = (): string | null => {
    if (!draft.hero.title.trim()) return "The Our DNA heading is required.";
    if (!draft.hero.tagline.trim()) return "The Our DNA tagline is required.";
    if (!draft.hero.quote.trim()) return "The hero verse quote is required.";
    if (!draft.hero.reference.trim()) return "The hero verse reference is required.";
    if (!draft.vision.heading.trim() || !draft.vision.subtitle.trim() || !draft.vision.quote.trim()) {
      return "Vision heading, subtitle, and quote are required.";
    }
    if (!draft.foundation.heading.trim() || !draft.foundation.subtitle.trim()) {
      return "Biblical Foundation heading and subtitle are required.";
    }
    if (draft.foundation.scriptures.some((item) => !item.verse.trim() || !item.reference.trim())) {
      return "Each foundation scripture needs a verse and reference.";
    }
    if (!draft.foundation.summaryEmphasis.trim() || !draft.foundation.summaryBody.trim()) {
      return "The foundation summary is required.";
    }
    if (!draft.mission.heading.trim() || !draft.mission.subtitle.trim() || !draft.mission.quote.trim()) {
      return "Mission heading, subtitle, and quote are required.";
    }
    if (draft.mission.highlights.some((word) => !word.trim())) {
      return "Highlighted words cannot be empty.";
    }
    if (draft.roots.items.some((item) => !item.title.trim() || !item.quote.trim() || !item.reference.trim())) {
      return "Each biblical root needs a title, quote, and reference.";
    }
    if (draft.focus.items.some((item) => !item.title.trim() || !item.verse.trim() || !item.reference.trim())) {
      return "Each focus area needs a title, verse, and reference.";
    }
    if (
      draft.values.items.some(
        (item) => !item.title.trim() || !item.description.trim() || !item.verse.trim() || !item.reference.trim()
      )
    ) {
      return "Each core value needs a title, description, verse, and reference.";
    }
    if (!draft.contact.heading.trim()) return "The contact heading is required.";
    if (!draft.contact.email.trim() || !EMAIL_PATTERN.test(draft.contact.email.trim())) {
      return "A valid contact email is required.";
    }
    if (!draft.contact.phone.trim()) return "The contact phone is required.";
    if (!draft.contact.address.trim()) return "The contact address is required.";
    if (!draft.cta.heading.trim() || !draft.cta.body.trim()) {
      return "The call-to-action heading and text are required.";
    }
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
      const response = await fetch("/api/pages/our-dna", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        content?: OurDnaContent;
      };
      if (!response.ok || !data.content) {
        setStatus("error");
        setMessage(data.error ?? "Unable to save changes. Please try again.");
        return;
      }
      setDraft(data.content);
      setStatus("saved");
      setMessage("Our DNA page saved successfully.");
    } catch {
      setStatus("error");
      setMessage("Unable to save changes. Please check your connection and try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Section title="Hero" description="The large banner at the top of the Our DNA page.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Heading" htmlFor="dna.hero.title" required>
            <Input id="dna.hero.title" value={draft.hero.title} onChange={(e) => updateAt(["hero", "title"], e.target.value)} maxLength={200} />
          </Field>
          <Field label="Tagline" htmlFor="dna.hero.tagline" required>
            <Input id="dna.hero.tagline" value={draft.hero.tagline} onChange={(e) => updateAt(["hero", "tagline"], e.target.value)} maxLength={300} />
          </Field>
          <Field label="Verse quote" htmlFor="dna.hero.quote" required>
            <Input id="dna.hero.quote" value={draft.hero.quote} onChange={(e) => updateAt(["hero", "quote"], e.target.value)} maxLength={2000} />
          </Field>
          <Field label="Verse reference" htmlFor="dna.hero.reference" required>
            <Input id="dna.hero.reference" value={draft.hero.reference} onChange={(e) => updateAt(["hero", "reference"], e.target.value)} maxLength={120} />
          </Field>
        </div>
      </Section>

      <Section title="Vision" description="The gold vision quote block.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Heading" htmlFor="dna.vision.heading" required>
            <Input id="dna.vision.heading" value={draft.vision.heading} onChange={(e) => updateAt(["vision", "heading"], e.target.value)} maxLength={200} />
          </Field>
          <Field label="Subtitle" htmlFor="dna.vision.subtitle" required>
            <Input id="dna.vision.subtitle" value={draft.vision.subtitle} onChange={(e) => updateAt(["vision", "subtitle"], e.target.value)} maxLength={300} />
          </Field>
        </div>
        <Field label="Quote" htmlFor="dna.vision.quote" required>
          <Textarea id="dna.vision.quote" rows={3} value={draft.vision.quote} onChange={(e) => updateAt(["vision", "quote"], e.target.value)} maxLength={2000} />
        </Field>
      </Section>

      <Section title="Biblical Foundation" description="Scripture cards and the summary box beneath them.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Heading" htmlFor="dna.foundation.heading" required>
            <Input id="dna.foundation.heading" value={draft.foundation.heading} onChange={(e) => updateAt(["foundation", "heading"], e.target.value)} maxLength={200} />
          </Field>
          <Field label="Subtitle" htmlFor="dna.foundation.subtitle" required>
            <Input id="dna.foundation.subtitle" value={draft.foundation.subtitle} onChange={(e) => updateAt(["foundation", "subtitle"], e.target.value)} maxLength={300} />
          </Field>
        </div>
        {draft.foundation.scriptures.map((scripture, index) => (
          <div key={index} className="space-y-3 rounded-xl border border-gray-200 bg-gray-50/60 p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-700">Scripture {index + 1}</h4>
              {draft.foundation.scriptures.length > 1 && (
                <Button type="button" variant="ghost" size="sm" className="h-8 text-gray-400 hover:bg-red-50 hover:text-red-600" onClick={() => removeScripture(index)}>
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Remove
                </Button>
              )}
            </div>
            <Field label="Verse" htmlFor={`foundation-verse-${index}`} required>
              <Textarea id={`foundation-verse-${index}`} rows={2} value={scripture.verse} onChange={(e) => updateAt(["foundation", "scriptures", index, "verse"], e.target.value)} maxLength={2000} />
            </Field>
            <Field label="Reference" htmlFor={`foundation-ref-${index}`} required>
              <Input id={`foundation-ref-${index}`} value={scripture.reference} onChange={(e) => updateAt(["foundation", "scriptures", index, "reference"], e.target.value)} maxLength={120} />
            </Field>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addScripture}>
          <Plus className="mr-1.5 h-4 w-4" />
          Add scripture
        </Button>
        <Field label="Summary emphasis" htmlFor="dna.foundation.summaryEmphasis" required hint="Shown in blue at the start of the summary.">
          <Input id="dna.foundation.summaryEmphasis" value={draft.foundation.summaryEmphasis} onChange={(e) => updateAt(["foundation", "summaryEmphasis"], e.target.value)} maxLength={200} />
        </Field>
        <Field label="Summary text" htmlFor="dna.foundation.summaryBody" required>
          <Textarea id="dna.foundation.summaryBody" rows={3} value={draft.foundation.summaryBody} onChange={(e) => updateAt(["foundation", "summaryBody"], e.target.value)} maxLength={4000} />
        </Field>
      </Section>

      <Section title="Mission" description="The mission quote. Highlighted words appear in gold.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Heading" htmlFor="dna.mission.heading" required>
            <Input id="dna.mission.heading" value={draft.mission.heading} onChange={(e) => updateAt(["mission", "heading"], e.target.value)} maxLength={200} />
          </Field>
          <Field label="Subtitle" htmlFor="dna.mission.subtitle" required>
            <Input id="dna.mission.subtitle" value={draft.mission.subtitle} onChange={(e) => updateAt(["mission", "subtitle"], e.target.value)} maxLength={300} />
          </Field>
        </div>
        <Field label="Quote" htmlFor="dna.mission.quote" required>
          <Textarea id="dna.mission.quote" rows={4} value={draft.mission.quote} onChange={(e) => updateAt(["mission", "quote"], e.target.value)} maxLength={2000} />
        </Field>
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Highlighted words</p>
          {draft.mission.highlights.map((word, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                aria-label={`Highlighted word ${index + 1}`}
                value={word}
                onChange={(e) => updateAt(["mission", "highlights", index], e.target.value)}
                maxLength={40}
              />
              {draft.mission.highlights.length > 1 && (
                <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:bg-red-50 hover:text-red-600" onClick={() => removeHighlight(index)} aria-label={`Remove highlight ${index + 1}`}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addHighlight}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add highlighted word
          </Button>
        </div>
      </Section>

      <Section title="Biblical Roots" description="The two scripture cards with icons.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Heading" htmlFor="dna.roots.heading" required>
            <Input id="dna.roots.heading" value={draft.roots.heading} onChange={(e) => updateAt(["roots", "heading"], e.target.value)} maxLength={200} />
          </Field>
          <Field label="Subtitle" htmlFor="dna.roots.subtitle" required>
            <Input id="dna.roots.subtitle" value={draft.roots.subtitle} onChange={(e) => updateAt(["roots", "subtitle"], e.target.value)} maxLength={300} />
          </Field>
        </div>
        {draft.roots.items.map((item, index) => (
          <div key={index} className="space-y-3 rounded-xl border border-gray-200 bg-gray-50/60 p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-700">Root {index + 1}</h4>
              {draft.roots.items.length > 1 && (
                <Button type="button" variant="ghost" size="sm" className="h-8 text-gray-400 hover:bg-red-50 hover:text-red-600" onClick={() => removeRoot(index)}>
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Remove
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Title" htmlFor={`root-${index}-title`} required>
                <Input id={`root-${index}-title`} value={item.title} onChange={(e) => updateAt(["roots", "items", index, "title"], e.target.value)} maxLength={200} />
              </Field>
              <Field label="Icon" htmlFor={`root-${index}-icon`} required>
                <select id={`root-${index}-icon`} value={item.icon} onChange={(e) => updateAt(["roots", "items", index, "icon"], e.target.value)} className={selectClass}>
                  {DNA_ICONS.map((icon) => (
                    <option key={icon} value={icon}>{ICON_LABELS[icon]}</option>
                  ))}
                </select>
              </Field>
              <Field label="Quote" htmlFor={`root-${index}-quote`} required className="sm:col-span-2">
                <Textarea id={`root-${index}-quote`} rows={2} value={item.quote} onChange={(e) => updateAt(["roots", "items", index, "quote"], e.target.value)} maxLength={2000} />
              </Field>
              <Field label="Reference" htmlFor={`root-${index}-reference`} required>
                <Input id={`root-${index}-reference`} value={item.reference} onChange={(e) => updateAt(["roots", "items", index, "reference"], e.target.value)} maxLength={120} />
              </Field>
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addRoot}>
          <Plus className="mr-1.5 h-4 w-4" />
          Add root
        </Button>
      </Section>

      <Section title="Focus Areas" description="Worship, discipleship, and outreach cards.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Heading" htmlFor="dna.focus.heading" required>
            <Input id="dna.focus.heading" value={draft.focus.heading} onChange={(e) => updateAt(["focus", "heading"], e.target.value)} maxLength={200} />
          </Field>
          <Field label="Subtitle" htmlFor="dna.focus.subtitle" required>
            <Input id="dna.focus.subtitle" value={draft.focus.subtitle} onChange={(e) => updateAt(["focus", "subtitle"], e.target.value)} maxLength={300} />
          </Field>
        </div>
        {draft.focus.items.map((item, index) => (
          <div key={index} className="space-y-3 rounded-xl border border-gray-200 bg-gray-50/60 p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-700">Focus {index + 1}</h4>
              {draft.focus.items.length > 1 && (
                <Button type="button" variant="ghost" size="sm" className="h-8 text-gray-400 hover:bg-red-50 hover:text-red-600" onClick={() => removeFocus(index)}>
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Remove
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Title" htmlFor={`focus-${index}-title`} required>
                <Input id={`focus-${index}-title`} value={item.title} onChange={(e) => updateAt(["focus", "items", index, "title"], e.target.value)} maxLength={200} />
              </Field>
              <Field label="Icon" htmlFor={`focus-${index}-icon`} required>
                <select id={`focus-${index}-icon`} value={item.icon} onChange={(e) => updateAt(["focus", "items", index, "icon"], e.target.value)} className={selectClass}>
                  {DNA_ICONS.map((icon) => (
                    <option key={icon} value={icon}>{ICON_LABELS[icon]}</option>
                  ))}
                </select>
              </Field>
              <Field label="Verse text" htmlFor={`focus-${index}-verse`} required className="sm:col-span-2">
                <Input id={`focus-${index}-verse`} value={item.verse} onChange={(e) => updateAt(["focus", "items", index, "verse"], e.target.value)} maxLength={2000} />
              </Field>
              <Field label="Reference" htmlFor={`focus-${index}-reference`} required>
                <Input id={`focus-${index}-reference`} value={item.reference} onChange={(e) => updateAt(["focus", "items", index, "reference"], e.target.value)} maxLength={120} />
              </Field>
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addFocus}>
          <Plus className="mr-1.5 h-4 w-4" />
          Add focus area
        </Button>
      </Section>

      <Section title="Core Values" description="The four value cards.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Heading" htmlFor="dna.values.heading" required>
            <Input id="dna.values.heading" value={draft.values.heading} onChange={(e) => updateAt(["values", "heading"], e.target.value)} maxLength={200} />
          </Field>
          <Field label="Subtitle" htmlFor="dna.values.subtitle" required>
            <Input id="dna.values.subtitle" value={draft.values.subtitle} onChange={(e) => updateAt(["values", "subtitle"], e.target.value)} maxLength={300} />
          </Field>
        </div>
        {draft.values.items.map((item, index) => (
          <div key={index} className="space-y-3 rounded-xl border border-gray-200 bg-gray-50/60 p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-700">Value {index + 1}</h4>
              {draft.values.items.length > 1 && (
                <Button type="button" variant="ghost" size="sm" className="h-8 text-gray-400 hover:bg-red-50 hover:text-red-600" onClick={() => removeValue(index)}>
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Remove
                </Button>
              )}
            </div>
            <Field label="Title" htmlFor={`value-${index}-title`} required>
              <Input id={`value-${index}-title`} value={item.title} onChange={(e) => updateAt(["values", "items", index, "title"], e.target.value)} maxLength={200} />
            </Field>
            <Field label="Description" htmlFor={`value-${index}-description`} required>
              <Textarea id={`value-${index}-description`} rows={2} value={item.description} onChange={(e) => updateAt(["values", "items", index, "description"], e.target.value)} maxLength={1000} />
            </Field>
            <Field label="Verse" htmlFor={`value-${index}-verse`} required>
              <Textarea id={`value-${index}-verse`} rows={2} value={item.verse} onChange={(e) => updateAt(["values", "items", index, "verse"], e.target.value)} maxLength={2000} />
            </Field>
            <Field label="Reference" htmlFor={`value-${index}-reference`} required>
              <Input id={`value-${index}-reference`} value={item.reference} onChange={(e) => updateAt(["values", "items", index, "reference"], e.target.value)} maxLength={120} />
            </Field>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addValue}>
          <Plus className="mr-1.5 h-4 w-4" />
          Add value
        </Button>
      </Section>

      <Section title="Contact" description="Email, phone, and address shown near the bottom of the page.">
        <Field label="Heading" htmlFor="dna.contact.heading" required>
          <Input id="dna.contact.heading" value={draft.contact.heading} onChange={(e) => updateAt(["contact", "heading"], e.target.value)} maxLength={200} />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Email" htmlFor="dna.contact.email" required>
            <Input id="dna.contact.email" type="email" value={draft.contact.email} onChange={(e) => updateAt(["contact", "email"], e.target.value)} maxLength={254} />
          </Field>
          <Field label="Phone" htmlFor="dna.contact.phone" required>
            <Input id="dna.contact.phone" value={draft.contact.phone} onChange={(e) => updateAt(["contact", "phone"], e.target.value)} maxLength={40} />
          </Field>
          <Field label="Address" htmlFor="dna.contact.address" required className="sm:col-span-2">
            <Input id="dna.contact.address" value={draft.contact.address} onChange={(e) => updateAt(["contact", "address"], e.target.value)} maxLength={250} />
          </Field>
        </div>
      </Section>

      <Section title="Call to Action" description="The closing banner with two buttons.">
        <Field label="Heading" htmlFor="dna.cta.heading" required>
          <Input id="dna.cta.heading" value={draft.cta.heading} onChange={(e) => updateAt(["cta", "heading"], e.target.value)} maxLength={200} />
        </Field>
        <Field label="Text" htmlFor="dna.cta.body" required>
          <Textarea id="dna.cta.body" rows={3} value={draft.cta.body} onChange={(e) => updateAt(["cta", "body"], e.target.value)} maxLength={4000} />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Primary button text" htmlFor="dna.cta.primaryCta.label" required>
            <Input id="dna.cta.primaryCta.label" value={draft.cta.primaryCta.label} onChange={(e) => updateAt(["cta", "primaryCta", "label"], e.target.value)} maxLength={80} />
          </Field>
          <Field label="Primary button link" htmlFor="dna.cta.primaryCta.href" required>
            <Input id="dna.cta.primaryCta.href" value={draft.cta.primaryCta.href} onChange={(e) => updateAt(["cta", "primaryCta", "href"], e.target.value)} maxLength={500} />
          </Field>
          <Field label="Secondary button text" htmlFor="dna.cta.secondaryCta.label" required>
            <Input id="dna.cta.secondaryCta.label" value={draft.cta.secondaryCta.label} onChange={(e) => updateAt(["cta", "secondaryCta", "label"], e.target.value)} maxLength={80} />
          </Field>
          <Field label="Secondary button link" htmlFor="dna.cta.secondaryCta.href" required>
            <Input id="dna.cta.secondaryCta.href" value={draft.cta.secondaryCta.href} onChange={(e) => updateAt(["cta", "secondaryCta", "href"], e.target.value)} maxLength={500} />
          </Field>
        </div>
      </Section>

      <SaveBar status={status} message={message} />
    </form>
  );
}
