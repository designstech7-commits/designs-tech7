"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { formatRelativeTime, getStatusColor, getStatusLabel } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Message } from "@/types";

interface Commission {
  id: string;
  project_title: string;
  status: string;
}

interface MessagesClientProps {
  commissions: Commission[];
  messages: Message[];
  activeProjectId: string | null;
  userId: string;
}

export default function MessagesClient({
  commissions,
  messages: initialMessages,
  activeProjectId,
  userId,
}: MessagesClientProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Real-time subscription
  useEffect(() => {
    if (!activeProjectId) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`messages:${activeProjectId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `commission_id=eq.${activeProjectId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeProjectId]);

  const handleSend = async () => {
    if (!newMessage.trim() || !activeProjectId) return;
    setSending(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("messages").insert({
        commission_id: activeProjectId,
        sender_id: userId,
        content: newMessage.trim(),
      });
      if (error) throw error;
      setNewMessage("");
    } catch {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const activeCommission = commissions.find((c) => c.id === activeProjectId);

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4 pb-16 md:pb-0">
      {/* Thread list */}
      <div className="w-64 shrink-0 glass rounded-sm overflow-hidden flex flex-col hidden md:flex">
        <div className="px-4 py-4 border-b border-white/5">
          <p className="text-label text-platinum/30">Projects</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {commissions.length === 0 ? (
            <p className="text-label text-platinum/25 p-4">No projects yet</p>
          ) : (
            commissions.map((commission) => (
              <button
                key={commission.id}
                onClick={() => router.push(`/dashboard/messages?project=${commission.id}`)}
                className={`w-full text-left px-4 py-3 border-b border-white/5 transition-all duration-200 ${
                  activeProjectId === commission.id
                    ? "bg-white/5 border-l-2 border-l-acid"
                    : "hover:bg-white/[0.02]"
                }`}
              >
                <p className="text-sm text-platinum truncate">{commission.project_title}</p>
                <span className={`text-label mt-0.5 block ${getStatusColor(commission.status)}`}>
                  {getStatusLabel(commission.status)}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Message thread */}
      <div className="flex-1 glass rounded-sm overflow-hidden flex flex-col">
        {/* Thread header */}
        <div className="px-6 py-4 border-b border-white/5 shrink-0">
          {activeCommission ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-platinum font-medium">{activeCommission.project_title}</p>
                <span className={`text-label ${getStatusColor(activeCommission.status)}`}>
                  {getStatusLabel(activeCommission.status)}
                </span>
              </div>
              <p className="text-label text-platinum/25 hidden md:block">Project Discussion</p>
            </div>
          ) : (
            <p className="text-label text-platinum/30">Select a project to view messages</p>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {!activeProjectId ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-label text-platinum/20">Select a project to view the discussion</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-label text-platinum/25 mb-2">No messages yet</p>
                <p className="text-sm text-platinum/20">
                  Send a message to start the conversation with the studio.
                </p>
              </div>
            </div>
          ) : (
            <>
              <AnimatePresence initial={false}>
                {messages.map((msg) => {
                  const isOwn = msg.sender_id === userId;
                  const senderProfile = msg.sender as unknown as { full_name?: string; role?: string } | null;
                  const senderName = isOwn
                    ? "You"
                    : senderProfile?.role === "admin"
                    ? "Designs.Tech7"
                    : senderProfile?.full_name || "Studio";

                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}>
                        <p className={`text-label ${isOwn ? "text-platinum/30" : "text-acid/60"}`}>
                          {senderName}
                        </p>
                        <div
                          className={`px-4 py-3 rounded-sm text-sm leading-relaxed ${
                            isOwn
                              ? "bg-acid/10 border border-acid/20 text-platinum"
                              : "glass text-platinum/80"
                          }`}
                        >
                          {msg.content}
                        </div>
                        <p className="text-[9px] font-mono text-platinum/20">
                          {formatRelativeTime(msg.created_at)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Compose */}
        {activeProjectId && (
          <div className="px-4 py-4 border-t border-white/5 shrink-0">
            <div className="flex gap-3">
              <textarea
                className="form-input flex-1 px-4 py-3 rounded-sm text-sm resize-none"
                rows={2}
                placeholder="Write a message to the studio…"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    handleSend();
                  }
                }}
              />
              <button
                onClick={handleSend}
                disabled={sending || !newMessage.trim()}
                className="bg-acid text-ink px-4 py-2 text-label font-mono uppercase hover:bg-acid/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0 self-end"
              >
                {sending ? "…" : "Send →"}
              </button>
            </div>
            <p className="text-[9px] font-mono text-platinum/20 mt-1 ml-1">⌘+Enter to send</p>
          </div>
        )}
      </div>
    </div>
  );
}
