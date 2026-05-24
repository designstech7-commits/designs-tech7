"use client";

import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/projects": "My Projects",
  "/dashboard/drafts": "Saved Drafts",
  "/dashboard/messages": "Messages",
  "/dashboard/downloads": "Downloads",
};

interface DashboardTopbarProps {
  user: User;
  profile: Profile | null;
}

export default function DashboardTopbar({ user, profile }: DashboardTopbarProps) {
  const pathname = usePathname() || "/dashboard";
  const title = PAGE_TITLES[pathname] || "Dashboard";

  return (
    <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 md:px-8 shrink-0">
      <div>
        <p className="text-label text-platinum/30 hidden md:block">Client Portal</p>
        <h1 className="text-base font-medium text-platinum">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-acid animate-pulse" />
          <span className="text-label text-platinum/30 hidden sm:block">Active</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-acid/10 border border-acid/20 flex items-center justify-center">
          <span className="text-acid text-xs font-mono">
            {(profile?.full_name || user.email || "?").charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    </header>
  );
}
