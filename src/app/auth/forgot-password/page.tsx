"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email) return toast.error("Enter your email");
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md"
      >
        <Link href="/auth/login" className="text-label text-platinum/30 hover:text-platinum/60 transition-colors mb-10 block">
          ← Back to login
        </Link>

        {sent ? (
          <div className="glass rounded-sm p-10 text-center">
            <div className="w-14 h-14 rounded-full bg-acid/10 border border-acid/30 flex items-center justify-center mx-auto mb-6">
              <span className="text-acid text-2xl">✉</span>
            </div>
            <h2 className="text-display-md text-platinum mb-3">Check your inbox</h2>
            <p className="text-sm text-platinum/50">
              We sent a password reset link to <strong className="text-platinum/80">{email}</strong>.
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-display-md text-platinum mb-2">Reset Password</h1>
            <p className="text-sm text-platinum/40 mb-8">
              Enter your email and we'll send a reset link.
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-label text-platinum/40 block mb-2">Email</label>
                <input
                  type="email"
                  className="form-input w-full px-4 py-3 rounded-sm text-sm"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleReset()}
                />
              </div>
              <button
                onClick={handleReset}
                disabled={loading}
                className="w-full bg-acid text-ink py-3 text-label font-mono uppercase hover:bg-acid/90 transition-colors disabled:opacity-40"
              >
                {loading ? "Sending…" : "Send Reset Link →"}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
