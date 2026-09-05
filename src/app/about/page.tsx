import { AboutView } from "@/components/pages/about-view"
import { getAboutContent } from "@/lib/db/services/about"

export const dynamic = "force-dynamic"

export default async function AboutPage() {
  const content = await getAboutContent()
  return <AboutView content={content} />
}
