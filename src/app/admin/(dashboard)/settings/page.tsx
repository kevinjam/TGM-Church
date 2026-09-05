import { Settings as SettingsIcon } from "lucide-react";
import { getSiteSettingsView } from "@/lib/db/services/site-settings";
import { SettingsForm } from "@/app/admin/(dashboard)/settings/settings-form";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const settings = await getSiteSettingsView();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Site Settings</h2>
        <p className="mt-1 text-gray-600">
          Global information shown across the website — update it here and the
          changes appear on the public pages.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-tgm-gold/30 bg-tgm-gold/5 px-4 py-3 text-sm text-gray-700">
        <SettingsIcon className="mt-0.5 h-4 w-4 shrink-0 text-tgm-gold" />
        <p>
          These settings power the church name, tagline, contact details,
          service times, social links, footer, and search-engine defaults.
        </p>
      </div>

      <SettingsForm initial={settings} />
    </div>
  );
}
