import { createClient } from "@/lib/supabase/server";
import MessagesClient from "@/components/dashboard/MessagesClient";

interface PageProps {
  searchParams: { project?: string };
}

export default async function DashboardMessagesPage({ searchParams }: PageProps) {
  const { project } = searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: commissions } = await supabase
    .from("commission_requests")
    .select("id, project_title, status")
    .eq("user_id", user!.id)
    .eq("is_draft", false)
    .order("created_at", { ascending: false });

  const activeProjectId = project || commissions?.[0]?.id || null;

  const { data: messages } = activeProjectId
    ? await supabase
        .from("messages")
        .select("*, sender:profiles(full_name, role)")
        .eq("commission_id", activeProjectId)
        .order("created_at", { ascending: true })
    : { data: [] };

  if (activeProjectId && messages && messages.length > 0) {
    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("commission_id", activeProjectId)
      .neq("sender_id", user!.id);
  }

  return (
    <MessagesClient
      commissions={commissions || []}
      messages={messages || []}
      activeProjectId={activeProjectId}
      userId={user!.id}
    />
  );
}
