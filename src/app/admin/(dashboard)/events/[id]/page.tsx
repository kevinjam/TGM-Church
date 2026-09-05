import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventForm } from "@/components/admin/event-form";
import { getEventById } from "@/lib/db/services/event";

export const metadata = { title: "Edit Event" };

export const dynamic = "force-dynamic";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id).catch(() => null);

  if (!event) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
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
          <h2 className="text-2xl font-bold text-gray-800">Edit Event</h2>
          <p className="mt-1 text-gray-600">
            Changes go live on the public Events page the moment you save a
            published event.
          </p>
        </div>
        {event.status === "published" && (
          <Button asChild variant="outline" size="sm">
            <Link href="/events" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-1.5 h-4 w-4" />
              Open Events
            </Link>
          </Button>
        )}
      </div>

      <EventForm initial={event} eventId={event.id} />
    </div>
  );
}
