import Link from "next/link";
import {
  FileText,
  CalendarDays,
  Mic,
  Users2,
  Users,
  Images,
  Plus,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { connectToDatabase } from "@/lib/db/connection";
import {
  PageModel,
  EventModel,
  SermonModel,
  MinistryModel,
  LeaderModel,
  MediaModel,
} from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";

interface StatDefinition {
  key: string;
  label: string;
  icon: LucideIcon;
}

const STAT_DEFS: StatDefinition[] = [
  { key: "pages", label: "Pages", icon: FileText },
  { key: "events", label: "Events", icon: CalendarDays },
  { key: "sermons", label: "Sermons", icon: Mic },
  { key: "ministries", label: "Ministries", icon: Users2 },
  { key: "leaders", label: "Leaders", icon: Users },
  { key: "media", label: "Media", icon: Images },
];

const QUICK_ACTIONS = [
  { label: "Edit Homepage", href: "/admin/pages" },
  { label: "Add Event", href: "/admin/events/new" },
  { label: "Add Sermon", href: "/admin/sermons/new" },
  { label: "Upload Image", href: "/admin/media" },
];

interface Counts {
  pages: number;
  events: number;
  sermons: number;
  ministries: number;
  leaders: number;
  media: number;
}

const EMPTY_COUNTS: Counts = {
  pages: 0,
  events: 0,
  sermons: 0,
  ministries: 0,
  leaders: 0,
  media: 0,
};

interface RecentItem {
  kind: string;
  title: string;
  updatedAt: Date;
}

type SlimDoc = { title?: string; name?: string; updatedAt?: Date };

function collectRecents(kind: string, docs: SlimDoc[]): RecentItem[] {
  return docs.map((doc) => ({
    kind,
    title: doc.title ?? doc.name ?? "(untitled)",
    updatedAt: doc.updatedAt ?? new Date(0),
  }));
}

async function loadDashboardData(): Promise<{
  counts: Counts;
  recent: RecentItem[];
  error?: string;
}> {
  try {
    await connectToDatabase();

    const [pages, events, sermons, ministries, leaders, media] = await Promise.all([
      PageModel.countDocuments(),
      EventModel.countDocuments(),
      SermonModel.countDocuments(),
      MinistryModel.countDocuments(),
      LeaderModel.countDocuments(),
      MediaModel.countDocuments(),
    ]);

    const [latestPages, latestEvents, latestSermons, latestMinistries, latestLeaders] =
      await Promise.all([
        PageModel.find().sort({ updatedAt: -1 }).limit(1).lean(),
        EventModel.find().sort({ updatedAt: -1 }).limit(1).lean(),
        SermonModel.find().sort({ updatedAt: -1 }).limit(1).lean(),
        MinistryModel.find().sort({ updatedAt: -1 }).limit(1).lean(),
        LeaderModel.find().sort({ updatedAt: -1 }).limit(1).lean(),
      ]);

    const recent = [
      ...collectRecents("Page", latestPages),
      ...collectRecents("Event", latestEvents),
      ...collectRecents("Sermon", latestSermons),
      ...collectRecents("Ministry", latestMinistries),
      ...collectRecents("Leader", latestLeaders),
    ]
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 6);

    return { counts: { pages, events, sermons, ministries, leaders, media }, recent };
  } catch (error) {
    console.error("Dashboard data load failed:", error);
    return {
      counts: EMPTY_COUNTS,
      recent: [],
      error: "Unable to load website data. Check the database connection.",
    };
  }
}

export default async function AdminDashboardPage() {
  const session = await requireAdmin();
  const { counts, recent, error } = await loadDashboardData();

  const recentRelative = (date: Date): string => {
    const diffMs = Date.now() - date.getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const firstName = session.name.split(" ")[0] || session.name;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          Welcome back, {firstName} 👋
        </h2>
        <p className="mt-1 text-gray-600">
          Here&apos;s what&apos;s happening with the website today.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Website stats */}
      <section aria-label="Website statistics">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Website
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {STAT_DEFS.map((stat) => {
            const Icon = stat.icon;
            const value = counts[stat.key as keyof Counts];
            return (
              <div
                key={stat.key}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-tgm-gold/15">
                  <Icon className="h-5 w-5 text-tgm-blue" />
                </div>
                <p className="text-2xl font-bold text-gray-800 sm:text-3xl">{value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Quick actions */}
        <section aria-label="Quick actions">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Quick Actions
          </h3>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <ul className="divide-y divide-gray-100">
              {QUICK_ACTIONS.map((action) => (
                <li key={action.label}>
                  <Link
                    href={action.href}
                    className="group flex items-center justify-between rounded-lg px-2 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-tgm-blue"
                  >
                    <span className="flex items-center gap-2.5">
                      <Plus className="h-4 w-4 text-tgm-gold" />
                      {action.label}
                    </span>
                    <ArrowRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-tgm-gold" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Recent activity */}
        <section aria-label="Recent activity">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Recent Activity
          </h3>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            {recent.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                No content has been published yet. Updates will appear here as
                you add pages, events, sermons, and media.
              </p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {recent.map((item, index) => (
                  <li
                    key={`${item.kind}-${index}`}
                    className="flex items-center justify-between gap-3 py-2.5"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="shrink-0 rounded-md bg-tgm-blue/5 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-tgm-blue">
                        {item.kind}
                      </span>
                      <span className="truncate text-sm text-gray-700">{item.title}</span>
                    </div>
                    <span className="shrink-0 text-xs text-gray-400">
                      {recentRelative(item.updatedAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
