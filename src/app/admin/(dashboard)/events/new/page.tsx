import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EventForm } from "@/components/admin/event-form";

export const metadata = { title: "Add Event" };

export default function NewEventPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-1">
          <Link
            href="/admin/events"
            className="inline-flex items-center gap-1 text-sm font-medium text-tgm-blue hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            All events
          </Link>
        </p>
        <h2 className="text-2xl font-bold text-gray-800">Add Event</h2>
        <p className="mt-1 text-gray-600">
          New events appear on the public Events page when they are published.
        </p>
      </div>

      <EventForm />
    </div>
  );
}
