"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cross, ExternalLink, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ADMIN_NAV_ITEMS, AdminNavLinks } from "@/components/admin/admin-nav";
import { LogoutButton } from "@/components/admin/logout-button";

function currentSectionLabel(pathname: string): string {
  let match: (typeof ADMIN_NAV_ITEMS)[number] | undefined;
  for (const item of ADMIN_NAV_ITEMS) {
    const active =
      item.href === "/admin"
        ? pathname === "/admin"
        : pathname === item.href || pathname.startsWith(`${item.href}/`);
    if (active && (!match || item.href.length > match.href.length)) {
      match = item;
    }
  }
  return match?.label ?? "Dashboard";
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 px-5 py-5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-tgm-gold/15">
        <Cross className="h-5 w-5 text-tgm-gold" />
      </div>
      {!compact && (
        <div className="flex flex-col leading-tight">
          <span className="text-base font-bold text-tgm-text">TGM CMS</span>
          <span className="text-[11px] text-tgm-textmuted">
            Church Content Manager
          </span>
        </div>
      )}
    </div>
  );
}

function SidebarUser({
  sessionName,
  sessionEmail,
}: {
  sessionName: string;
  sessionEmail: string;
}) {
  return (
    <div className="border-t border-tgm-gold/20 p-3">
      <div className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5">
        <div className="flex min-w-0 items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-tgm-gold text-xs font-bold text-tgm-blue">
              {initials(sessionName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-xs font-medium text-tgm-text">{sessionName}</p>
            <p className="truncate text-[11px] text-tgm-textmuted">{sessionEmail}</p>
          </div>
        </div>
        <LogoutButton
          variant="ghost"
          showLabel={false}
          className="h-8 w-8 shrink-0 text-tgm-textmuted hover:bg-tgm-gold/10 hover:text-tgm-text"
        />
      </div>
    </div>
  );
}

export function AdminShell({
  sessionName,
  sessionEmail,
  children,
}: {
  sessionName: string;
  sessionEmail: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const sectionLabel = currentSectionLabel(pathname);

  return (
    <div className="admin-app min-h-screen bg-gray-100 text-gray-900">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-tgm-blue lg:flex">
        <Brand />
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <AdminNavLinks />
        </div>
        <SidebarUser sessionName={sessionName} sessionEmail={sessionEmail} />
      </aside>

      {/* Main column */}
      <div className="flex min-h-screen flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-gray-200 bg-white/95 px-4 backdrop-blur sm:gap-3 sm:px-6">
          {/* Mobile: drawer trigger + brand */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 shrink-0 text-gray-700 hover:bg-gray-200 lg:hidden"
                aria-label="Open admin menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="flex w-72 flex-col bg-tgm-blue p-0 text-tgm-text"
            >
              <SheetTitle className="sr-only">Admin navigation</SheetTitle>
              <Brand />
              <div className="flex-1 overflow-y-auto px-3 pb-4">
                <AdminNavLinks onNavigate={() => setMobileOpen(false)} />
              </div>
              <SidebarUser sessionName={sessionName} sessionEmail={sessionEmail} />
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-tgm-blue">
              <Cross className="h-4 w-4 text-tgm-gold" />
            </div>
            <span className="font-semibold text-gray-800">{sectionLabel}</span>
          </div>

          {/* Desktop: current section */}
          <h1 className="hidden text-lg font-semibold text-gray-800 lg:block">
            {sectionLabel}
          </h1>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-tgm-blue hover:bg-gray-200 hover:text-tgm-blue"
              >
                <ExternalLink className="h-4 w-4 sm:mr-1.5" />
                <span className="hidden sm:inline">View website</span>
              </Link>
            </Button>
            <div className="hidden items-center gap-2 rounded-lg border border-gray-200 px-2 py-1.5 md:flex">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-tgm-blue text-xs font-bold text-tgm-gold">
                  {initials(sessionName)}
                </AvatarFallback>
              </Avatar>
              <div className="leading-tight">
                <p className="text-xs font-semibold text-gray-800">{sessionName}</p>
                <p className="text-[11px] text-gray-500">{sessionEmail}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
