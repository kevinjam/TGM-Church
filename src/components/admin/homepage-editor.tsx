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
  type SaveStatus,
} from "@/components/admin/form-fields";
import { MediaPicker } from "@/components/admin/media-picker";
import { EVENT_CATEGORIES, SERMON_CATEGORIES } from "@/lib/db/constants";
import type {
  HomepageContent,
  HomeUpcomingEvent,
} from "@/lib/db/services/homepage";

/* Mirrors the server-side caps in /api/pages/[slug] for good UX. */
const SLIDE_MAX = {
  title: 80,
  subtitle: 160,
  tagline: 160,
  verse: 120,
  image: 2048,
  description: 1000,
} as const;
const TEXT_MAX = {
  heading: 200,
  tagline: 300,
  verse: 120,
  title: 200,
  long: 4000,
  closing: 500,
  cardTitle: 200,
  cardDescription: 2000,
  quote: 600,
  reference: 120,
} as const;

const FEATURED_MAX = {
  heading: 200,
  tagline: 300,
  title: 200,
  description: 2000,
  speaker: 160,
  date: 80,
  duration: 40,
  thumbnail: 2048,
} as const;
const EVENT_MAX = {
  heading: 200,
  tagline: 300,
  title: 200,
  description: 2000,
  time: 80,
  location: 200,
  image: 2048,
} as const;

const MAX_SLIDES = 6;
const MAX_PARAGRAPHS = 6;
const MAX_CARDS = 6;
const MAX_EVENTS = 6;

const PATH_OR_URL = /^(\/|https?:\/\/)/i;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

type PickerTarget =
  | { kind: "hero"; index: number }
  | { kind: "sermon" }
  | { kind: "event"; index: number };

function newSlideId(): string {
  return `slide-${Date.now().toString(36)}`;
}

function blankSlide(): HomepageContent["hero"]["slides"][number] {
  return {
    id: newSlideId(),
    title: "",
    subtitle: "",
    tagline: "",
    verse: "",
    image: "",
    description: "",
  };
}

function newEventId(): string {
  return `event-${Date.now().toString(36)}`;
}

function blankEvent(): HomeUpcomingEvent {
  return {
    id: newEventId(),
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "Worship",
    image: "",
  };
}

type Draft = HomepageContent;

export function HomepageEditor({ initial }: { initial: HomepageContent }) {
  const [draft, setDraft] = useState<Draft>(() => structuredClone(initial));
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [pickerFor, setPickerFor] = useState<PickerTarget | null>(null);

  /** Generic deep-path text setter: path parts can be string keys or array indexes. */
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

  /* Hero slide operations */
  const addSlide = () =>
    setDraft((prev) =>
      prev.hero.slides.length >= MAX_SLIDES
        ? prev
        : { ...prev, hero: { ...prev.hero, slides: [...prev.hero.slides, blankSlide()] } }
    );

  const removeSlide = (index: number) =>
    setDraft((prev) =>
      prev.hero.slides.length <= 1
        ? prev
        : {
            ...prev,
            hero: {
              ...prev.hero,
              slides: prev.hero.slides.filter((_, i) => i !== index),
            },
          }
    );

  /* Welcome array operations */
  const addParagraph = () =>
    setDraft((prev) =>
      prev.welcome.missionBox.body.length >= MAX_PARAGRAPHS
        ? prev
        : {
            ...prev,
            welcome: {
              ...prev.welcome,
              missionBox: {
                ...prev.welcome.missionBox,
                body: [...prev.welcome.missionBox.body, ""],
              },
            },
          }
    );

  const removeParagraph = (index: number) =>
    setDraft((prev) =>
      prev.welcome.missionBox.body.length <= 1
        ? prev
        : {
            ...prev,
            welcome: {
              ...prev.welcome,
              missionBox: {
                ...prev.welcome.missionBox,
                body: prev.welcome.missionBox.body.filter((_, i) => i !== index),
              },
            },
          }
    );

  const addCard = () =>
    setDraft((prev) =>
      prev.welcome.cards.length >= MAX_CARDS
        ? prev
        : {
            ...prev,
            welcome: {
              ...prev.welcome,
              cards: [...prev.welcome.cards, { title: "", description: "" }],
            },
          }
    );

  const removeCard = (index: number) =>
    setDraft((prev) =>
      prev.welcome.cards.length <= 1
        ? prev
        : {
            ...prev,
            welcome: {
              ...prev.welcome,
              cards: prev.welcome.cards.filter((_, i) => i !== index),
            },
          }
    );

  const addEvent = () =>
    setDraft((prev) =>
      prev.upcomingEvents.events.length >= MAX_EVENTS
        ? prev
        : {
            ...prev,
            upcomingEvents: {
              ...prev.upcomingEvents,
              events: [...prev.upcomingEvents.events, blankEvent()],
            },
          }
    );

  const removeEvent = (index: number) =>
    setDraft((prev) =>
      prev.upcomingEvents.events.length <= 1
        ? prev
        : {
            ...prev,
            upcomingEvents: {
              ...prev.upcomingEvents,
              events: prev.upcomingEvents.events.filter((_, i) => i !== index),
            },
          }
    );

  const validateClient = (): string | null => {
    const { hero, welcome } = draft;

    for (let i = 0; i < hero.slides.length; i++) {
      const slide = hero.slides[i];
      const n = i + 1;
      if (!slide.title.trim()) return `Slide ${n} needs a title.`;
      if (!slide.subtitle.trim()) return `Slide ${n} needs a subtitle.`;
      if (!slide.tagline.trim()) return `Slide ${n} needs a tagline.`;
      if (!slide.verse.trim()) return `Slide ${n} needs a verse reference.`;
      if (!slide.description.trim()) return `Slide ${n} needs a description.`;
      if (!slide.image.trim()) return `Slide ${n} needs a background image.`;
      if (!PATH_OR_URL.test(slide.image.trim())) {
        return `Slide ${n} image must be an uploaded /uploads/… path or an http(s) URL.`;
      }
    }
    for (const cta of [hero.primaryCta, hero.secondaryCta]) {
      if (!cta.label.trim()) return "Both button labels are required.";
      if (!cta.href.trim() || !PATH_OR_URL.test(cta.href.trim())) {
        return "Button links must start with / or http(s)://";
      }
    }

    if (!welcome.heading.trim()) return "The welcome heading is required.";
    if (!welcome.tagline.trim()) return "The welcome tagline is required.";
    if (!welcome.verse.trim()) return "The welcome verse reference is required.";
    if (!welcome.foundation.title.trim()) return "The Biblical Foundation title is required.";
    if (!welcome.foundation.body.trim()) return "The Biblical Foundation text is required.";
    if (!welcome.missionBox.title.trim()) return "The Our Mission title is required.";
    if (!welcome.missionBox.closing.trim()) return "The Our Mission closing line is required.";
    if (welcome.missionBox.body.some((paragraph) => !paragraph.trim())) {
      return "The Our Mission paragraphs cannot be empty.";
    }
    for (let i = 0; i < welcome.cards.length; i++) {
      if (!welcome.cards[i].title.trim()) return `Card ${i + 1} needs a title.`;
      if (!welcome.cards[i].description.trim()) return `Card ${i + 1} needs a description.`;
    }
    if (!welcome.unityQuote.quote.trim()) return "The unity quote is required.";
    if (!welcome.unityQuote.reference.trim()) return "The unity quote reference is required.";

    const { featuredSermon, upcomingEvents } = draft;
    if (!featuredSermon.heading.trim()) return "The featured sermon heading is required.";
    if (!featuredSermon.tagline.trim()) return "The featured sermon tagline is required.";
    if (!featuredSermon.cta.label.trim()) return "The featured sermon button label is required.";
    if (!featuredSermon.cta.href.trim() || !PATH_OR_URL.test(featuredSermon.cta.href.trim())) {
      return "The featured sermon button link must start with / or http(s)://";
    }
    if (!featuredSermon.sermon.title.trim()) return "The featured sermon needs a title.";
    if (!featuredSermon.sermon.description.trim()) return "The featured sermon needs a description.";
    if (!featuredSermon.sermon.speaker.trim()) return "The featured sermon needs a speaker.";
    if (!featuredSermon.sermon.date.trim()) return "The featured sermon needs a date.";
    if (
      featuredSermon.sermon.thumbnail.trim() &&
      !PATH_OR_URL.test(featuredSermon.sermon.thumbnail.trim())
    ) {
      return "The featured sermon image must be an uploaded /uploads/… path or an http(s) URL.";
    }

    if (!upcomingEvents.heading.trim()) return "The upcoming events heading is required.";
    if (!upcomingEvents.tagline.trim()) return "The upcoming events tagline is required.";
    if (!upcomingEvents.cta.label.trim()) return "The upcoming events button label is required.";
    if (!upcomingEvents.cta.href.trim() || !PATH_OR_URL.test(upcomingEvents.cta.href.trim())) {
      return "The upcoming events button link must start with / or http(s)://";
    }
    if (upcomingEvents.events.length === 0) return "At least one upcoming event is required.";
    for (let i = 0; i < upcomingEvents.events.length; i++) {
      const event = upcomingEvents.events[i];
      const n = i + 1;
      if (!event.title.trim()) return `Event ${n} needs a title.`;
      if (!event.description.trim()) return `Event ${n} needs a description.`;
      if (!event.date.trim() || !ISO_DATE.test(event.date.trim())) {
        return `Event ${n} needs a valid date.`;
      }
      if (!event.time.trim()) return `Event ${n} needs a time.`;
      if (!event.location.trim()) return `Event ${n} needs a location.`;
      if (event.image.trim() && !PATH_OR_URL.test(event.image.trim())) {
        return `Event ${n} image must be an uploaded /uploads/… path or an http(s) URL.`;
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
      const response = await fetch("/api/pages/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        content?: HomepageContent;
      };

      if (!response.ok || !data.content) {
        setStatus("error");
        setMessage(data.error ?? "Unable to save changes. Please try again.");
        return;
      }

      setDraft(data.content);
      setStatus("saved");
      setMessage("Homepage saved successfully.");
    } catch {
      setStatus("error");
      setMessage("Unable to save changes. Please check your connection and try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ============ HERO SLIDER ============ */}
      <Section
        title="Hero Slider"
        description="The large rotating banner at the top of the homepage. Visitors see one slide at a time, changing every 5 seconds."
      >
        <div className="space-y-6">
          {draft.hero.slides.map((slide, index) => (
            <div
              key={slide.id}
              className="rounded-xl border border-gray-200 bg-gray-50/60 p-4 sm:p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-700">
                  Slide {index + 1}
                </h4>
                {draft.hero.slides.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    onClick={() => removeSlide(index)}
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Remove slide
                  </Button>
                )}
              </div>

              {/* Image */}
              <div className="mb-4 space-y-3">
                <div className="relative h-28 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                  {slide.image ? (
                    <Image
                      src={slide.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                      No image selected
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    aria-label={`Slide ${index + 1} background image`}
                    value={slide.image}
                    onChange={(e) => updateAt(["hero", "slides", index, "image"], e.target.value)}
                    placeholder="Paste an image URL or choose from the library"
                    maxLength={SLIDE_MAX.image}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPickerFor({ kind: "hero", index })}
                    className="shrink-0"
                  >
                    <ImagePlus className="mr-1.5 h-4 w-4" />
                    Choose image
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="Title"
                  htmlFor={`slide-${index}-title`}
                  required
                >
                  <Input
                    id={`slide-${index}-title`}
                    value={slide.title}
                    onChange={(e) => updateAt(["hero", "slides", index, "title"], e.target.value)}
                    placeholder="TGM"
                    maxLength={SLIDE_MAX.title}
                  />
                </Field>
                <Field
                  label="Subtitle"
                  htmlFor={`slide-${index}-subtitle`}
                  required
                >
                  <Input
                    id={`slide-${index}-subtitle`}
                    value={slide.subtitle}
                    onChange={(e) => updateAt(["hero", "slides", index, "subtitle"], e.target.value)}
                    placeholder="The Gospel Mission"
                    maxLength={SLIDE_MAX.subtitle}
                  />
                </Field>
                <Field
                  label="Tagline"
                  htmlFor={`slide-${index}-tagline`}
                  required
                >
                  <Input
                    id={`slide-${index}-tagline`}
                    value={slide.tagline}
                    onChange={(e) => updateAt(["hero", "slides", index, "tagline"], e.target.value)}
                    placeholder="Connecting Hearts to His Grace"
                    maxLength={SLIDE_MAX.tagline}
                  />
                </Field>
                <Field
                  label="Verse reference"
                  htmlFor={`slide-${index}-verse`}
                  required
                >
                  <Input
                    id={`slide-${index}-verse`}
                    value={slide.verse}
                    onChange={(e) => updateAt(["hero", "slides", index, "verse"], e.target.value)}
                    placeholder="Hebrews 4:16"
                    maxLength={SLIDE_MAX.verse}
                  />
                </Field>
                <Field
                  label="Description"
                  htmlFor={`slide-${index}-description`}
                  required
                  className="sm:col-span-2"
                >
                  <Textarea
                    id={`slide-${index}-description`}
                    rows={2}
                    value={slide.description}
                    onChange={(e) => updateAt(["hero", "slides", index, "description"], e.target.value)}
                    placeholder="Shown under the tagline in this slide."
                    maxLength={SLIDE_MAX.description}
                  />
                </Field>
              </div>
            </div>
          ))}

          <Button type="button" variant="outline" size="sm" onClick={addSlide}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add slide
          </Button>

          {/* Hero buttons */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
            <h4 className="mb-4 text-sm font-semibold text-gray-700">Hero buttons</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Primary button text" htmlFor="hero.primaryCta.label" required>
                <Input
                  id="hero.primaryCta.label"
                  value={draft.hero.primaryCta.label}
                  onChange={(e) => updateAt(["hero", "primaryCta", "label"], e.target.value)}
                  placeholder="Learn More"
                  maxLength={80}
                />
              </Field>
              <Field label="Primary button link" htmlFor="hero.primaryCta.href" required>
                <Input
                  id="hero.primaryCta.href"
                  value={draft.hero.primaryCta.href}
                  onChange={(e) => updateAt(["hero", "primaryCta", "href"], e.target.value)}
                  placeholder="/about"
                  maxLength={500}
                />
              </Field>
              <Field label="Secondary button text" htmlFor="hero.secondaryCta.label" required>
                <Input
                  id="hero.secondaryCta.label"
                  value={draft.hero.secondaryCta.label}
                  onChange={(e) => updateAt(["hero", "secondaryCta", "label"], e.target.value)}
                  placeholder="Watch Sermons"
                  maxLength={80}
                />
              </Field>
              <Field label="Secondary button link" htmlFor="hero.secondaryCta.href" required>
                <Input
                  id="hero.secondaryCta.href"
                  value={draft.hero.secondaryCta.href}
                  onChange={(e) => updateAt(["hero", "secondaryCta", "href"], e.target.value)}
                  placeholder="/sermons"
                  maxLength={500}
                />
              </Field>
            </div>
          </div>
        </div>
      </Section>

      {/* ============ WELCOME SECTION ============ */}
      <Section
        title="Welcome Section"
        description="The “Throne of Grace Ministries” intro block below the hero — heading, two boxes, the three cards, and the unity verse."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Heading" htmlFor="welcome.heading" required>
            <Input
              id="welcome.heading"
              value={draft.welcome.heading}
              onChange={(e) => updateAt(["welcome", "heading"], e.target.value)}
              placeholder="THRONE OF GRACE MINISTRIES"
              maxLength={TEXT_MAX.heading}
            />
          </Field>
          <Field label="Tagline" htmlFor="welcome.tagline" required>
            <Input
              id="welcome.tagline"
              value={draft.welcome.tagline}
              onChange={(e) => updateAt(["welcome", "tagline"], e.target.value)}
              placeholder="Connecting Hearts to His Grace"
              maxLength={TEXT_MAX.tagline}
            />
          </Field>
          <Field label="Verse reference" htmlFor="welcome.verse" required>
            <Input
              id="welcome.verse"
              value={draft.welcome.verse}
              onChange={(e) => updateAt(["welcome", "verse"], e.target.value)}
              placeholder="Hebrews 4:16"
              maxLength={TEXT_MAX.verse}
            />
          </Field>
        </div>

        {/* Two horizontal boxes */}
        <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/60 p-4 sm:p-5">
          <h4 className="text-sm font-semibold text-gray-700">Left box — Biblical Foundation</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Box title" htmlFor="welcome.foundation.title" required>
              <Input
                id="welcome.foundation.title"
                value={draft.welcome.foundation.title}
                onChange={(e) => updateAt(["welcome", "foundation", "title"], e.target.value)}
                placeholder="Biblical Foundation"
                maxLength={TEXT_MAX.title}
              />
            </Field>
          </div>
          <Field label="Text" htmlFor="welcome.foundation.body" required>
            <Textarea
              id="welcome.foundation.body"
              rows={5}
              value={draft.welcome.foundation.body}
              onChange={(e) => updateAt(["welcome", "foundation", "body"], e.target.value)}
              maxLength={TEXT_MAX.long}
            />
          </Field>

          <h4 className="pt-2 text-sm font-semibold text-gray-700">Right box — Our Mission</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Box title" htmlFor="welcome.missionBox.title" required>
              <Input
                id="welcome.missionBox.title"
                value={draft.welcome.missionBox.title}
                onChange={(e) => updateAt(["welcome", "missionBox", "title"], e.target.value)}
                placeholder="Our Mission"
                maxLength={TEXT_MAX.title}
              />
            </Field>
          </div>
          <div className="space-y-3">
            {draft.welcome.missionBox.body.map((paragraph, index) => (
              <div key={index} className="flex items-start gap-2">
                <Textarea
                  aria-label={`Our Mission paragraph ${index + 1}`}
                  rows={3}
                  value={paragraph}
                  onChange={(e) => updateAt(["welcome", "missionBox", "body", index], e.target.value)}
                  maxLength={TEXT_MAX.long}
                  className="flex-1"
                />
                {draft.welcome.missionBox.body.length > 1 && (
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
          <Field label="Closing line" htmlFor="welcome.missionBox.closing" required>
            <Input
              id="welcome.missionBox.closing"
              value={draft.welcome.missionBox.closing}
              onChange={(e) => updateAt(["welcome", "missionBox", "closing"], e.target.value)}
              placeholder="Join us as we continue this legacy of faithful partnership…"
              maxLength={TEXT_MAX.closing}
            />
          </Field>
        </div>

        {/* Three cards */}
        <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/60 p-4 sm:p-5">
          <h4 className="text-sm font-semibold text-gray-700">
            Cards (Our Mission, Our Community, Our Foundation)
          </h4>
          {draft.welcome.cards.map((card, index) => (
            <div
              key={index}
              className="space-y-3 rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-500">Card {index + 1}</p>
                {draft.welcome.cards.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    onClick={() => removeCard(index)}
                    aria-label={`Remove card ${index + 1}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
              <Field label="Title" htmlFor={`welcome.card-${index}.title`} required>
                <Input
                  id={`welcome.card-${index}.title`}
                  value={card.title}
                  onChange={(e) => updateAt(["welcome", "cards", index, "title"], e.target.value)}
                  placeholder="Our Mission"
                  maxLength={TEXT_MAX.cardTitle}
                />
              </Field>
              <Field label="Description" htmlFor={`welcome.card-${index}.description`} required>
                <Textarea
                  id={`welcome.card-${index}.description`}
                  rows={2}
                  value={card.description}
                  onChange={(e) =>
                    updateAt(["welcome", "cards", index, "description"], e.target.value)
                  }
                  maxLength={TEXT_MAX.cardDescription}
                />
              </Field>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addCard}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add card
          </Button>
        </div>

        {/* Unity quote */}
        <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/60 p-4 sm:p-5">
          <h4 className="text-sm font-semibold text-gray-700">Unity verse highlight</h4>
          <Field label="Quote" htmlFor="welcome.unityQuote.quote" required>
            <Textarea
              id="welcome.unityQuote.quote"
              rows={2}
              value={draft.welcome.unityQuote.quote}
              onChange={(e) => updateAt(["welcome", "unityQuote", "quote"], e.target.value)}
              placeholder="How good and pleasant it is when brothers dwell together in unity!"
              maxLength={TEXT_MAX.quote}
            />
          </Field>
          <Field label="Reference" htmlFor="welcome.unityQuote.reference" required>
            <Input
              id="welcome.unityQuote.reference"
              value={draft.welcome.unityQuote.reference}
              onChange={(e) => updateAt(["welcome", "unityQuote", "reference"], e.target.value)}
              placeholder="Psalm 133:1"
              maxLength={TEXT_MAX.reference}
            />
          </Field>
        </div>
      </Section>

      {/* ============ FEATURED SERMON ============ */}
      <Section
        title="Featured Sermon"
        description="The sermon highlight on the homepage. The full sermon library is managed separately later."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Heading" htmlFor="featuredSermon.heading" required>
            <Input
              id="featuredSermon.heading"
              value={draft.featuredSermon.heading}
              onChange={(e) => updateAt(["featuredSermon", "heading"], e.target.value)}
              placeholder="Featured Sermon"
              maxLength={FEATURED_MAX.heading}
            />
          </Field>
          <Field label="Tagline" htmlFor="featuredSermon.tagline" required>
            <Input
              id="featuredSermon.tagline"
              value={draft.featuredSermon.tagline}
              onChange={(e) => updateAt(["featuredSermon", "tagline"], e.target.value)}
              placeholder="Join us in worship and learning from God's Word"
              maxLength={FEATURED_MAX.tagline}
            />
          </Field>
        </div>

        <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/60 p-4 sm:p-5">
          <h4 className="text-sm font-semibold text-gray-700">Sermon details</h4>

          <div className="space-y-3">
            <div className="relative h-28 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
              {draft.featuredSermon.sermon.thumbnail ? (
                <Image
                  src={draft.featuredSermon.sermon.thumbnail}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                  Optional thumbnail — visitors see a blue placeholder if empty
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                aria-label="Featured sermon thumbnail"
                value={draft.featuredSermon.sermon.thumbnail}
                onChange={(e) =>
                  updateAt(["featuredSermon", "sermon", "thumbnail"], e.target.value)
                }
                placeholder="Paste an image URL or choose from the library"
                maxLength={FEATURED_MAX.thumbnail}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setPickerFor({ kind: "sermon" })}
                className="shrink-0"
              >
                <ImagePlus className="mr-1.5 h-4 w-4" />
                Choose image
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Title" htmlFor="featuredSermon.sermon.title" required>
              <Input
                id="featuredSermon.sermon.title"
                value={draft.featuredSermon.sermon.title}
                onChange={(e) => updateAt(["featuredSermon", "sermon", "title"], e.target.value)}
                placeholder="Walking in Grace"
                maxLength={FEATURED_MAX.title}
              />
            </Field>
            <Field label="Speaker" htmlFor="featuredSermon.sermon.speaker" required>
              <Input
                id="featuredSermon.sermon.speaker"
                value={draft.featuredSermon.sermon.speaker}
                onChange={(e) =>
                  updateAt(["featuredSermon", "sermon", "speaker"], e.target.value)
                }
                placeholder="Pastor Joseph Kinene"
                maxLength={FEATURED_MAX.speaker}
              />
            </Field>
            <Field label="Date" htmlFor="featuredSermon.sermon.date" required>
              <Input
                id="featuredSermon.sermon.date"
                value={draft.featuredSermon.sermon.date}
                onChange={(e) => updateAt(["featuredSermon", "sermon", "date"], e.target.value)}
                placeholder="October 15, 2024"
                maxLength={FEATURED_MAX.date}
              />
            </Field>
            <Field label="Duration" htmlFor="featuredSermon.sermon.duration">
              <Input
                id="featuredSermon.sermon.duration"
                value={draft.featuredSermon.sermon.duration}
                onChange={(e) =>
                  updateAt(["featuredSermon", "sermon", "duration"], e.target.value)
                }
                placeholder="45:30"
                maxLength={FEATURED_MAX.duration}
              />
            </Field>
            <Field label="Category" htmlFor="featuredSermon.sermon.category" required>
              <select
                id="featuredSermon.sermon.category"
                value={draft.featuredSermon.sermon.category}
                onChange={(e) =>
                  updateAt(["featuredSermon", "sermon", "category"], e.target.value)
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {SERMON_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              label="Description"
              htmlFor="featuredSermon.sermon.description"
              required
              className="sm:col-span-2"
            >
              <Textarea
                id="featuredSermon.sermon.description"
                rows={3}
                value={draft.featuredSermon.sermon.description}
                onChange={(e) =>
                  updateAt(["featuredSermon", "sermon", "description"], e.target.value)
                }
                maxLength={FEATURED_MAX.description}
              />
            </Field>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
          <h4 className="mb-4 text-sm font-semibold text-gray-700">Section button</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Button text" htmlFor="featuredSermon.cta.label" required>
              <Input
                id="featuredSermon.cta.label"
                value={draft.featuredSermon.cta.label}
                onChange={(e) => updateAt(["featuredSermon", "cta", "label"], e.target.value)}
                placeholder="View All Sermons"
                maxLength={80}
              />
            </Field>
            <Field label="Button link" htmlFor="featuredSermon.cta.href" required>
              <Input
                id="featuredSermon.cta.href"
                value={draft.featuredSermon.cta.href}
                onChange={(e) => updateAt(["featuredSermon", "cta", "href"], e.target.value)}
                placeholder="/sermons"
                maxLength={500}
              />
            </Field>
          </div>
        </div>
      </Section>

      {/* ============ UPCOMING EVENTS ============ */}
      <Section
        title="Upcoming Events"
        description="Up to six events shown on the homepage. The full events calendar is managed separately later."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Heading" htmlFor="upcomingEvents.heading" required>
            <Input
              id="upcomingEvents.heading"
              value={draft.upcomingEvents.heading}
              onChange={(e) => updateAt(["upcomingEvents", "heading"], e.target.value)}
              placeholder="Upcoming Events"
              maxLength={EVENT_MAX.heading}
            />
          </Field>
          <Field label="Tagline" htmlFor="upcomingEvents.tagline" required>
            <Input
              id="upcomingEvents.tagline"
              value={draft.upcomingEvents.tagline}
              onChange={(e) => updateAt(["upcomingEvents", "tagline"], e.target.value)}
              placeholder="Join us for worship, fellowship, and community events"
              maxLength={EVENT_MAX.tagline}
            />
          </Field>
        </div>

        <div className="space-y-4">
          {draft.upcomingEvents.events.map((event, index) => (
            <div
              key={event.id}
              className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/60 p-4 sm:p-5"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-700">Event {index + 1}</h4>
                {draft.upcomingEvents.events.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    onClick={() => removeEvent(index)}
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Remove event
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                <div className="relative h-28 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                  {event.image ? (
                    <Image
                      src={event.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                      Optional image — visitors see a blue placeholder if empty
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    aria-label={`Event ${index + 1} image`}
                    value={event.image}
                    onChange={(e) =>
                      updateAt(["upcomingEvents", "events", index, "image"], e.target.value)
                    }
                    placeholder="Paste an image URL or choose from the library"
                    maxLength={EVENT_MAX.image}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPickerFor({ kind: "event", index })}
                    className="shrink-0"
                  >
                    <ImagePlus className="mr-1.5 h-4 w-4" />
                    Choose image
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Title" htmlFor={`event-${index}-title`} required>
                  <Input
                    id={`event-${index}-title`}
                    value={event.title}
                    onChange={(e) =>
                      updateAt(["upcomingEvents", "events", index, "title"], e.target.value)
                    }
                    placeholder="Sunday Service"
                    maxLength={EVENT_MAX.title}
                  />
                </Field>
                <Field label="Category" htmlFor={`event-${index}-category`} required>
                  <select
                    id={`event-${index}-category`}
                    value={event.category}
                    onChange={(e) =>
                      updateAt(["upcomingEvents", "events", index, "category"], e.target.value)
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {EVENT_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Date" htmlFor={`event-${index}-date`} required>
                  <Input
                    id={`event-${index}-date`}
                    type="date"
                    value={event.date}
                    onChange={(e) =>
                      updateAt(["upcomingEvents", "events", index, "date"], e.target.value)
                    }
                  />
                </Field>
                <Field label="Time" htmlFor={`event-${index}-time`} required>
                  <Input
                    id={`event-${index}-time`}
                    value={event.time}
                    onChange={(e) =>
                      updateAt(["upcomingEvents", "events", index, "time"], e.target.value)
                    }
                    placeholder="10:00 AM"
                    maxLength={EVENT_MAX.time}
                  />
                </Field>
                <Field
                  label="Location"
                  htmlFor={`event-${index}-location`}
                  required
                  className="sm:col-span-2"
                >
                  <Input
                    id={`event-${index}-location`}
                    value={event.location}
                    onChange={(e) =>
                      updateAt(["upcomingEvents", "events", index, "location"], e.target.value)
                    }
                    placeholder="TGM Church, Wakiso Nakawuka"
                    maxLength={EVENT_MAX.location}
                  />
                </Field>
                <Field
                  label="Description"
                  htmlFor={`event-${index}-description`}
                  required
                  className="sm:col-span-2"
                >
                  <Textarea
                    id={`event-${index}-description`}
                    rows={3}
                    value={event.description}
                    onChange={(e) =>
                      updateAt(["upcomingEvents", "events", index, "description"], e.target.value)
                    }
                    maxLength={EVENT_MAX.description}
                  />
                </Field>
              </div>
            </div>
          ))}

          <Button type="button" variant="outline" size="sm" onClick={addEvent}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add event
          </Button>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
          <h4 className="mb-4 text-sm font-semibold text-gray-700">Section button</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Button text" htmlFor="upcomingEvents.cta.label" required>
              <Input
                id="upcomingEvents.cta.label"
                value={draft.upcomingEvents.cta.label}
                onChange={(e) => updateAt(["upcomingEvents", "cta", "label"], e.target.value)}
                placeholder="View All Events"
                maxLength={80}
              />
            </Field>
            <Field label="Button link" htmlFor="upcomingEvents.cta.href" required>
              <Input
                id="upcomingEvents.cta.href"
                value={draft.upcomingEvents.cta.href}
                onChange={(e) => updateAt(["upcomingEvents", "cta", "href"], e.target.value)}
                placeholder="/events"
                maxLength={500}
              />
            </Field>
          </div>
        </div>
      </Section>

      <SaveBar status={status} message={message} />

      <MediaPicker
        open={pickerFor !== null}
        onOpenChange={(open) => !open && setPickerFor(null)}
        onSelect={(url) => {
          if (pickerFor?.kind === "hero") {
            updateAt(["hero", "slides", pickerFor.index, "image"], url);
          } else if (pickerFor?.kind === "sermon") {
            updateAt(["featuredSermon", "sermon", "thumbnail"], url);
          } else if (pickerFor?.kind === "event") {
            updateAt(["upcomingEvents", "events", pickerFor.index, "image"], url);
          }
          setPickerFor(null);
        }}
      />
    </form>
  );
}
