import { CalendarDays } from "lucide-react";
import { EventsList } from "@/components/admin/events-list";
import { listEvents } from "@/lib/db/services/event";

export const metadata = { title: "Events" };

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  let items: Awaited<ReturnType<typeof listEvents>> = [];
  let loadError: string | undefined;

  try {
    items = await listEvents();
  } catch (error) {
    console.error("Events list load failed:", error);
    loadError = "Unable to load events. Check the database connection.";
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Events</h2>
        <p className="mt-1 flex items-center gap-1.5 text-gray-600">
          <CalendarDays className="h-4 w-4" />
          Create and manage church events that appear on the public Events page.
        </p>
      </div>

      <EventsList initialItems={items} initialError={loadError} />
    </div>
  );
}
