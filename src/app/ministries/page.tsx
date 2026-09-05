import { MinistriesView } from "@/components/pages/ministries-view"
import { getPublishedMinistries } from "@/lib/db/services/ministry"

export const dynamic = "force-dynamic"

export default async function MinistriesPage() {
  const ministries = await getPublishedMinistries()
  return <MinistriesView ministries={ministries} />
}
