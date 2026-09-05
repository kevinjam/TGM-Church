"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Trash2, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { MinistryView } from "@/lib/db/services/ministry";

export function MinistriesList({
  initialItems,
  initialError,
}: {
  initialItems: MinistryView[];
  initialError?: string;
}) {
  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [deleteTarget, setDeleteTarget] = useState<MinistryView | null>(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);
    try {
      const response = await fetch(`/api/ministries/${deleteTarget.id}`, { method: "DELETE" });
      if (response.ok) {
        setItems((prev) => prev.filter((item) => item.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Unable to delete the ministry.");
        setDeleteTarget(null);
      }
    } catch {
      setError("Unable to delete the ministry. Please try again.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button asChild className="bg-tgm-gold text-tgm-blue hover:bg-tgm-lightgold font-semibold">
          <Link href="/admin/ministries/new">
            <Plus className="mr-1.5 h-4 w-4" />
            Add Ministry
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
          <Users2 className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-700">No ministries yet</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
            Add the first ministry to show it on the public Ministries page.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <ul className="divide-y divide-gray-100">
            {items.map((ministry) => (
              <li
                key={ministry.id}
                className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-800">{ministry.name}</p>
                  <p className="truncate text-xs text-gray-500">
                    Order {ministry.order}
                    {ministry.cta ? " · Has call to action" : ""}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  {ministry.icon && (
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium capitalize text-gray-700">
                      {ministry.icon}
                    </span>
                  )}
                  {ministry.status === "published" ? (
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                      Published
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                      Draft
                    </span>
                  )}
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/ministries/${ministry.id}`}>
                      <Pencil className="mr-1.5 h-3.5 w-3.5" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:bg-red-50 hover:text-red-600"
                    onClick={() => setDeleteTarget(ministry)}
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
            <DialogTitle>Delete this ministry?</DialogTitle>
            <DialogDescription>
              {deleteTarget
                ? `“${deleteTarget.name}” will be removed from the website. This cannot be undone.`
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
              {deleting ? "Deleting…" : "Delete ministry"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
