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
import { CONTENT_STATUSES, EVENT_CATEGORIES } from "@/lib/db/constants";
import type { EventInput, EventView } from "@/lib/db/services/event";

const PATH_OR_URL = /^(\/|https?:\/\/)/i;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm";

function blankEvent(): EventInput {
  return {
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    image: "",
    category: "Worship",
    isUpcoming: true,
    status: "published",
  };
}

function toDraft(event?: EventView | null): EventInput {
  if (!event) return blankEvent();
  return {
    title: event.title,
    description: event.description,
    date: event.date,
    time: event.time,
    location: event.location,
    image: event.image,
    category: event.category,
    isUpcoming: event.isUpcoming,
    status: event.status,
  };
}

export function EventForm({
  initial,
  eventId,
}: {
  initial?: EventView | null;
  eventId?: string;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<EventInput>(() => toDraft(initial));
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const setField = <K extends keyof EventInput>(key: K, value: EventInput[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const validateClient = (): string | null => {
    if (!draft.title.trim()) return "The event title is required.";
    if (!draft.description.trim()) return "The event description is required.";
    if (!draft.date.trim() || !ISO_DATE.test(draft.date.trim())) {
      return "A valid event date is required.";
    }
    if (!draft.time.trim()) return "The event time is required.";
    if (!draft.location.trim()) return "The event location is required.";
    if (draft.image.trim() && !PATH_OR_URL.test(draft.image.trim())) {
      return "The event image must be a /path or http(s) URL.";
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
      const url = eventId ? `/api/events/${eventId}` : "/api/events";
      const response = await fetch(url, {
        method: eventId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        item?: EventView;
      };

      if (!response.ok || !data.item) {
        setStatus("error");
        setMessage(data.error ?? "Unable to save the event. Please try again.");
        return;
      }

      if (!eventId) {
        router.push("/admin/events");
        router.refresh();
        return;
      }

      setDraft(toDraft(data.item));
      setStatus("saved");
      setMessage("Event saved successfully.");
    } catch {
      setStatus("error");
      setMessage("Unable to save the event. Please check your connection and try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Section title="Event details" description="This information appears on the public Events page.">
        <Field label="Title" htmlFor="event.title" required>
          <Input
            id="event.title"
            value={draft.title}
            onChange={(e) => setField("title", e.target.value)}
            placeholder="Sunday Service"
            maxLength={200}
          />
        </Field>
        <Field label="Description" htmlFor="event.description" required>
          <Textarea
            id="event.description"
            rows={4}
            value={draft.description}
            onChange={(e) => setField("description", e.target.value)}
            maxLength={2000}
          />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Date" htmlFor="event.date" required>
            <Input
              id="event.date"
              type="date"
              value={draft.date}
              onChange={(e) => setField("date", e.target.value)}
            />
          </Field>
          <Field label="Time" htmlFor="event.time" required>
            <Input
              id="event.time"
              value={draft.time}
              onChange={(e) => setField("time", e.target.value)}
              placeholder="10:00 AM"
              maxLength={80}
            />
          </Field>
          <Field label="Location" htmlFor="event.location" required className="sm:col-span-2">
            <Input
              id="event.location"
              value={draft.location}
              onChange={(e) => setField("location", e.target.value)}
              placeholder="TGM Church, Wakiso Nakawuka"
              maxLength={200}
            />
          </Field>
          <Field label="Category" htmlFor="event.category" required>
            <select
              id="event.category"
              value={draft.category}
              onChange={(e) =>
                setField("category", e.target.value as EventInput["category"])
              }
              className={selectClass}
            >
              {EVENT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Visibility" htmlFor="event.status" required>
            <select
              id="event.status"
              value={draft.status}
              onChange={(e) => setField("status", e.target.value as EventInput["status"])}
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
            checked={draft.isUpcoming}
            onChange={(e) => setField("isUpcoming", e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          Show on the Upcoming Events tab (uncheck for Past Events)
        </label>
      </Section>

      <Section
        title="Image"
        description="Optional. The public events page currently uses a colored placeholder when this is empty."
      >
        <div className="relative h-36 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
          {draft.image ? (
            <Image src={draft.image} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              No image selected
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            aria-label="Event image"
            value={draft.image}
            onChange={(e) => setField("image", e.target.value)}
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

      <SaveBar
        status={status}
        message={message}
        saveLabel={eventId ? "Save Changes" : "Create Event"}
        idleHint={
          eventId
            ? "Published events appear on the public Events page once saved."
            : "Create the event, then it will appear in the events list."
        }
      />

      <MediaPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={(url) => {
          setField("image", url);
          setPickerOpen(false);
        }}
      />
    </form>
  );
}
