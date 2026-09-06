"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  AlertCircle,
  Check,
  Copy,
  ImagePlus,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { MediaView } from "@/lib/db/services/media";
import { uploadMediaFile } from "@/lib/admin-upload-media";
import { formatUploadLimit } from "@/lib/media-constants";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibrary({
  initialItems,
  initialError,
}: {
  initialItems: MediaView[];
  initialError?: string;
}) {
  const [items, setItems] = useState<MediaView[]>(initialItems);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaView | null>(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (fileList: FileList | null) => {
    const files = fileList ? Array.from(fileList) : [];
    if (files.length === 0) return;

    setUploading(true);
    setError(null);
    const uploaded: MediaView[] = [];
    const failures: string[] = [];

    for (const file of files) {
      try {
        uploaded.push(await uploadMediaFile(file));
      } catch (err) {
        const reason = err instanceof Error ? err.message : "upload failed";
        failures.push(`${file.name}: ${reason}`);
      }
    }

    if (uploaded.length > 0) {
      setItems((prev) => [...uploaded, ...prev]);
    }
    if (failures.length > 0) {
      setError(failures[0]);
    }
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      window.setTimeout(() => setCopiedUrl(null), 2000);
    } catch {
      setError("Unable to copy the link — please copy it manually.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);
    try {
      const response = await fetch(`/api/media/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setItems((prev) => prev.filter((item) => item.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Unable to delete the image.");
        setDeleteTarget(null);
      }
    } catch {
      setError("Unable to delete the image. Please try again.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-800">{items.length}</span>{" "}
          image{items.length === 1 ? "" : "s"}
        </p>
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-tgm-gold text-tgm-blue hover:bg-tgm-lightgold font-semibold"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Images
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Grid / empty state */}
      {items.length === 0 && !uploading ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <ImagePlus className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-700">No images yet</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
            Upload photos (JPG, PNG, WebP, GIF, or AVIF — up to {formatUploadLimit()}{" "}
            each). Files are stored in the cloud so they stay online after deploy.
          </p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="mt-6 bg-tgm-gold text-tgm-blue hover:bg-tgm-lightgold font-semibold"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload your first image
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-video w-full bg-gray-100">
                {item.width && item.height ? (
                  <Image
                    src={item.url}
                    alt={item.alt || item.filename}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-gray-400">
                    {item.filename}
                  </div>
                )}
              </div>
              <div className="space-y-2 p-3">
                <p className="truncate text-xs font-medium text-gray-700" title={item.url}>
                  {item.filename}
                </p>
                <p className="text-[11px] text-gray-400">
                  {item.width && item.height ? `${item.width}×${item.height} · ` : ""}
                  {formatBytes(item.size)}
                </p>
                <div className="flex gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-8 text-xs"
                    onClick={() => copyUrl(item.url)}
                  >
                    {copiedUrl === item.url ? (
                      <Check className="mr-1 h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <Copy className="mr-1 h-3.5 w-3.5" />
                    )}
                    {copiedUrl === item.url ? "Copied" : "Copy link"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    onClick={() => setDeleteTarget(item)}
                    aria-label={`Delete ${item.filename}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      <Dialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-800">Delete this image?</DialogTitle>
            <DialogDescription>
              “{deleteTarget?.filename}” will be removed from the media library
              and deleted from cloud storage. Images currently used on the
              website will stop displaying.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
