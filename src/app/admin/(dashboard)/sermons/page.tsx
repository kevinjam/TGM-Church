import { Mic } from "lucide-react";
import { SermonsList } from "@/components/admin/sermons-list";
import { listSermons } from "@/lib/db/services/sermon";

export const metadata = { title: "Sermons" };

export const dynamic = "force-dynamic";

export default async function AdminSermonsPage() {
  let items: Awaited<ReturnType<typeof listSermons>> = [];
  let loadError: string | undefined;

  try {
    items = await listSermons();
  } catch (error) {
    console.error("Sermons list load failed:", error);
    loadError = "Unable to load sermons. Check the database connection.";
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Sermons</h2>
        <p className="mt-1 flex items-center gap-1.5 text-gray-600">
          <Mic className="h-4 w-4" />
          Create and manage video and audio sermons that appear on the public Sermons page.
        </p>
      </div>

      <SermonsList initialItems={items} initialError={loadError} />
    </div>
  );
}
