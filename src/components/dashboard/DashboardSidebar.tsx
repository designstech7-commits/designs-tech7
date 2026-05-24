"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { Profile } from "@/types";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: "◈" },
  { href: "/dashboard/projects", label: "My Projects", icon: "◆" },
  { href: "/dashboard/drafts", label: "Saved Drafts", icon: "◇" },
  { href: "/dashboard/messages", label: "Messages", icon: "◉" },
  { href: "/dashboard/downloads", label: "Downloads", icon: "↓" },
];

interface DashboardSidebarProps {
  profile: Profile | null;
}

export default function DashboardSidebar({ profile }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-white/5 bg-ink z-30">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-7 h-7">
              <div className="absolute inset-0 bg-acid rounded-sm group-hover:scale-110 transition-transform" />
              <div className="absolute inset-1 bg-ink rounded-[2px]" />
              <div className="absolute inset-2 bg-acid rounded-[1px]" />
            </div>
            <div>
              <p className="text-label text-platinum/70 leading-none">Motion Poster</p>
              <p className="text-label text-platinum/30 leading-none">Atelier</p>
            </div>
          </Link>
        </div>

        {/* Profile info */}
        <div className="px-4 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-acid/10 border border-acid/20 flex items-center justify-center shrink-0">
              <span className="text-acid text-xs font-mono">
                {(profile?.full_name || "?").charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm text-platinum truncate">{profile?.full_name || "Client"}</p>
              <p className="text-label text-platinum/30 truncate">{profile?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-nav-item ${active ? "active" : ""}`}
              >
                <span className="text-sm w-5 text-center">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-white/5 space-y-0.5">
          <Link href="/commission" className="sidebar-nav-item">
            <span className="text-sm w-5 text-center">+</span>
            <span>New Commission</span>
          </Link>
          <Link href="/" className="sidebar-nav-item">
            <span className="text-sm w-5 text-center">↗</span>
            <span>View Portfolio</span>
          </Link>
          <form action="/auth/signout" method="POST">
            <button type="submit" className="sidebar-nav-item w-full text-left">
              <span className="text-sm w-5 text-center">→</span>
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-30 glass-dark border-t border-white/5">
        <div className="flex">
          {NAV_ITEMS.slice(0, 5).map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors ${active ? "text-acid" : "text-platinum/30"}`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="text-[9px] font-mono tracking-wider">{item.label.split(" ")[0]}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
