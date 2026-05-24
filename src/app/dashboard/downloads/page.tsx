import { createClient } from "@/lib/supabase/server";
import { formatDate, formatFileSize } from "@/lib/utils";
import type { Download } from "@/types";

interface PageProps {
  searchParams: { project?: string };
}

export default async function DashboardDownloadsPage({ searchParams }: PageProps) {
  const { project } = searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const query = supabase
    .from("downloads")
    .select("*, commission:commission_requests(project_title)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  if (project) query.eq("commission_id", project);

  const { data: downloads } = await query;

  return (
    <div className="space-y-8 pb-20">
      <div>
        <p className="text-label text-platinum/30 mb-1">Delivered Files</p>
        <h2 className="text-2xl font-display text-platinum">Downloads</h2>
      </div>

      {downloads && downloads.length > 0 ? (
        <div className="glass rounded-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5">
            <p className="text-label text-platinum/30">{downloads.length} file{downloads.length !== 1 ? "s" : ""} available</p>
          </div>
          <div className="divide-y divide-white/5">
            {downloads.map((dl: Download & { commission?: { project_title: string } }) => (
              <div key={dl.id} className="px-6 py-5 flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <FileTypeIcon mimeType={dl.mime_type || ""} />
                    <p className="text-sm text-platinum font-medium truncate">{dl.file_name}</p>
                  </div>
                  <div className="flex flex-wrap gap-4 ml-7">
                    {dl.commission?.project_title && (
                      <span className="text-label text-platinum/30">{dl.commission.project_title}</span>
                    )}
                    {dl.file_description && (
                      <span className="text-label text-platinum/25">{dl.file_description}</span>
                    )}
                    {dl.file_size && (
                      <span className="text-label text-platinum/20">{formatFileSize(dl.file_size)}</span>
                    )}
                    <span className="text-label text-platinum/20">
                      Added {formatDate(dl.created_at)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  {dl.expires_at && (
                    <span className="text-label text-ember/60">
                      Expires {formatDate(dl.expires_at)}
                    </span>
                  )}
                  {dl.public_url ? (
                    <a
                      href={dl.public_url}
                      download={dl.file_name}
                      className="flex items-center gap-2 bg-acid text-ink px-4 py-2 text-label font-mono uppercase hover:bg-acid/90 transition-colors"
                    >
                      Download ↓
                    </a>
                  ) : (
                    <span className="text-label text-platinum/20">Not available</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass rounded-sm py-24 text-center">
          <p className="text-label text-platinum/25 mb-4">No deliverables yet</p>
          <p className="text-sm text-platinum/30">
            Files will appear here once the studio delivers your project assets.
          </p>
        </div>
      )}
    </div>
  );
}

function FileTypeIcon({ mimeType }: { mimeType: string }) {
  const icon =
    mimeType.startsWith("video/") ? "▶" :
    mimeType.startsWith("image/") ? "◈" :
    mimeType === "application/pdf" ? "⬜" :
    mimeType.includes("zip") || mimeType.includes("compressed") ? "◇" : "◆";

  const color =
    mimeType.startsWith("video/") ? "text-acid" :
    mimeType.startsWith("image/") ? "text-platinum/60" :
    mimeType === "application/pdf" ? "text-ember/70" : "text-platinum/40";

  return <span className={`text-sm ${color} shrink-0`}>{icon}</span>;
}
