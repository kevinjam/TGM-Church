"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AlertCircle, ImagePlus, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { MediaView } from "@/lib/db/services/media";

/**
 * "Choose image" dialog for content editors. Lists the uploaded media from
 * MongoDB; clicking a thumbnail selects its URL. Supports a quick upload so
 * staff can add a new image without leaving the form they are editing.
 */
export function MediaPicker({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
}) {
  const [items, setItems] = useState<MediaView[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const response = await fetch("/api/media");
        const data = (await response.json().catch(() => ({}))) as {
          error?: string;
          items?: MediaView[];
        };
        if (cancelled) return;
        if (!response.ok || !data.items) {
          setError(data.error ?? "Unable to load the media library.");
        } else {
          setItems(data.items);
        }
      } catch {
        if (!cancelled) setError("Unable to load the media library.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [open]);

  const handleFile = async (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/media", { method: "POST", body: formData });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        item?: MediaView;
      };
      if (!response.ok || !data.item) {
        setError(data.error ?? "Upload failed. Please try again.");
      } else {
        setItems((prev) => [data.item as MediaView, ...prev]);
      }
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const choose = (url: string) => {
    onSelect(url);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-gray-800">Choose an image</DialogTitle>
          <DialogDescription>
            Pick one of your uploaded images to use as the slide background.
          </DialogDescription>
        </DialogHeader>

        {/* Upload */}
        <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
          <p className="text-xs text-gray-500">
            Need a new photo? Upload it here first.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="hidden"
            onChange={(e) => handleFile(e.target.files)}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <Upload className="mr-1.5 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Grid */}
        <div className="max-h-[50vh] min-h-[120px] overflow-y-auto">
          {loading ? (
            <div className="flex h-32 items-center justify-center text-sm text-gray-400">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading images…
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center text-center">
              <ImagePlus className="mb-2 h-8 w-8 text-gray-300" />
              <p className="text-sm text-gray-500">
                No images in the library yet — upload one above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => choose(item.url)}
                  className="group overflow-hidden rounded-lg border border-gray-200 bg-white text-left shadow-sm transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-tgm-gold"
                >
                  <div className="relative aspect-video w-full bg-gray-100">
                    {item.width && item.height ? (
                      <Image
                        src={item.url}
                        alt={item.alt || item.filename}
                        fill
                        sizes="(max-width: 640px) 33vw, 25vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-gray-400">
                        {item.filename}
                      </div>
                    )}
                  </div>
                  <p className="truncate px-2 py-1.5 text-[11px] text-gray-600">
                    {item.filename}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
