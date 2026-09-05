import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OurDnaEditor } from "@/components/admin/our-dna-editor";
import { getOurDnaContent } from "@/lib/db/services/our-dna";

export const metadata = { title: "Edit Our DNA" };

export const dynamic = "force-dynamic";

export default async function EditOurDnaPage() {
  const content = await getOurDnaContent();

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
          <h2 className="text-2xl font-bold text-gray-800">Edit Our DNA</h2>
          <p className="mt-1 text-gray-600">
            Edit the vision, mission, values, and other sections. Changes go
            live the moment you save.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/our-dna" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-1.5 h-4 w-4" />
            Open Our DNA
          </Link>
        </Button>
      </div>

      <OurDnaEditor initial={content} />
    </div>
  );
}
