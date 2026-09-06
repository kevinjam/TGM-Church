"use client";

import { useState } from "react";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ContactMessageView } from "@/lib/db/services/contact";

function formatReceivedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ContactInbox({
  initialItems,
  initialError,
}: {
  initialItems: ContactMessageView[];
  initialError?: string;
}) {
  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [selected, setSelected] = useState<ContactMessageView | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessageView | null>(null);
  const [deleting, setDeleting] = useState(false);

  const markRead = async (item: ContactMessageView) => {
    if (item.status === "read") return;
    try {
      const response = await fetch(`/api/contact/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "read" }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        item?: ContactMessageView;
      };
      if (response.ok && data.item) {
        setItems((prev) => prev.map((row) => (row.id === item.id ? data.item! : row)));
        setSelected((current) => (current?.id === item.id ? data.item! : current));
      }
    } catch {
      // Opening the message still works even if the status update fails.
    }
  };

  const openMessage = (item: ContactMessageView) => {
    setSelected(item);
    void markRead(item);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);
    try {
      const response = await fetch(`/api/contact/${deleteTarget.id}`, { method: "DELETE" });
      if (response.ok) {
        setItems((prev) => prev.filter((item) => item.id !== deleteTarget.id));
        if (selected?.id === deleteTarget.id) setSelected(null);
        setDeleteTarget(null);
      } else {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Unable to delete the message.");
        setDeleteTarget(null);
      }
    } catch {
      setError("Unable to delete the message. Please try again.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const unreadCount = items.filter((item) => item.status === "new").length;

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <Mail className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-700">No messages yet</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
            Messages sent from the public Contact page will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {unreadCount > 0 && (
            <p className="border-b border-gray-100 bg-tgm-gold/10 px-4 py-2 text-sm font-medium text-tgm-blue sm:px-5">
              {unreadCount} unread {unreadCount === 1 ? "message" : "messages"}
            </p>
          )}
          <ul className="divide-y divide-gray-100">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
              >
                <button
                  type="button"
                  onClick={() => openMessage(item)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p
                    className={`truncate ${
                      item.status === "new" ? "font-bold text-gray-900" : "font-semibold text-gray-800"
                    }`}
                  >
                    {item.name}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {item.email} · {formatReceivedAt(item.createdAt)}
                  </p>
                  <p className="mt-1 truncate text-sm text-gray-600">{item.message}</p>
                </button>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  {item.status === "new" ? (
                    <span className="rounded-full bg-tgm-gold/20 px-2.5 py-0.5 text-xs font-medium text-tgm-blue">
                      New
                    </span>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                      Read
                    </span>
                  )}
                  <Button variant="outline" size="sm" type="button" onClick={() => openMessage(item)}>
                    {item.status === "new" ? (
                      <Mail className="mr-1.5 h-3.5 w-3.5" />
                    ) : (
                      <MailOpen className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    Open
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:bg-red-50 hover:text-red-600"
                    onClick={() => setDeleteTarget(item)}
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{selected?.name ?? "Message"}</DialogTitle>
            <DialogDescription>
              {selected ? `${selected.email} · ${formatReceivedAt(selected.createdAt)}` : ""}
            </DialogDescription>
          </DialogHeader>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
            {selected?.message}
          </p>
          <DialogFooter className="gap-2 sm:justify-between">
            {selected && (
              <Button asChild variant="outline">
                <a href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: message from ${selected.name}`)}`}>
                  Reply by email
                </a>
              </Button>
            )}
            <Button type="button" onClick={() => setSelected(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this message?</DialogTitle>
            <DialogDescription>
              {deleteTarget
                ? `The message from “${deleteTarget.name}” will be removed. This cannot be undone.`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" disabled={deleting} onClick={confirmDelete}>
              {deleting ? "Deleting…" : "Delete message"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
