"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";

const RegisterPage = () => {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          text: "Account created! Redirecting to login...",
          type: "success",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setMessage({
          text: data.error || "Registration failed",
          type: "error",
        });
      }
    } catch (err) {
      setMessage({
        text: "An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-display overflow-hidden relative transition-colors duration-500">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 -right-20 size-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div
          className="absolute bottom-1/4 -left-20 size-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.03)_0%,transparent_70%)] opacity-50"></div>
      </div>
      <GlobalHeader />
      <main className="flex-1 flex items-center justify-center pt-24 pb-12 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg"
        >
          <div className="glass-morphism border-white/5 dark:border-white/10 p-6 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
            {/* Design accents */}
            <div className="absolute -top-px left-8 right-8 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent"></div>

            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight">
                Create Account
              </h1>
              <p className="text-foreground/60 text-sm sm:text-base">
                Join our elite community of users
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

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-widest text-foreground/50 ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 text-xl transition-colors group-focus-within:text-primary">
                    person
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-foreground placeholder:text-foreground/20"
                    placeholder="Alex Neon"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-widest text-foreground/50 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 text-xl transition-colors group-focus-within:text-primary">
                    mail
                  </span>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-foreground placeholder:text-foreground/20"
                    placeholder="alex@nexus.io"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-widest text-foreground/50 ml-1">
                  Create Master Password
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 text-xl transition-colors group-focus-within:text-primary">
                    lock_open
                  </span>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-foreground placeholder:text-foreground/20"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-start group cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 rounded-sm border-foreground/20 bg-foreground/5 text-primary focus:ring-primary transition-all"
                  />
                  <span className="ml-3 text-[11px] leading-relaxed text-foreground/50 group-hover:text-foreground/80 transition-colors">
                    I agree to the{" "}
                    <span className="text-primary font-bold">
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="text-primary font-bold">
                      Privacy Policy
                    </span>
                    . I understand this is for professional development within
                    the KasauliCoder ecosystem.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-primary text-primary-content font-black py-4 rounded-xl hover:shadow-[0_0_25px_rgba(0,242,255,0.4)] transition-all uppercase tracking-[0.2em] text-sm mt-4 relative overflow-hidden group/btn ${
                  loading ? "opacity-70 cursor-wait" : "active:scale-95"
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                      Registering...
                    </>
                  ) : (
                    "Initialize Account"
                  )}
                </span>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-slate-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary font-bold hover:underline"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </main>
      <div className="mt-auto relative z-10">
        <GlobalFooter />
      </div>{" "}
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-3xl pointer-events-none transform translate-x-1/2"></div>
    </div>
  );
};

export default RegisterPage;
