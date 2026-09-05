import { SermonsView } from "@/components/pages/sermons-view"
import { getPublishedSermons } from "@/lib/db/services/sermon"

export const dynamic = "force-dynamic"

export default async function SermonsPage() {
  const sermons = await getPublishedSermons()
  return <SermonsView sermons={sermons} />
}
