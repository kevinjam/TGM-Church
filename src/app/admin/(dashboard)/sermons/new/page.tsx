import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SermonForm } from "@/components/admin/sermon-form";

export const metadata = { title: "Add Sermon" };

export default function NewSermonPage() {
  return (
    <div className="space-y-6">
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
        <h2 className="text-2xl font-bold text-gray-800">Add Sermon</h2>
        <p className="mt-1 text-gray-600">
          New sermons appear on the public Sermons page when they are published.
        </p>
      </div>

      <SermonForm />
    </div>
  );
}
