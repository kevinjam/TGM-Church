import { Users2 } from "lucide-react";
import { MinistriesList } from "@/components/admin/ministries-list";
import { listMinistries } from "@/lib/db/services/ministry";

export const metadata = { title: "Ministries" };

export const dynamic = "force-dynamic";

export default async function AdminMinistriesPage() {
  let items: Awaited<ReturnType<typeof listMinistries>> = [];
  let loadError: string | undefined;

  try {
    items = await listMinistries();
  } catch (error) {
    console.error("Ministries list load failed:", error);
    loadError = "Unable to load ministries. Check the database connection.";
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Ministries</h2>
        <p className="mt-1 flex items-center gap-1.5 text-gray-600">
          <Users2 className="h-4 w-4" />
          Create and manage ministries that appear on the public Ministries page.
        </p>
      </div>

      <MinistriesList initialItems={items} initialError={loadError} />
    </div>
  );
}
