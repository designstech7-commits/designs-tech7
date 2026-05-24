"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

export default function RegisterClient() {
  const [form, setForm] = useState({ full_name: "", email: "", password: "", company: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  const set = (k: string, v: string) => setForm((prev) => ({ ...prev, [k]: v }));

  const handleRegister = async () => {
    if (!form.email || !form.password || !form.full_name) {
      return toast.error("Please fill in all required fields");
    }
    if (form.password.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.full_name, company: form.company },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      setDone(true);
    } catch (err: unknown) {
      toast.error((err as Error).message || "Registration failed");
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

        {done ? (
          <div className="glass rounded-sm p-10 text-center">
            <div className="w-14 h-14 rounded-full bg-acid flex items-center justify-center mx-auto mb-6">
              <span className="text-ink text-2xl">✓</span>
            </div>
            <h2 className="text-display-md text-platinum mb-3">Check your email</h2>
            <p className="text-sm text-platinum/50">
              We sent a confirmation link to <strong className="text-platinum/80">{form.email}</strong>. Click it to activate your account.
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-display-md text-platinum mb-2">Create Account</h1>
            <p className="text-sm text-platinum/40 mb-8">Join the client portal to manage your commissions.</p>

            <div className="space-y-4">
              <div>
                <label className="text-label text-platinum/40 block mb-2">Full Name *</label>
                <input
                  className="form-input w-full px-4 py-3 rounded-sm text-sm"
                  placeholder="Your full name"
                  value={form.full_name}
                  onChange={(e) => set("full_name", e.target.value)}
                />
              </div>

              <div>
                <label className="text-label text-platinum/40 block mb-2">Email *</label>
                <input
                  type="email"
                  className="form-input w-full px-4 py-3 rounded-sm text-sm"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </div>

              <div>
                <label className="text-label text-platinum/40 block mb-2">Company / Organization</label>
                <input
                  className="form-input w-full px-4 py-3 rounded-sm text-sm"
                  placeholder="Optional"
                  value={form.company}
                  onChange={(e) => set("company", e.target.value)}
                />
              </div>

              <div>
                <label className="text-label text-platinum/40 block mb-2">Password *</label>
                <input
                  type="password"
                  className="form-input w-full px-4 py-3 rounded-sm text-sm"
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                />
              </div>

              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-acid text-ink py-3 text-label font-mono uppercase hover:bg-acid/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-2"
              >
                {loading ? "Creating account…" : "Create Account →"}
              </button>
            </div>

            <p className="text-label text-platinum/30 mt-6 text-center">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-acid hover:text-acid/70 transition-colors">
                Sign in
              </Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
