"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import type { SiteSettingsView } from "@/lib/db/services/site-settings";

/**
 * Wraps the whole app. Renders the public Navbar/Footer only for public
 * pages — /admin/* gets a bare document so the dashboard shell controls its
 * own layout without leaking public chrome.
 *
 * `settings` are the CMS-managed global values (with hardcoded fallbacks)
 * fetched once by the server root layout.
 */
export function SiteShell({
  settings,
  children,
}: {
  settings: SiteSettingsView;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminArea = pathname?.startsWith("/admin");

  if (isAdminArea) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        churchDisplayName={settings.brand.displayName}
        churchShortName={settings.brand.shortName}
      />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
