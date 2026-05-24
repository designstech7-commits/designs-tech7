import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatRelativeTime, getProjectTypeLabel } from "@/lib/utils";
import DraftActions from "@/components/dashboard/DraftActions";

export default async function DashboardDraftsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: drafts } = await supabase
    .from("commission_requests")
    .select("*")
    .eq("user_id", user!.id)
    .eq("is_draft", true)
    .order("updated_at", { ascending: false });

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-label text-platinum/30 mb-1">Incomplete Commissions</p>
          <h2 className="text-2xl font-display text-platinum">Saved Drafts</h2>
        </div>
        <Link
          href="/commission"
          className="bg-acid text-ink px-5 py-2.5 text-label font-mono uppercase hover:bg-acid/90 transition-colors"
        >
          + New Commission
        </Link>
      </div>

      {drafts && drafts.length > 0 ? (
        <div className="space-y-3">
          {drafts.map((draft) => (
            <div
              key={draft.id}
              className="glass rounded-sm px-6 py-5 flex flex-wrap items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-label text-platinum/25 border border-white/8 px-2 py-0.5">
                    Draft
                  </span>
                  {draft.project_type && (
                    <span className="text-label text-acid/50">
                      {getProjectTypeLabel(draft.project_type)}
                    </span>
                  )}
                </div>
                <h3 className="text-base text-platinum truncate">
                  {draft.project_title || "Untitled Draft"}
                </h3>
                <p className="text-label text-platinum/25 mt-0.5">
                  Last saved {formatRelativeTime(draft.updated_at)}
                </p>
              </div>

              <DraftActions draftId={draft.id} />
            </div>
          ))}
        </div>
      ) : (
        <div className="glass rounded-sm py-24 text-center">
          <p className="text-label text-platinum/25 mb-4">No saved drafts</p>
          <p className="text-sm text-platinum/30 mb-6">
            Start a commission and save your progress to resume later.
          </p>
          <Link
            href="/commission"
            className="text-label text-acid hover:text-acid/70 transition-colors"
          >
            Start a commission →
          </Link>
        </div>
      )}
    </div>
  );
}
