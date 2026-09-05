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
import { CONTENT_STATUSES, MINISTRY_ICONS } from "@/lib/db/constants";
import type { MinistryInput, MinistryView } from "@/lib/db/services/ministry";

const PATH_OR_URL = /^(\/|https?:\/\/)/i;

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm";

const ICON_LABELS: Record<(typeof MINISTRY_ICONS)[number], string> = {
  youth: "Youth",
  men: "Men",
  women: "Women",
  marrieds: "Marrieds",
  children: "Children",
  schools: "Schools",
  default: "Generic",
};

function blankMinistry(): MinistryInput {
  return {
    name: "",
    description: "",
    cta: "",
    image: "",
    icon: "",
    order: 0,
    status: "published",
  };
}

function toDraft(ministry?: MinistryView | null): MinistryInput {
  if (!ministry) return blankMinistry();
  return {
    name: ministry.name,
    description: ministry.description,
    cta: ministry.cta,
    image: ministry.image,
    icon: ministry.icon,
    order: ministry.order,
    status: ministry.status,
  };
}

export function MinistryForm({
  initial,
  ministryId,
}: {
  initial?: MinistryView | null;
  ministryId?: string;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<MinistryInput>(() => toDraft(initial));
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const setField = <K extends keyof MinistryInput>(key: K, value: MinistryInput[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const validateClient = (): string | null => {
    if (!draft.name.trim()) return "The ministry name is required.";
    if (!draft.description.trim()) return "The ministry description is required.";
    if (!Number.isInteger(draft.order) || draft.order < 0 || draft.order > 9999) {
      return "A valid display order is required.";
    }
    if (draft.image.trim() && !PATH_OR_URL.test(draft.image.trim())) {
      return "The ministry image must be a /path or http(s) URL.";
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
      const url = ministryId ? `/api/ministries/${ministryId}` : "/api/ministries";
      const response = await fetch(url, {
        method: ministryId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        item?: MinistryView;
      };

      if (!response.ok || !data.item) {
        setStatus("error");
        setMessage(data.error ?? "Unable to save the ministry. Please try again.");
        return;
      }

      if (!ministryId) {
        router.push("/admin/ministries");
        router.refresh();
        return;
      }

      setDraft(toDraft(data.item));
      setStatus("saved");
      setMessage("Ministry saved successfully.");
    } catch {
      setStatus("error");
      setMessage("Unable to save the ministry. Please check your connection and try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Section
        title="Ministry details"
        description="This information appears on the public Ministries page."
      >
        <Field label="Name" htmlFor="ministry.name" required>
          <Input
            id="ministry.name"
            value={draft.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="Youth of Grace (YOG) Ministry"
            maxLength={200}
          />
        </Field>
        <Field label="Description" htmlFor="ministry.description" required>
          <Textarea
            id="ministry.description"
            rows={5}
            value={draft.description}
            onChange={(e) => setField("description", e.target.value)}
            maxLength={3000}
          />
        </Field>
        <Field
          label="Call to action"
          htmlFor="ministry.cta"
          hint="Optional. Shown as a button on the ministry card."
        >
          <Input
            id="ministry.cta"
            value={draft.cta}
            onChange={(e) => setField("cta", e.target.value)}
            placeholder="Thursdays at 6 PM: Come as you are, leave transformed."
            maxLength={400}
          />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Display order" htmlFor="ministry.order" required>
            <Input
              id="ministry.order"
              type="number"
              min={0}
              max={9999}
              value={draft.order}
              onChange={(e) => setField("order", Number(e.target.value))}
            />
          </Field>
          <Field
            label="Icon"
            htmlFor="ministry.icon"
            hint="Automatic uses the ministry name"
          >
            <select
              id="ministry.icon"
              value={draft.icon}
              onChange={(e) =>
                setField("icon", e.target.value as MinistryInput["icon"])
              }
              className={selectClass}
            >
              <option value="">Automatic</option>
              {MINISTRY_ICONS.map((icon) => (
                <option key={icon} value={icon}>
                  {ICON_LABELS[icon]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Visibility" htmlFor="ministry.status" required>
            <select
              id="ministry.status"
              value={draft.status}
              onChange={(e) => setField("status", e.target.value as MinistryInput["status"])}
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
      </Section>

      <Section
        title="Image"
        description="Optional. The public page uses the current Bible photo when this is empty."
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
            aria-label="Ministry image"
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
        saveLabel={ministryId ? "Save Changes" : "Create Ministry"}
        idleHint={
          ministryId
            ? "Published ministries appear on the public Ministries page once saved."
            : "Create the ministry, then it will appear in the ministries list."
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
