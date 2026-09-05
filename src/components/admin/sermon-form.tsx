"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImagePlus } from "lucide-react";
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
import {
  CONTENT_STATUSES,
  SERMON_CATEGORIES,
  SERMON_TYPES,
} from "@/lib/db/constants";
import type { SermonInput, SermonView } from "@/lib/db/services/sermon";

const PATH_OR_URL = /^(\/|https?:\/\/)/i;

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm";

function blankSermon(): SermonInput {
  return {
    title: "",
    speaker: "",
    date: "",
    description: "",
    category: "Sunday Service",
    scripture: "",
    thumbnail: "",
    youtubeUrl: "",
    audioUrl: "",
    castboxUrl: "",
    castboxEmbedUrl: "",
    duration: "",
    type: "video",
    featured: false,
    status: "published",
  };
}

function toDraft(sermon?: SermonView | null): SermonInput {
  if (!sermon) return blankSermon();
  return {
    title: sermon.title,
    speaker: sermon.speaker,
    date: sermon.date,
    description: sermon.description,
    category: sermon.category,
    scripture: sermon.scripture,
    thumbnail: sermon.thumbnail,
    youtubeUrl: sermon.youtubeUrl,
    audioUrl: sermon.audioUrl,
    castboxUrl: sermon.castboxUrl,
    castboxEmbedUrl: sermon.castboxEmbedUrl,
    duration: sermon.duration,
    type: sermon.type,
    featured: sermon.featured,
    status: sermon.status,
  };
}

function typeLabel(type: SermonInput["type"]): string {
  if (type === "both") return "Video + Audio";
  return type === "video" ? "Video" : "Audio";
}

export function SermonForm({
  initial,
  sermonId,
}: {
  initial?: SermonView | null;
  sermonId?: string;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<SermonInput>(() => toDraft(initial));
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const setField = <K extends keyof SermonInput>(key: K, value: SermonInput[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const validateOptionalUrl = (value: string, label: string): string | null => {
    if (value.trim() && !PATH_OR_URL.test(value.trim())) {
      return `The ${label} must be a /path or http(s) URL.`;
    }
    return null;
  };

  const validateClient = (): string | null => {
    if (!draft.title.trim()) return "The sermon title is required.";
    if (!draft.speaker.trim()) return "The speaker name is required.";
    if (!draft.date.trim()) return "The sermon date is required.";
    if (!draft.description.trim()) return "The sermon description is required.";
    return (
      validateOptionalUrl(draft.thumbnail, "thumbnail") ??
      validateOptionalUrl(draft.youtubeUrl, "YouTube URL") ??
      validateOptionalUrl(draft.audioUrl, "audio URL") ??
      validateOptionalUrl(draft.castboxUrl, "Castbox URL") ??
      validateOptionalUrl(draft.castboxEmbedUrl, "Castbox embed URL")
    );
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
      const url = sermonId ? `/api/sermons/${sermonId}` : "/api/sermons";
      const response = await fetch(url, {
        method: sermonId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        item?: SermonView;
      };

      if (!response.ok || !data.item) {
        setStatus("error");
        setMessage(data.error ?? "Unable to save the sermon. Please try again.");
        return;
      }

      if (!sermonId) {
        router.push("/admin/sermons");
        router.refresh();
        return;
      }

      setDraft(toDraft(data.item));
      setStatus("saved");
      setMessage("Sermon saved successfully.");
    } catch {
      setStatus("error");
      setMessage("Unable to save the sermon. Please check your connection and try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Section title="Sermon details" description="This information appears on the public Sermons page.">
        <Field label="Title" htmlFor="sermon.title" required>
          <Input
            id="sermon.title"
            value={draft.title}
            onChange={(e) => setField("title", e.target.value)}
            placeholder="Walking in Grace"
            maxLength={200}
          />
        </Field>
        <Field label="Description" htmlFor="sermon.description" required>
          <Textarea
            id="sermon.description"
            rows={4}
            value={draft.description}
            onChange={(e) => setField("description", e.target.value)}
            maxLength={2000}
          />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Speaker" htmlFor="sermon.speaker" required>
            <Input
              id="sermon.speaker"
              value={draft.speaker}
              onChange={(e) => setField("speaker", e.target.value)}
              placeholder="Pastor Joseph Kinene"
              maxLength={120}
            />
          </Field>
          <Field
            label="Date"
            htmlFor="sermon.date"
            required
            hint="Shown as written, e.g. October 15, 2024"
          >
            <Input
              id="sermon.date"
              value={draft.date}
              onChange={(e) => setField("date", e.target.value)}
              placeholder="October 15, 2024"
              maxLength={80}
            />
          </Field>
          <Field label="Category" htmlFor="sermon.category" required>
            <select
              id="sermon.category"
              value={draft.category}
              onChange={(e) =>
                setField("category", e.target.value as SermonInput["category"])
              }
              className={selectClass}
            >
              {SERMON_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Type" htmlFor="sermon.type" required>
            <select
              id="sermon.type"
              value={draft.type}
              onChange={(e) => setField("type", e.target.value as SermonInput["type"])}
              className={selectClass}
            >
              {SERMON_TYPES.map((type) => (
                <option key={type} value={type}>
                  {typeLabel(type)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Scripture" htmlFor="sermon.scripture">
            <Input
              id="sermon.scripture"
              value={draft.scripture}
              onChange={(e) => setField("scripture", e.target.value)}
              placeholder="Hebrews 4:16"
              maxLength={120}
            />
          </Field>
          <Field label="Duration" htmlFor="sermon.duration">
            <Input
              id="sermon.duration"
              value={draft.duration}
              onChange={(e) => setField("duration", e.target.value)}
              placeholder="45:30"
              maxLength={20}
            />
          </Field>
          <Field label="Visibility" htmlFor="sermon.status" required>
            <select
              id="sermon.status"
              value={draft.status}
              onChange={(e) => setField("status", e.target.value as SermonInput["status"])}
              className={selectClass}
            >
              {CONTENT_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {item === "published" ? "Published" : "Draft"}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={draft.featured}
            onChange={(e) => setField("featured", e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          Mark as featured
        </label>
      </Section>

      <Section
        title="Video"
        description="Optional YouTube embed URL. Leave empty to show Coming Soon on video cards."
      >
        <Field label="YouTube embed URL" htmlFor="sermon.youtubeUrl">
          <Input
            id="sermon.youtubeUrl"
            value={draft.youtubeUrl}
            onChange={(e) => setField("youtubeUrl", e.target.value)}
            placeholder="https://www.youtube.com/embed/…"
            maxLength={2048}
          />
        </Field>
        <div className="relative h-36 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
          {draft.thumbnail ? (
            <Image src={draft.thumbnail} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              No thumbnail selected
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            aria-label="Sermon thumbnail"
            value={draft.thumbnail}
            onChange={(e) => setField("thumbnail", e.target.value)}
            placeholder="Paste an image URL or choose from the library"
            maxLength={2048}
            className="flex-1"
          />
          <Button type="button" variant="outline" onClick={() => setPickerOpen(true)} className="shrink-0">
            <ImagePlus className="mr-1.5 h-4 w-4" />
            Choose image
          </Button>
        </div>
      </Section>

      <Section
        title="Audio"
        description="Optional Castbox links. The embed URL powers Listen Now on the public page."
      >
        <Field label="Castbox URL" htmlFor="sermon.castboxUrl">
          <Input
            id="sermon.castboxUrl"
            value={draft.castboxUrl}
            onChange={(e) => setField("castboxUrl", e.target.value)}
            placeholder="https://castbox.fm/episode/…"
            maxLength={2048}
          />
        </Field>
        <Field label="Castbox embed URL" htmlFor="sermon.castboxEmbedUrl">
          <Input
            id="sermon.castboxEmbedUrl"
            value={draft.castboxEmbedUrl}
            onChange={(e) => setField("castboxEmbedUrl", e.target.value)}
            placeholder="https://castbox.fm/embed/episode/…"
            maxLength={2048}
          />
        </Field>
        <Field label="Audio file URL" htmlFor="sermon.audioUrl">
          <Input
            id="sermon.audioUrl"
            value={draft.audioUrl}
            onChange={(e) => setField("audioUrl", e.target.value)}
            placeholder="https://…"
            maxLength={2048}
          />
        </Field>
      </Section>

      <SaveBar
        status={status}
        message={message}
        saveLabel={sermonId ? "Save Changes" : "Create Sermon"}
        idleHint={
          sermonId
            ? "Published sermons appear on the public Sermons page once saved."
            : "Create the sermon, then it will appear in the sermons list."
        }
      />

      <MediaPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={(url) => {
          setField("thumbnail", url);
          setPickerOpen(false);
        }}
      />
    </form>
  );
}
