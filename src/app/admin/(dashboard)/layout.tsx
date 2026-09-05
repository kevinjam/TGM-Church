import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/session";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: {
    default: "Dashboard | TGM CMS",
    template: "%s | TGM CMS",
  },
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defense in depth: middleware redirects unauthenticated visitors, and the
  // layout re-checks the session server-side before rendering any admin page.
  const session = await requireAdmin();

  return (
    <AdminShell sessionName={session.name} sessionEmail={session.email}>
      {children}
    </AdminShell>
  );
}
