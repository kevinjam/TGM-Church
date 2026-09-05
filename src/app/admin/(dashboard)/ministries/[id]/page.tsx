import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MinistryForm } from "@/components/admin/ministry-form";
import { getMinistryById } from "@/lib/db/services/ministry";

export const metadata = { title: "Edit Ministry" };

export const dynamic = "force-dynamic";

export default async function EditMinistryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ministry = await getMinistryById(id).catch(() => null);

  if (!ministry) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1">
            <Link
              href="/admin/ministries"
              className="inline-flex items-center gap-1 text-sm font-medium text-tgm-blue hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              All ministries
            </Link>
          </p>
          <h2 className="text-2xl font-bold text-gray-800">Edit Ministry</h2>
          <p className="mt-1 text-gray-600">
            Changes go live on the public Ministries page the moment you save a
            published ministry.
          </p>
        </div>
        {ministry.status === "published" && (
          <Button asChild variant="outline" size="sm">
            <Link href="/ministries" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-1.5 h-4 w-4" />
              Open Ministries
            </Link>
          </Button>
        )}
      </div>

      <MinistryForm initial={ministry} ministryId={ministry.id} />
    </div>
  );
}
