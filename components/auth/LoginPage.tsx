"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";

// Lazy load the heavy globe component for performance
const InteractiveGlobe = dynamic(
  () =>
    import("@/components/ui/interactive-globe").then(
      (mod) => mod.InteractiveGlobe,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="size-full flex items-center justify-center">
        <div className="size-32 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    ),
  },
);

const LoginPage = () => {
  const [loginType, setLoginType] = React.useState<"user" | "admin">("user");
  const [formData, setFormData] = React.useState({ email: "", password: "" });
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setMessage(null);

      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, loginType }),
        });

        const data = await res.json();

        if (res.ok) {
          setMessage({
            text: "Login successful! Redirecting...",
            type: "success",
          });
          localStorage.setItem("user", JSON.stringify(data.user));
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 1500);
        } else {
          setMessage({ text: data.error || "Login failed", type: "error" });
        }
      } catch (err) {
        setMessage({
          text: "An error occurred. Please try again.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    },
    [formData, loginType],
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-display overflow-hidden relative transition-colors duration-500">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 size-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div
          className="absolute bottom-1/4 -right-20 size-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.05)_0%,transparent_70%)] opacity-50"></div>
      </div>

      <GlobalHeader />

      <main className="flex-1 flex items-center justify-center pt-24 pb-12 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-6xl overflow-hidden glass-morphism border-white/5 dark:border-white/10 rounded-[2.5rem] shadow-2xl relative"
        >
          <div className="flex flex-col lg:flex-row min-h-150">
            {/* Left Content — Login Form */}
            <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:border-r border-foreground/10 relative z-10 flex flex-col justify-center bg-background/40 backdrop-blur-md">
              <motion.div
                layout
                className={`absolute -top-px left-12 right-12 h-px bg-linear-to-r from-transparent ${loginType === "admin" ? "via-secondary" : "via-primary"} to-transparent`}
              ></motion.div>

              <div className="text-center lg:text-left mb-10">
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-3xl sm:text-4xl font-black mb-3 tracking-tight"
                >
                  Welcome Back
                </motion.h1>
                <p className="text-foreground/60 text-sm sm:text-base">
                  Access your{" "}
                  {loginType === "admin" ? "administrative" : "user"} workspace
                </p>
              </div>

              {/* Login Type Toggle */}
              <div className="flex p-1.5 bg-foreground/5 rounded-2xl mb-8 border border-foreground/5 relative max-w-sm mx-auto lg:mx-0">
                <button
                  type="button"
                  onClick={() => setLoginType("user")}
                  className={`relative z-10 flex-1 py-2.5 px-4 text-xs font-black rounded-xl transition-colors duration-500 ${
                    loginType === "user"
                      ? "text-primary-content"
                      : "text-foreground/50 hover:text-foreground/80"
                  }`}
                >
                  User Login
                </button>
                <button
                  type="button"
                  onClick={() => setLoginType("admin")}
                  className={`relative z-10 flex-1 py-2.5 px-4 text-xs font-black rounded-xl transition-colors duration-500 ${
                    loginType === "admin"
                      ? "text-white"
                      : "text-foreground/50 hover:text-foreground/80"
                  }`}
                >
                  Admin Login
                </button>

                <motion.div
                  layout
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className={`absolute inset-y-1.5 left-1.5 w-[calc(50%-6px)] rounded-xl shadow-lg ${
                    loginType === "user" ? "bg-primary" : "bg-secondary"
                  }`}
                  style={{
                    x: loginType === "user" ? "0%" : "100%",
                  }}
                />
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
                  <label className="block text-[10px] font-black uppercase tracking-widest text-foreground/50 ml-1">
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
                      className="w-full bg-foreground/3 border border-foreground/10 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-foreground placeholder:text-foreground/20"
                      placeholder="name@kasaulicoder.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50">
                      Password
                    </label>
                    <Link
                      href="#"
                      className="text-[10px] font-black uppercase tracking-tighter text-primary hover:underline"
                    >
                      Forgot access key?
                    </Link>
                  </div>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 text-xl transition-colors group-focus-within:text-primary">
                      lock
                    </span>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full bg-foreground/3 border border-foreground/10 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-foreground placeholder:text-foreground/20"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full font-black py-4 rounded-xl transition-all uppercase tracking-[0.2em] text-sm relative overflow-hidden group/btn ${
                    loginType === "admin"
                      ? "bg-secondary text-white hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]"
                      : "bg-primary text-primary-content hover:shadow-[0_0_25px_rgba(0,242,255,0.5)]"
                  } ${loading ? "opacity-70 cursor-wait" : "active:scale-95"}`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                        Syncing...
                      </>
                    ) : (
                      "Authorize Session"
                    )}
                  </span>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                </button>
              </form>

              <div className="mt-10 pt-8 border-t border-foreground/5 text-center lg:text-left">
                <p className="text-foreground/50 text-xs">
                  New to the hub?{" "}
                  <Link
                    href="/register"
                    className="text-primary font-black hover:underline"
                  >
                    Create Master Account
                  </Link>
                </p>
              </div>
            </div>

            {/* Right Content — Interactive Globe (Lazy Loaded) */}
            <div className="w-full lg:w-1/2 bg-primary/3 dark:bg-primary/1 flex flex-col justify-center items-center p-8 sm:p-12 relative overflow-hidden group">
              {/* Ambient Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/20 transition-colors duration-1000"></div>

              <div className="relative z-10 w-full flex flex-col items-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary mb-12 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  KasauliCoder Ecosystem Active
                </div>

                <div className="relative aspect-square w-full max-w-110 flex items-center justify-center pointer-events-auto">
                  <InteractiveGlobe size={440} />
                </div>

                <div className="mt-12 flex items-center justify-center">
                  <div className="inline-flex items-center gap-3 rounded-2xl border border-foreground/10 bg-foreground/5 px-5 py-3 backdrop-blur-sm">
                    <span className="material-symbols-outlined text-primary text-2xl">
                      headset_mic
                    </span>
                    <div>
                      <p className="text-sm font-black text-primary leading-none">
                        24/7
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">
                        Support
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <div className="mt-auto relative z-10">
        <GlobalFooter />
      </div>
    </div>
  );
};

export default LoginPage;
