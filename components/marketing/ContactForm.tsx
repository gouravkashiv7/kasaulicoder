"use client";

import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useState } from "react";
import GlobalFooter from "@/components/layout/GlobalFooter";
import GlobalHeader from "@/components/layout/GlobalHeader";

const serviceAreas = [
  "SaaS Product Development",
  "Business Automation",
  "SEO Services",
  "UI/UX and Web Development",
  "Cloud Infrastructure",
  "Ongoing Technical Support",
];

const fieldClass =
  "w-full bg-foreground/5 border border-foreground/10 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground px-4 py-3 outline-none transition-all disabled:opacity-60";
const labelClass =
  "block text-xs font-bold uppercase tracking-widest mb-2 text-foreground/60";

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", query: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // The contact API still records an enquirer type; all enquiries are
        // now business enquiries.
        body: JSON.stringify({
          ...formData,
          userType: "professional",
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
        <section className="relative py-20 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,242,255,0.05)_0%,transparent_50%)]"></div>

          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 items-center justify-center">
            {/* TEXT CONTENT */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full lg:w-1/2 flex flex-col justify-center"
            >
              <span className="inline-block w-fit px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-xs font-bold uppercase tracking-widest mb-4">
                Contact
              </span>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-foreground">
                Let&apos;s Discuss{" "}
                <span className="text-primary italic">Your Project</span>
              </h1>
              <p className="text-foreground/70 text-lg mb-8 max-w-lg">
                Tell us about the product, website or business process you want
                to build or improve, and we will get back to you to talk it
                through.
              </p>
              <ul className="flex flex-wrap gap-2 max-w-lg">
                {serviceAreas.map((area) => (
                  <li
                    key={area}
                    className="px-3 py-1.5 rounded-lg bg-foreground/5 border border-foreground/10 text-xs font-semibold text-foreground/70"
                  >
                    {area}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* FORM CONTENT */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full lg:w-1/2 max-w-lg relative"
            >
              <div className="bg-background/40 backdrop-blur-xl border border-foreground/10 p-8 rounded-xl shadow-2xl relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {message && (
                    <motion.div
                      aria-live="polite"
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
                    <label htmlFor="contact-name" className={labelClass}>
                      Full Name
                    </label>
                    <input
                      id="contact-name"
                      required
                      disabled={loading}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className={fieldClass}
                      type="text"
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className={labelClass}>
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      required
                      disabled={loading}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={fieldClass}
                      type="email"
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-query" className={labelClass}>
                      What would you like us to build or improve?
                    </label>
                    <textarea
                      id="contact-query"
                      required
                      disabled={loading}
                      rows={4}
                      value={formData.query}
                      onChange={(e) =>
                        setFormData({ ...formData, query: e.target.value })
                      }
                      className={`${fieldClass} resize-none`}
                    />
                  </div>
                  <button
                    disabled={loading}
                    className="w-full font-bold py-4 rounded-lg transition-all uppercase tracking-widest border bg-primary text-primary-content border-primary hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                  >
                    {loading ? "Submitting..." : "Send Enquiry"}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default ContactForm;
