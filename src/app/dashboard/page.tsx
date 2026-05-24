import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getStatusLabel, getStatusColor, formatDate } from "@/lib/utils";
import type { CommissionRequest } from "@/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: commissions }, { data: drafts }, { data: messages }, { data: downloads }] = await Promise.all([
    supabase.from("commission_requests").select("*").eq("user_id", user!.id).eq("is_draft", false).order("created_at", { ascending: false }).limit(5),
    supabase.from("commission_requests").select("*").eq("user_id", user!.id).eq("is_draft", true).limit(3),
    supabase.from("messages").select("*, commission:commission_requests(project_title)").eq("is_read", false).limit(5),
    supabase.from("downloads").select("*").eq("user_id", user!.id).limit(3),
  ]);

  const activeCount = (commissions || []).filter((c) =>
    ["submitted", "reviewing", "in_progress", "revision"].includes(c.status)
  ).length;

  return (
    <div className="space-y-8 pb-20">
      {/* Welcome */}
      <div>
        <p className="text-label text-platinum/30 mb-1">Welcome back</p>
        <h2 className="text-2xl font-display text-platinum">Your Commission Overview</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Active Projects", value: activeCount, accent: true },
          { label: "Total Commissions", value: (commissions || []).length },
          { label: "Saved Drafts", value: (drafts || []).length },
          { label: "Unread Messages", value: (messages || []).length },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`glass rounded-sm p-5 ${stat.accent && stat.value > 0 ? "glass-acid" : ""}`}
          >
            <p className={`text-3xl font-display mb-1 ${stat.accent ? "text-acid" : "text-platinum"}`}>
              {stat.value}
            </p>
            <p className="text-label text-platinum/40">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent commissions */}
      <div className="glass rounded-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <p className="text-label text-platinum/50">Recent Commissions</p>
          <Link href="/dashboard/projects" className="text-label text-acid/70 hover:text-acid transition-colors">
            View all →
          </Link>
        </div>

        {commissions && commissions.length > 0 ? (
          <div className="divide-y divide-white/5">
            {commissions.map((commission: CommissionRequest) => (
              <div key={commission.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm text-platinum truncate">{commission.project_title}</p>
                  <p className="text-label text-platinum/30 mt-0.5">
                    {commission.submitted_at ? formatDate(commission.submitted_at) : "Draft"}
                  </p>
                </div>
                <span className={`status-badge shrink-0 ${getStatusColor(commission.status)}`}>
                  {getStatusLabel(commission.status)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="text-label text-platinum/25 mb-4">No commissions yet</p>
            <Link href="/commission" className="text-label text-acid hover:text-acid/70 transition-colors">
              Start your first commission →
            </Link>
          </div>
        )}
      </div>

      {/* Downloads */}
      {downloads && downloads.length > 0 && (
        <div className="glass rounded-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <p className="text-label text-platinum/50">Recent Deliverables</p>
            <Link href="/dashboard/downloads" className="text-label text-acid/70 hover:text-acid transition-colors">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {downloads.map((dl) => (
              <div key={dl.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm text-platinum truncate">{dl.file_name}</p>
                  {dl.file_description && (
                    <p className="text-label text-platinum/30">{dl.file_description}</p>
                  )}
                </div>
                {dl.public_url && (
                  <a
                    href={dl.public_url}
                    download
                    className="text-label text-acid hover:text-acid/70 transition-colors shrink-0"
                  >
                    Download ↓
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { href: "/commission", label: "New Commission", icon: "+" },
          { href: "/portfolio", label: "Browse Portfolio", icon: "◈" },
          { href: "/dashboard/messages", label: "View Messages", icon: "◉" },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="glass rounded-sm p-5 flex items-center gap-4 hover:border-white/15 transition-all duration-200 group"
          >
            <span className="text-acid text-xl">{action.icon}</span>
            <span className="text-sm text-platinum/60 group-hover:text-platinum transition-colors">{action.label}</span>
            <span className="ml-auto text-platinum/20 group-hover:text-platinum/50 transition-colors">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
