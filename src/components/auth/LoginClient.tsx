"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [magicSent, setMagicSent] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const handlePasswordLogin = async () => {
    if (!email || !password) return toast.error("Fill in all fields");
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push(redirect);
      router.refresh();
    } catch (err: unknown) {
      toast.error((err as Error).message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) return toast.error("Enter your email");
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}` },
      });
      if (error) throw error;
      setMagicSent(true);
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to send link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-white/[0.01] border-r border-white/5 flex-col justify-between p-16">
        <div className="editorial-grid absolute inset-0 opacity-50" />

        {/* Decorative */}
        <div className="absolute top-20 right-20 w-48 h-48 border border-acid/10 rotate-12" />
        <div className="absolute bottom-32 left-16 w-32 h-32 border border-acid/8" />

        <div className="relative">
          <Link href="/" className="text-label text-platinum/40 hover:text-platinum transition-colors">
            ← Designs.Tech7
          </Link>
        </div>

        <div className="relative">
          <p className="text-label text-platinum/25 mb-4">Client Portal</p>
          <h2 className="text-display-lg text-platinum mb-6">
            Your work,<br />
            your <span className="text-acid italic">archive.</span>
          </h2>
          <p className="text-sm text-platinum/40 leading-relaxed max-w-sm">
            Access your commission history, project status, deliverables, and message center — all in one place.
          </p>
        </div>

        <div className="relative flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-acid animate-pulse" />
          <span className="text-label text-platinum/25">Secure client portal</span>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-10">
            <Link href="/" className="text-label text-platinum/40">
              ← Designs.Tech7
            </Link>
          </div>

          <h1 className="text-display-md text-platinum mb-2">Client Login</h1>
          <p className="text-sm text-platinum/40 mb-8">Welcome back to the portal.</p>

          {/* Mode toggle */}
          <div className="flex gap-0 mb-8 border border-white/8 rounded-sm overflow-hidden">
            <button
              onClick={() => setMode("password")}
              className={`flex-1 py-2.5 text-label transition-all duration-200 ${mode === "password" ? "bg-white/8 text-platinum" : "text-platinum/40 hover:text-platinum/60"}`}
            >
              Password
            </button>
            <button
              onClick={() => setMode("magic")}
              className={`flex-1 py-2.5 text-label transition-all duration-200 ${mode === "magic" ? "bg-white/8 text-platinum" : "text-platinum/40 hover:text-platinum/60"}`}
            >
              Magic Link
            </button>
          </div>

          {magicSent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-sm p-8 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-acid/10 border border-acid/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-acid text-xl">✉</span>
              </div>
              <p className="text-platinum mb-2">Check your inbox</p>
              <p className="text-sm text-platinum/40">
                We sent a magic link to <strong className="text-platinum/70">{email}</strong>. Click the link to sign in.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-label text-platinum/40 block mb-2">Email</label>
                <input
                  type="email"
                  className="form-input w-full px-4 py-3 rounded-sm text-sm"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (mode === "password" ? handlePasswordLogin() : handleMagicLink())}
                  autoComplete="email"
                />
              </div>

              {mode === "password" && (
                <div>
                  <label className="text-label text-platinum/40 block mb-2">Password</label>
                  <input
                    type="password"
                    className="form-input w-full px-4 py-3 rounded-sm text-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handlePasswordLogin()}
                    autoComplete="current-password"
                  />
                  <div className="text-right mt-1">
                    <Link href="/auth/forgot-password" className="text-label text-platinum/30 hover:text-platinum/60 transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                </div>
              )}

              <button
                onClick={mode === "password" ? handlePasswordLogin : handleMagicLink}
                disabled={loading}
                className="w-full bg-acid text-ink py-3 text-label font-mono uppercase hover:bg-acid/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-2"
              >
                {loading ? "Signing in…" : mode === "password" ? "Sign In →" : "Send Magic Link →"}
              </button>
            </div>
          )}

          {/* Register link */}
          <p className="text-label text-platinum/30 mt-8 text-center">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-acid hover:text-acid/70 transition-colors">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
