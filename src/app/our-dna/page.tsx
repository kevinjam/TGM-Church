import { OurDnaView } from "@/components/pages/our-dna-view"
import { getOurDnaContent } from "@/lib/db/services/our-dna"

export const dynamic = "force-dynamic"

export default async function OurDnaPage() {
  const content = await getOurDnaContent()
  return <OurDnaView content={content} />
}
