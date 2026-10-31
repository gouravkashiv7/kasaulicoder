"use client";

import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useState } from "react";
import GlobalFooter from "@/components/layout/GlobalFooter";
import GlobalHeader from "@/components/layout/GlobalHeader";
import { Icon } from "@/components/ui/marketing";
import { serviceGroups } from "@/lib/services";

const NOT_SURE = "Not sure yet";

const timelineOptions = [
  "As soon as possible",
  "Within 1–3 months",
  "In 3–6 months",
  "Flexible / not decided",
];

const emptyForm = {
  name: "",
  email: "",
  company: "",
  service: "",
  query: "",
  budget: "",
  timeline: "",
};

const fieldClass =
  "w-full bg-foreground/5 border border-foreground/15 rounded-xl focus:ring-2 focus:ring-primary/25 focus:border-primary text-foreground placeholder:text-foreground/35 px-4 py-3 outline-none transition-colors disabled:opacity-60 [&>option]:bg-background";
const labelClass = "block text-sm font-semibold mb-2 text-foreground/85";
const optionalClass = "font-normal text-foreground/70";

const ContactForm = ({ initialService }: { initialService?: string }) => {
  const initialServiceTitle =
    serviceGroups.find((group) => group.id === initialService)?.title ?? "";
  const [formData, setFormData] = useState({
    ...emptyForm,
    service: initialServiceTitle,
  });
  const update =
    (field: keyof typeof emptyForm) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setFormData((current) => ({ ...current, [field]: e.target.value }));
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
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Thank you. Your enquiry has been sent and we will reply by email.",
        });
        setFormData(emptyForm);
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
    <div className="font-sans bg-background text-foreground min-h-screen overflow-x-hidden selection:bg-primary selection:text-background">
      <GlobalHeader />

      <main className="pt-32 sm:pt-40 pb-20 sm:pb-28 px-4 sm:px-6 relative">
        <div
          className="absolute inset-x-0 top-0 h-[70vh] pointer-events-none bg-[radial-gradient(ellipse_60%_60%_at_20%_20%,color-mix(in_oklab,var(--primary)_9%,transparent)_0%,transparent_100%)]"
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Intro */}
          <div className="lg:col-span-5">
            <p className="font-display text-base sm:text-lg font-semibold text-primary mb-5">
              Contact
            </p>
            <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight leading-[1.04] text-balance mb-6">
              Let&apos;s Discuss Your Project
            </h1>
            <p className="text-lg text-foreground/75 leading-relaxed mb-10 max-w-lg">
              Tell us about the product, website or business process you want to
              build or improve. We will read your requirements and reply by
              email to talk them through.
            </p>

            <h2 className="font-display text-lg font-bold mb-4">
              What happens next
            </h2>
            <ol className="space-y-4 max-w-lg">
              {[
                "We review your enquiry and any details you share.",
                "We reply to ask questions and discuss your requirements.",
                "If it is a good fit, we send a proposal scoped to your project.",
              ].map((step, i) => (
                <li key={step} className="flex gap-4 text-foreground/75">
                  <span className="font-display font-bold text-primary shrink-0 w-5">
                    {i + 1}.
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-foreground/10 bg-background/70 backdrop-blur-xl p-6 sm:p-10 shadow-2xl">
              <AnimatePresence mode="wait">
                {message && (
                  <motion.div
                    role={message.type === "error" ? "alert" : "status"}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`flex items-start gap-3 p-4 rounded-xl mb-8 text-sm font-semibold border overflow-hidden ${
                      message.type === "success"
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                    }`}
                  >
                    <Icon
                      name={
                        message.type === "success" ? "check_circle" : "error"
                      }
                      className="text-xl leading-5"
                    />
                    {message.text}
                  </motion.div>
                )}
              </AnimatePresence>

              <form
                className="grid sm:grid-cols-2 gap-x-5 gap-y-6"
                onSubmit={handleSubmit}
              >
                <div>
                  <label htmlFor="contact-name" className={labelClass}>
                    Name
                  </label>
                  <input
                    id="contact-name"
                    required
                    disabled={loading}
                    value={formData.name}
                    onChange={update("name")}
                    className={fieldClass}
                    type="text"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className={labelClass}>
                    Email
                  </label>
                  <input
                    id="contact-email"
                    required
                    disabled={loading}
                    value={formData.email}
                    onChange={update("email")}
                    className={fieldClass}
                    type="email"
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label htmlFor="contact-company" className={labelClass}>
                    Company or business name{" "}
                    <span className={optionalClass}>(optional)</span>
                  </label>
                  <input
                    id="contact-company"
                    disabled={loading}
                    value={formData.company}
                    onChange={update("company")}
                    className={fieldClass}
                    type="text"
                    autoComplete="organization"
                    maxLength={200}
                  />
                </div>
                <div>
                  <label htmlFor="contact-service" className={labelClass}>
                    Service of interest
                  </label>
                  <div className="relative">
                    <select
                      id="contact-service"
                      required
                      disabled={loading}
                      value={formData.service}
                      onChange={update("service")}
                      className={`${fieldClass} appearance-none pr-11`}
                    >
                      <option value="" disabled>
                        Choose a service
                      </option>
                      {serviceGroups.map((group) => (
                        <option key={group.id} value={group.title}>
                          {group.title}
                        </option>
                      ))}
                      <option value={NOT_SURE}>{NOT_SURE}</option>
                    </select>
                    <Icon
                      name="expand_more"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 pointer-events-none"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="contact-query" className={labelClass}>
                    Project requirements
                  </label>
                  <textarea
                    id="contact-query"
                    required
                    disabled={loading}
                    rows={6}
                    value={formData.query}
                    onChange={update("query")}
                    aria-describedby="contact-query-hint"
                    className={`${fieldClass} resize-y min-h-36`}
                  />
                  <p
                    id="contact-query-hint"
                    className="mt-2 text-sm text-foreground/70"
                  >
                    What you want to build or improve, who will use it, and any
                    existing systems it needs to work with.
                  </p>
                </div>
                <div>
                  <label htmlFor="contact-budget" className={labelClass}>
                    Budget range{" "}
                    <span className={optionalClass}>(optional)</span>
                  </label>
                  <input
                    id="contact-budget"
                    disabled={loading}
                    value={formData.budget}
                    onChange={update("budget")}
                    className={fieldClass}
                    type="text"
                    maxLength={200}
                    placeholder="An approximate range, in your currency"
                  />
                </div>
                <div>
                  <label htmlFor="contact-timeline" className={labelClass}>
                    Expected timeline{" "}
                    <span className={optionalClass}>(optional)</span>
                  </label>
                  <div className="relative">
                    <select
                      id="contact-timeline"
                      disabled={loading}
                      value={formData.timeline}
                      onChange={update("timeline")}
                      className={`${fieldClass} appearance-none pr-11`}
                    >
                      <option value="">No preference</option>
                      {timelineOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <Icon
                      name="expand_more"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 pointer-events-none"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2 pt-2">
                  <button
                    disabled={loading}
                    className="w-full sm:w-auto px-10 py-4 rounded-xl font-bold bg-primary text-primary-content shadow-lg shadow-primary/20 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    type="submit"
                  >
                    {loading ? "Sending enquiry…" : "Send Enquiry"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default ContactForm;
