import { EventsView } from "@/components/pages/events-view"
import { getPublishedEvents } from "@/lib/db/services/event"

export const dynamic = "force-dynamic"

export default async function EventsPage() {
  const events = await getPublishedEvents()
  return <EventsView events={events} />
}
