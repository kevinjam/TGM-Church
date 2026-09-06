"use client";

import { AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

/** Native <select> styles that stay readable on the light admin dashboard. */
export const adminSelectClass =
  "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900";

/** A titled white card grouping related form fields. */
export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <legend className="sr-only">{title}</legend>
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </fieldset>
  );
}

/** Label + control wrapper used across CMS forms. */
export function Field({
  label,
  htmlFor,
  required,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-tgm-gold">*</span>}
      </Label>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

/** Sticky save bar with Saving…/success/error feedback, shared by CMS editors. */
export function SaveBar({
  status,
  message,
  saveLabel = "Save Changes",
  savingLabel = "Saving…",
  idleHint = "Changes appear on the public website once saved.",
}: {
  status: SaveStatus;
  message: string | null;
  saveLabel?: string;
  savingLabel?: string;
  idleHint?: string;
}) {
  return (
    <div className="sticky bottom-4 z-10">
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        {status === "saved" ? (
          <p className="flex items-center gap-2 text-sm font-medium text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            {message}
          </p>
        ) : status === "error" ? (
          <p className="flex items-center gap-2 text-sm font-medium text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {message}
          </p>
        ) : (
          <p className="text-sm text-gray-500">{idleHint}</p>
        )}
        <Button
          type="submit"
          disabled={status === "saving"}
          className="bg-tgm-gold text-tgm-blue hover:bg-tgm-lightgold font-semibold"
        >
          {status === "saving" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {savingLabel}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {saveLabel}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
