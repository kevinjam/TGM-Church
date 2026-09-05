import { Images } from "lucide-react";
import { listMedia } from "@/lib/db/services/media";
import { MediaLibrary } from "@/components/admin/media-library";

export const metadata = { title: "Media" };

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  let items: Awaited<ReturnType<typeof listMedia>> = [];
  let loadError: string | undefined;
  try {
    items = await listMedia();
  } catch (error) {
    console.error("Media page load failed:", error);
    loadError = "Unable to load the media library. Check the database connection.";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Media Library</h2>
          <p className="mt-1 flex items-center gap-1.5 text-gray-600">
            <Images className="h-4 w-4" />
            Upload images and copy their links to use anywhere on the website.
          </p>
        </div>
      </div>

      <MediaLibrary initialItems={items} initialError={loadError} />
    </div>
  );
}
