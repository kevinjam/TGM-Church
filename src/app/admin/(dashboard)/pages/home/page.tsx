import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HomepageEditor } from "@/components/admin/homepage-editor";
import { getHomepageContent } from "@/lib/db/services/homepage";

export const metadata = { title: "Edit Homepage" };

export const dynamic = "force-dynamic";

export default async function EditHomepagePage() {
  // getHomepageContent never throws — it falls back to the original site
  // content (creating the DB document) when the database is unavailable.
  const content = await getHomepageContent();

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
          <h2 className="text-2xl font-bold text-gray-800">Edit Homepage</h2>
          <p className="mt-1 text-gray-600">
            Edit the hero slider, welcome section, featured sermon, and upcoming
            events. Changes go live the moment you save.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-1.5 h-4 w-4" />
            Open homepage
          </Link>
        </Button>
      </div>

      <HomepageEditor initial={content} />
    </div>
  );
}
