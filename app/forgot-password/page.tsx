"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: data.message, type: "success" });
        setEmail("");
      } else {
        setMessage({ text: data.error || "Failed to process request", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "An error occurred. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-display relative overflow-hidden">
      <GlobalHeader />
      
      <main className="flex-1 flex items-center justify-center pt-24 pb-12 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md glass-morphism border-white/5 dark:border-white/10 rounded-4xl p-8 sm:p-10 shadow-2xl"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black mb-3">Forgot Password</h1>
            <p className="text-foreground/60 text-sm">
              Enter your email address and we'll send you a link to reset your access key.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {message && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className={`p-4 rounded-xl mb-6 text-sm font-bold text-center border overflow-hidden ${
                  message.type === "success"
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                }`}
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-foreground/50 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 text-xl group-focus-within:text-primary transition-colors">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-foreground/3 border border-foreground/10 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-foreground placeholder:text-foreground/20"
                  placeholder="name@kasaulicoder.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full font-black py-4 bg-primary text-primary-content rounded-xl hover:shadow-[0_0_25px_rgba(0,242,255,0.4)] transition-all uppercase tracking-[0.2em] text-sm active:scale-95 disabled:opacity-70 disabled:cursor-wait"
            >
              {loading ? "Sending link..." : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-foreground/5 text-center">
            <Link href="/login" className="text-xs font-black text-foreground/40 hover:text-primary transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Login
            </Link>
          </div>
        </motion.div>
      </main>

      <GlobalFooter />
    </div>
  );
}
