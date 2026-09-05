"use client";

import { useState } from "react";
import Link from "next/link";
import { Mic, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SermonView } from "@/lib/db/services/sermon";

function typeLabel(type: SermonView["type"]): string {
  if (type === "both") return "Video + Audio";
  return type === "video" ? "Video" : "Audio";
}

export function SermonsList({
  initialItems,
  initialError,
}: {
  initialItems: SermonView[];
  initialError?: string;
}) {
  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [deleteTarget, setDeleteTarget] = useState<SermonView | null>(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);
    try {
      const response = await fetch(`/api/sermons/${deleteTarget.id}`, { method: "DELETE" });
      if (response.ok) {
        setItems((prev) => prev.filter((item) => item.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Unable to delete the sermon.");
        setDeleteTarget(null);
      }
    } catch {
      setError("Unable to delete the sermon. Please try again.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button asChild className="bg-tgm-gold text-tgm-blue hover:bg-tgm-lightgold font-semibold">
          <Link href="/admin/sermons/new">
            <Plus className="mr-1.5 h-4 w-4" />
            Add Sermon
          </Link>
        </Button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <Mic className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-700">No sermons yet</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
            Add the first sermon to show it on the public Sermons page.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <ul className="divide-y divide-gray-100">
            {items.map((sermon) => (
              <li
                key={sermon.id}
                className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-800">{sermon.title}</p>
                  <p className="truncate text-xs text-gray-500">
                    {sermon.speaker} · {sermon.date}
                    {sermon.duration ? ` · ${sermon.duration}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                    {sermon.category}
                  </span>
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    {typeLabel(sermon.type)}
                  </span>
                  {sermon.featured && (
                    <span className="rounded-full bg-tgm-gold/20 px-2.5 py-0.5 text-xs font-medium text-tgm-blue">
                      Featured
                    </span>
                  )}
                  {sermon.status === "published" ? (
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                      Published
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                      Draft
                    </span>
                  )}
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/sermons/${sermon.id}`}>
                      <Pencil className="mr-1.5 h-3.5 w-3.5" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:bg-red-50 hover:text-red-600"
                    onClick={() => setDeleteTarget(sermon)}
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

      <Dialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this sermon?</DialogTitle>
            <DialogDescription>
              {deleteTarget
                ? `“${deleteTarget.title}” will be removed from the website. This cannot be undone.`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleting}
              onClick={confirmDelete}
            >
              {deleting ? "Deleting…" : "Delete sermon"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
