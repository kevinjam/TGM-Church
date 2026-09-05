import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MinistryForm } from "@/components/admin/ministry-form";

export const metadata = { title: "Add Ministry" };

export default function NewMinistryPage() {
  return (
    <div className="space-y-6">
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
        <h2 className="text-2xl font-bold text-gray-800">Add Ministry</h2>
        <p className="mt-1 text-gray-600">
          New ministries appear on the public Ministries page when they are published.
        </p>
      </div>

      <MinistryForm />
    </div>
  );
}
