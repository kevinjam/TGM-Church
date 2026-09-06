import { ContactView } from "@/components/pages/contact-view"
import { getContactPageContent } from "@/lib/db/services/contact-page"

export const dynamic = "force-dynamic"

export default async function ContactPage() {
  const content = await getContactPageContent()
  return <ContactView content={content} />
}
