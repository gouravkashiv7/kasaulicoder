"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";

import ShipTodayShowcase from "@/components/marketing/ShipTodayShowcase";

const ContactCommunity = () => {
  const [userType, setUserType] = useState<"student" | "professional" | null>(
    null,
  );
  const [formData, setFormData] = useState({ name: "", email: "", query: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const type = new URLSearchParams(window.location.search).get("type");
      if (type === "student" || type === "professional") {
        setUserType(type);
      }
    }
  }, []);

  const handleTypeChange = (type: "student" | "professional") => {
    setUserType(type);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("type", type);
      window.history.pushState({}, "", url.toString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userType) return;
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Your inquiry has been received. We will be in touch shortly.",
        });
        setFormData({ name: "", email: "", query: "" });
      } else {
        setMessage({
          type: "error",
          text: data.error || "Something went wrong.",
        });
      }
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "Failed to submit request. Try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-display bg-background text-foreground min-h-screen selection:bg-primary selection:text-background">
      <GlobalHeader />

      <main className="pt-28">
        {/* Section 1: Dynamic Contact/Registration Form */}
        <section className="relative py-20 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,242,255,0.05)_0%,transparent_50%)]"></div>

          <div className="max-w-6xl mx-auto flex flex-col items-center">
            {/* Toggle */}
            <div className="flex p-1.5 bg-foreground/5 rounded-2xl mb-16 border border-foreground/5 relative w-full max-w-sm">
              <button
                type="button"
                onClick={() => handleTypeChange("student")}
                className={`relative z-10 flex-1 py-3 px-4 text-xs font-black uppercase tracking-widest rounded-xl transition-colors duration-500 ${
                  userType === "student"
                    ? "text-primary-content"
                    : "text-foreground/50 hover:text-foreground/80"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange("professional")}
                className={`relative z-10 flex-1 py-3 px-4 text-xs font-black uppercase tracking-widest rounded-xl transition-colors duration-500 ${
                  userType === "professional"
                    ? "text-white"
                    : "text-foreground/50 hover:text-foreground/80"
                }`}
              >
                Professional
              </button>

              {userType && (
                <motion.div
                  layout
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className={`absolute inset-y-1.5 left-1.5 w-[calc(50%-6px)] rounded-xl shadow-lg ${
                    userType === "student" ? "bg-primary" : "bg-secondary"
                  }`}
                  style={{
                    x: userType === "student" ? "0%" : "100%",
                  }}
                />
              )}
            </div>

            <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center justify-center w-full min-h-100">
              {/* TEXT CONTENT */}
              <motion.div
                layout
                transition={{ duration: 0.6, ease: "anticipate" }}
                className={`w-full lg:w-1/2 flex flex-col justify-center ${
                  userType === "student" ? "lg:order-2" : "lg:order-1"
                }`}
              >
                <AnimatePresence mode="wait">
                  {userType === "student" ? (
                    <motion.div
                      key="student"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-xs font-bold uppercase tracking-widest mb-4">
                        Learning Path
                      </span>
                      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-foreground">
                        Start building on{" "}
                        <span className="text-primary italic">
                          real world projects
                        </span>{" "}
                        with us.
                      </h1>
                      <p className="text-foreground/60 text-lg mb-8 max-w-lg">
                        Accelerate your coding journey by joining a community of
                        driven learners. Gain hands-on experience, connect with
                        peers, and fast-track your technical skills.
                      </p>
                    </motion.div>
                  ) : userType === "professional" ? (
                    <motion.div
                      key="professional"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded text-xs font-bold uppercase tracking-widest mb-4">
                        Business & Services
                      </span>
                      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-foreground">
                        Accelerate your{" "}
                        <span className="text-secondary italic">
                          Digital Transformation.
                        </span>
                      </h1>
                      <p className="text-foreground/60 text-lg mb-8 max-w-lg">
                        Partner with our seasoned experts. We craft elegant
                        interfaces, scalable architectures, and next-generation
                        AI integrations tailored for growth.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="text-center lg:text-left"
                    >
                      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-foreground/40">
                        Select a path above <br />
                        to get started.
                      </h1>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* FORM CONTENT */}
              <motion.div
                layout
                transition={{ duration: 0.6, ease: "anticipate" }}
                className={`w-full lg:w-1/2 max-w-lg relative ${
                  userType === "student" ? "lg:order-1" : "lg:order-2"
                }`}
              >
                <div className="bg-background/40 backdrop-blur-xl border border-foreground/10 p-8 rounded-xl shadow-2xl relative overflow-hidden transition-all duration-500">
                  {!userType && (
                    <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-20 flex items-center justify-center">
                      <p className="font-bold text-foreground/50 bg-foreground/5 px-6 py-3 rounded-full border border-foreground/10 shadow-lg">
                        Selection Required
                      </p>
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {message && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
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

                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-foreground/50">
                        Full Name
                      </label>
                      <input
                        required
                        disabled={!userType || loading}
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full bg-foreground/5 border border-foreground/10 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground px-4 py-3 outline-none transition-all placeholder:text-transparent"
                        type="text"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-foreground/50">
                        Email Address
                      </label>
                      <input
                        required
                        disabled={!userType || loading}
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full bg-foreground/5 border border-foreground/10 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground px-4 py-3 outline-none transition-all placeholder:text-transparent"
                        type="email"
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-foreground/50 transition-all duration-300">
                        {userType === "professional"
                          ? "What services are you looking for?"
                          : "What do you want to build/learn?"}
                      </label>
                      <textarea
                        required
                        disabled={!userType || loading}
                        rows={4}
                        value={formData.query}
                        onChange={(e) =>
                          setFormData({ ...formData, query: e.target.value })
                        }
                        className="w-full bg-foreground/5 border border-foreground/10 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground px-4 py-3 outline-none transition-all placeholder:text-transparent resize-none"
                      />
                    </div>
                    <button
                      disabled={!userType || loading}
                      className={`w-full font-bold py-4 rounded-lg transition-all uppercase tracking-widest border ${
                        userType === "professional"
                          ? "bg-secondary text-white border-secondary hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                          : "bg-primary text-primary-content border-primary hover:shadow-[0_0_20px_rgba(0,242,255,0.3)]"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      type="submit"
                    >
                      {loading
                        ? "Submitting..."
                        : userType === "student"
                          ? "Send Application"
                          : "Request Consultation"}
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <ShipTodayShowcase />
      </main>

      <GlobalFooter />
    </div>
  );
};

export default ContactCommunity;
