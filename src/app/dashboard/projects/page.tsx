import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getStatusLabel, getStatusColor, getProjectTypeLabel, formatDate, formatRelativeTime } from "@/lib/utils";
import type { CommissionRequest } from "@/types";

const STATUS_ORDER = ["submitted", "reviewing", "quoted", "approved", "in_progress", "revision", "delivered", "completed"];

export default async function DashboardProjectsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: commissions } = await supabase
    .from("commission_requests")
    .select("*, package:packages(name), status_updates:project_status_updates(*, created_at)")
    .eq("user_id", user!.id)
    .eq("is_draft", false)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-label text-platinum/30 mb-1">Commission History</p>
          <h2 className="text-2xl font-display text-platinum">My Projects</h2>
        </div>
        <Link href="/commission" className="bg-acid text-ink px-5 py-2.5 text-label font-mono uppercase hover:bg-acid/90 transition-colors">
          + New Commission
        </Link>
      </div>

      {commissions && commissions.length > 0 ? (
        <div className="space-y-4">
          {commissions.map((commission: CommissionRequest) => (
            <ProjectCard key={commission.id} commission={commission} />
          ))}
        </div>
      ) : (
        <div className="glass rounded-sm py-24 text-center">
          <p className="text-label text-platinum/25 mb-6">No commissions submitted yet</p>
          <Link href="/commission" className="bg-acid text-ink px-6 py-3 text-label font-mono uppercase hover:bg-acid/90 transition-colors">
            Start your first commission →
          </Link>
        </div>
      )}
    </div>
  );
}

function ProjectCard({ commission }: { commission: CommissionRequest }) {
  const currentStatusIndex = STATUS_ORDER.indexOf(commission.status);

  return (
    <div className="glass rounded-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-medium text-platinum mb-1">{commission.project_title}</h3>
          <div className="flex flex-wrap gap-4">
            <span className="text-label text-platinum/35">
              {getProjectTypeLabel(commission.project_type)}
            </span>
            {commission.submitted_at && (
              <span className="text-label text-platinum/25">
                Submitted {formatRelativeTime(commission.submitted_at)}
              </span>
            )}
          </div>
        </div>
        <span className={`status-badge ${getStatusColor(commission.status)}`}>
          {getStatusLabel(commission.status)}
        </span>
      </div>

      {/* Progress timeline */}
      <div className="px-6 py-5">
        <p className="text-label text-platinum/25 mb-4">Project Timeline</p>
        <div className="flex items-center gap-0 overflow-x-auto pb-2">
          {STATUS_ORDER.map((status, i) => {
            const isPast = i < currentStatusIndex;
            const isCurrent = i === currentStatusIndex;
            const isFuture = i > currentStatusIndex;
            return (
              <div key={status} className="flex items-center shrink-0">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 ${
                      isCurrent ? "border-acid bg-acid/20 shadow-[0_0_12px_rgba(200,255,0,0.4)]" :
                      isPast ? "border-acid/50 bg-acid/10" :
                      "border-white/10"
                    }`}
                  >
                    {isPast && <span className="text-acid text-[8px]">✓</span>}
                    {isCurrent && <span className="w-2 h-2 rounded-full bg-acid" />}
                  </div>
                  <p className={`text-[9px] font-mono mt-1.5 whitespace-nowrap ${
                    isCurrent ? "text-acid" : isPast ? "text-platinum/35" : "text-platinum/15"
                  }`}>
                    {getStatusLabel(status)}
                  </p>
                </div>
                {i < STATUS_ORDER.length - 1 && (
                  <div
                    className={`h-[1px] w-8 mx-1 transition-all duration-300 ${isPast ? "bg-acid/40" : "bg-white/5"}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-t border-white/5 flex flex-wrap gap-4">
        <Link
          href={`/dashboard/messages?project=${commission.id}`}
          className="text-label text-platinum/40 hover:text-platinum transition-colors"
        >
          Messages →
        </Link>
        <Link
          href={`/dashboard/downloads?project=${commission.id}`}
          className="text-label text-platinum/40 hover:text-platinum transition-colors"
        >
          Downloads →
        </Link>
        {commission.quoted_price && commission.status === "quoted" && (
          <span className="text-label text-acid ml-auto">
            Quote: ${(commission.quoted_price / 100).toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
}
