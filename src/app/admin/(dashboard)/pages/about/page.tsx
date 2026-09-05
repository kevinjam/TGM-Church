import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AboutEditor } from "@/components/admin/about-editor";
import { getAboutContent } from "@/lib/db/services/about";

export const metadata = { title: "Edit About" };

export const dynamic = "force-dynamic";

export default async function EditAboutPage() {
  const content = await getAboutContent();

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
          <h2 className="text-2xl font-bold text-gray-800">Edit About</h2>
          <p className="mt-1 text-gray-600">
            Edit the story, church information, Grace Team, and closing banner.
            Changes go live the moment you save.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/about" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-1.5 h-4 w-4" />
            Open About
          </Link>
        </Button>
      </div>

      <AboutEditor initial={content} />
    </div>
  );
}
