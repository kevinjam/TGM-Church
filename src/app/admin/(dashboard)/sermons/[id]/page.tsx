import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SermonForm } from "@/components/admin/sermon-form";
import { getSermonById } from "@/lib/db/services/sermon";

export const metadata = { title: "Edit Sermon" };

export const dynamic = "force-dynamic";

export default async function EditSermonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sermon = await getSermonById(id).catch(() => null);

  if (!sermon) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1">
            <Link
              href="/admin/sermons"
              className="inline-flex items-center gap-1 text-sm font-medium text-tgm-blue hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              All sermons
            </Link>
          </p>
          <h2 className="text-2xl font-bold text-gray-800">Edit Sermon</h2>
          <p className="mt-1 text-gray-600">
            Changes go live on the public Sermons page the moment you save a
            published sermon.
          </p>
        </div>
        {sermon.status === "published" && (
          <Button asChild variant="outline" size="sm">
            <Link href="/sermons" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-1.5 h-4 w-4" />
              Open Sermons
            </Link>
          </Button>
        )}
      </div>

      <SermonForm initial={sermon} sermonId={sermon.id} />
    </div>
  );
}
