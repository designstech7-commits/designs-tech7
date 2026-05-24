"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

export default function DraftActions({ draftId }: { draftId: string }) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Delete this draft? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("commission_requests")
        .delete()
        .eq("id", draftId);
      if (error) throw error;
      toast.success("Draft deleted");
      router.refresh();
    } catch {
      toast.error("Could not delete draft");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-4 shrink-0">
      {/* Resume — links back to commission page; 
          in a full implementation you'd pass the draftId as a query param 
          and pre-populate the form */}
      <a
        href={`/commission?resume=${draftId}`}
        className="text-label text-acid hover:text-acid/70 transition-colors"
      >
        Resume →
      </a>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="text-label text-platinum/25 hover:text-ember transition-colors disabled:opacity-30"
      >
        {deleting ? "Deleting…" : "Delete"}
      </button>
    </div>
  );
}
