import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";

/**
 * Temporary shell content for admin modules built in later stages.
 * Each real module page replaces its placeholder when implemented.
 */
export function ModulePlaceholder({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-tgm-gold/15">
          <Icon className="h-7 w-7 text-tgm-blue" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500">
          {description}
        </p>
        {children}
        <div className="mt-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm font-medium text-tgm-blue hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
