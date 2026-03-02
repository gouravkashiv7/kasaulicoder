"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";
import { LocationMap } from "@/components/ui/expand-map";

type UserType = "student" | "professional" | null;

const RegisterPage = () => {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    userType: null as UserType,
  });

  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // Sync URL to State on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const type = new URLSearchParams(window.location.search).get("type");
      if (type === "student" || type === "professional") {
        setFormData((prev) => ({ ...prev, userType: type as UserType }));
      }
    }
  }, []);

  // Update State and URL
  const handleTypeChange = (type: UserType) => {
    setFormData((prev) => ({ ...prev, userType: type }));
    if (typeof window !== "undefined" && type) {
      const url = new URL(window.location.href);
      url.searchParams.set("type", type);
      window.history.pushState({}, "", url.toString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userType) {
      setMessage({ text: "Please select a user type first.", type: "error" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        ...formData,
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem(
          "user",
          JSON.stringify({ ...data.user, loginType: "user" }),
        );
        setMessage({
          text: "Account created! Redirecting to your dashboard...",
          type: "success",
        });
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
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

  const isStudent = formData.userType === "student";
  const isProfessional = formData.userType === "professional";
  const isSelected = isStudent || isProfessional;

  // Dynamic accent: students get secondary, professionals get primary
  const accent = isStudent ? "secondary" : "primary";

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

      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-12 px-4 relative z-10 w-full max-w-7xl mx-auto">
        {/* Step 1: Selection Header */}
        <div className="w-full text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Join the{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
              KasauliCoder
            </span>{" "}
            Ecosystem
          </h1>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
            Whether you're a student building a standout portfolio through live
            projects, or a professional seeking premium tech services, your
            journey starts here.
          </p>
        </div>

        {/* Step 2: The Map Selectors (Overlapping Animation) */}
        <div className="flex items-center justify-center w-full mb-10 min-h-100 relative mt-12">
          <motion.div
            onClick={() => handleTypeChange("student")}
            className="absolute cursor-pointer"
            animate={{
              scale: isStudent ? 1.1 : isProfessional ? 0.75 : 1,
              x: isStudent ? -60 : isProfessional ? -200 : -160,
              y: isProfessional ? 15 : 0,
              zIndex: isStudent ? 20 : 10,
              opacity: isProfessional ? 0.6 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            whileHover={{ scale: isStudent ? 1.1 : 1.05 }}
          >
            <LocationMap
              location="Student"
              coordinates=""
              isSelected={isStudent}
              colorTheme="secondary"
              className="w-70"
            />
          </motion.div>

          <motion.div
            onClick={() => handleTypeChange("professional")}
            className="absolute cursor-pointer"
            animate={{
              scale: isProfessional ? 1.1 : isStudent ? 0.75 : 1,
              x: isProfessional ? 60 : isStudent ? 200 : 160,
              y: isStudent ? 15 : 0,
              zIndex: isProfessional ? 20 : 10,
              opacity: isStudent ? 0.6 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            whileHover={{ scale: isProfessional ? 1.1 : 1.05 }}
          >
            <LocationMap
              location="Professional"
              coordinates=""
              isSelected={isProfessional}
              colorTheme="primary"
              className="w-70"
            />
          </motion.div>
        </div>

        {/* Step 2.5: The Moved Banner */}
        <AnimatePresence>
          {isStudent && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.9 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.9 }}
              className="flex items-center justify-center gap-2 mb-10 text-rose-500 font-bold bg-rose-500/10 w-fit mx-auto px-5 py-2.5 rounded-full border border-rose-500/20 overflow-hidden shadow-[0_0_15px_rgba(244,63,94,0.1)] relative z-30"
            >
              <span className="material-symbols-outlined text-sm">
                error_outline
              </span>
              <span className="text-sm">
                Limited Seats Remaining: Only 4 slots left for the{" "}
                {new Date().toLocaleString("default", { month: "long" })}{" "}
                intake!
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 3: Interactive Layout Swap (Text vs Form) */}
        <div className="w-full max-w-5xl relative min-h-125">
          <AnimatePresence mode="wait">
            {!isSelected && (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 flex items-center justify-center pb-20 pointer-events-none"
              >
                <p className="text-foreground/40 text-xl font-bold uppercase tracking-[0.2em] animate-pulse">
                  Select your path above to continue
                </p>
              </motion.div>
            )}

            {isSelected && (
              <motion.div
                key="interactive-section"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col lg:flex-row gap-8 w-full ${isProfessional ? "lg:flex-row-reverse" : ""}`}
              >
                {/* TEXT SIDE */}
                <motion.div
                  layout
                  className="flex-1 flex flex-col justify-center p-8 bg-foreground/5 border border-foreground/10 rounded-3xl backdrop-blur-md"
                >
                  <AnimatePresence mode="wait">
                    {isStudent ? (
                      <motion.div
                        key="text-student"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <h2 className="text-3xl font-black mb-4">
                          Start building on real-world projects with us.
                        </h2>
                        <p className="text-foreground/70 leading-relaxed mb-6">
                          Join Cohort 4.0 as a student. You'll dive deep into
                          actual codebases, work alongside experienced mentors,
                          and build a portfolio that stands out in the modern
                          tech ecosystem.
                        </p>
                        <ul className="space-y-3 text-sm font-semibold text-foreground/80">
                          <li className="flex items-center gap-2">
                            <span className="text-secondary material-symbols-outlined text-sm">
                              check_circle
                            </span>{" "}
                            Hands-on AI Integration
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-secondary material-symbols-outlined text-sm">
                              check_circle
                            </span>{" "}
                            Live Project Mentorship
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-secondary material-symbols-outlined text-sm">
                              check_circle
                            </span>{" "}
                            Modern Web Architecture
                          </li>
                        </ul>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="text-professional"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <h2 className="text-3xl font-black mb-4">
                          Elevate your business with our expertise.
                        </h2>
                        <p className="text-foreground/70 leading-relaxed mb-6">
                          Partner with KasauliCoder for your technical needs.
                          From advanced AI integration to scalable web
                          architectures, our team delivers premium services
                          tailored to your objectives.
                        </p>
                        <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl text-sm text-primary font-medium mt-4">
                          * Note: This is a premium, paid professional
                          development opportunity.
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* FORM SIDE */}
                <motion.div
                  layout
                  className="flex-1 glass-morphism border-white/5 dark:border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
                >
                  <div
                    className={`absolute -top-px left-8 right-8 h-px bg-linear-to-r from-transparent via-${accent}/40 to-transparent`}
                  ></div>

                  <AnimatePresence mode="wait">
                    {message && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`p-4 rounded-xl mb-6 text-sm font-bold text-center border ${
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
                        <span
                          className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 text-xl transition-colors group-focus-within:text-${accent}`}
                        >
                          person
                        </span>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className={`w-full bg-foreground/5 border border-foreground/10 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-${accent}/20 focus:border-${accent} outline-none transition-all text-foreground`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-foreground/50 ml-1">
                        Email Address
                      </label>
                      <div className="relative group">
                        <span
                          className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 text-xl transition-colors group-focus-within:text-${accent}`}
                        >
                          mail
                        </span>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className={`w-full bg-foreground/5 border border-foreground/10 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-${accent}/20 focus:border-${accent} outline-none transition-all text-foreground`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-foreground/50 ml-1">
                        Secure Password
                      </label>
                      <div className="relative group">
                        <span
                          className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 text-xl transition-colors group-focus-within:text-${accent}`}
                        >
                          lock
                        </span>
                        <input
                          type="password"
                          required
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                          className={`w-full bg-foreground/5 border border-foreground/10 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-${accent}/20 focus:border-${accent} outline-none transition-all text-foreground`}
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full bg-${accent} text-primary-content font-black py-4 rounded-xl hover:shadow-[0_0_25px_var(--${accent})] transition-all uppercase tracking-[0.2em] text-sm mt-4 relative overflow-hidden group/btn ${loading ? "opacity-70 cursor-wait" : "active:scale-95"}`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? "Processing..." : "Initialize Registration"}
                      </span>
                    </button>
                  </form>

                  <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <p className="text-slate-400">
                      Already have an account?{" "}
                      <Link
                        href="/login"
                        className={`text-${accent} font-bold hover:underline`}
                      >
                        Log in
                      </Link>
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <div className="mt-auto relative z-10">
        <GlobalFooter />
      </div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-3xl pointer-events-none transform translate-x-1/2"></div>
    </div>
  );
};

export default RegisterPage;
