import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactPageEditor } from "@/components/admin/contact-page-editor";
import { getContactPageContent } from "@/lib/db/services/contact-page";

export const metadata = { title: "Edit Contact" };

export const dynamic = "force-dynamic";

export default async function EditContactPage() {
  const content = await getContactPageContent();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1">
            <Link
              href="/admin/pages"
              className="inline-flex items-center gap-1 text-sm font-medium text-tgm-blue hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              All pages
            </Link>
          </p>
          <h2 className="text-2xl font-bold text-gray-800">Edit Contact</h2>
          <p className="mt-1 text-gray-600">
            Edit the Contact page copy, church details, and prayer section.
            Changes go live the moment you save. Incoming messages stay under Messages.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/contact" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-1.5 h-4 w-4" />
            Open Contact
          </Link>
        </Button>
      </div>

      <ContactPageEditor initial={content} />
    </div>
  );
}
