import Link from "next/link";
import { ExternalLink, FileText, Pencil, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { connectToDatabase, PageModel } from "@/lib/db";
import { getAboutContent } from "@/lib/db/services/about";
import { getContactPageContent } from "@/lib/db/services/contact-page";
import { getHomepageContent } from "@/lib/db/services/homepage";
import { getOurDnaContent } from "@/lib/db/services/our-dna";

export const metadata = { title: "Pages" };

export const dynamic = "force-dynamic";

interface ListedPage {
  id: string;
  slug: string;
  title: string;
  status: string;
  updatedAt: Date;
}

function publicUrl(slug: string): string | null {
  if (slug === "home") return "/";
  if (slug === "about") return "/about";
  if (slug === "our-dna") return "/our-dna";
  if (slug === "contact") return "/contact";
  return null;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function PagesPage() {
  let pages: ListedPage[] = [];
  let loadError: string | undefined;

  try {
    await connectToDatabase();
    await Promise.all([
      getHomepageContent(),
      getAboutContent(),
      getOurDnaContent(),
      getContactPageContent(),
    ]);
    const docs = await PageModel.find()
      .sort({ updatedAt: -1 })
      .lean<Array<PageDocLean>>();
    pages = docs.map((doc) => ({
      id: String(doc._id),
      slug: doc.slug,
      title: doc.title,
      status: doc.status,
      updatedAt: new Date(doc.updatedAt),
    }));
  } catch (error) {
    console.error("Pages list load failed:", error);
    loadError = "Unable to load pages. Check the database connection.";
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Pages</h2>
        <p className="mt-1 flex items-center gap-1.5 text-gray-600">
          <FolderOpen className="h-4 w-4" />
          Choose a page to edit the content that appears on the public website.
        </p>
      </div>

      {loadError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      ) : pages.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-700">No pages yet</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
            CMS-managed pages appear here once their content has been created.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <ul className="divide-y divide-gray-100">
            {pages.map((page) => (
              <li
                key={page.id}
                className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-tgm-gold/10">
                    <FileText className="h-5 w-5 text-tgm-gold" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-800">{page.title}</p>
                    <p className="truncate text-xs text-gray-500">
                      /{page.slug} · Updated {formatDate(page.updatedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {page.status === "published" ? (
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                      Published
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                      Draft
                    </span>
                  )}
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/pages/${page.slug}`}>
                      <Pencil className="mr-1.5 h-3.5 w-3.5" />
                      Edit
                    </Link>
                  </Button>
                  {publicUrl(page.slug) && (
                    <Button asChild variant="ghost" size="sm">
                      <Link href={publicUrl(page.slug)!} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                        Preview
                      </Link>
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/** Lean doc shape from the Page model (kept local to the list page). */
interface PageDocLean {
  _id: unknown;
  slug: string;
  title: string;
  status: string;
  updatedAt: Date;
}
