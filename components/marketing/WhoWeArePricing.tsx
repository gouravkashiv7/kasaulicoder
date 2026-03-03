"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";
import ASMRStaticBackground from "@/components/ui/asmr-background";
import ShipTodayShowcase from "@/components/marketing/ShipTodayShowcase";

interface Plan {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingType: "one_time" | "recurring";
  billingCycle?: "monthly" | "yearly";
  features: string[];
  targetAudience: "student" | "professional" | "both";
  isFeatured: boolean;
  sortOrder: number;
}

const WhoWeArePricing = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingFilter, setBillingFilter] = useState<
    "all" | "one_time" | "recurring"
  >("all");
  const [cycleToggle, setCycleToggle] = useState<"monthly" | "yearly">(
    "monthly",
  );

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("/api/public/plans");
        const data = await res.json();
        if (res.ok) {
          setPlans(data.plans);
        }
      } catch (err) {
        console.error("Failed to fetch plans", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const filteredPlans = plans.filter((plan) => {
    if (billingFilter === "all") return true;
    if (billingFilter === "recurring") {
      return (
        plan.billingType === "recurring" && plan.billingCycle === cycleToggle
      );
    }
    return plan.billingType === billingFilter;
  });

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getBillingLabel = (plan: Plan) => {
    if (plan.billingType === "one_time") return "one time";
    return plan.billingCycle === "yearly" ? "/year" : "/mo";
  };

  const getAccentColor = (plan: Plan, index: number) => {
    if (plan.isFeatured)
      return {
        text: "text-primary",
        border: "border-primary",
        bg: "bg-primary",
      };
    if (plan.targetAudience === "student")
      return {
        text: "text-secondary",
        border: "border-secondary",
        bg: "bg-secondary",
      };
    if (index % 2 === 0)
      return {
        text: "text-primary",
        border: "border-primary",
        bg: "bg-primary",
      };
    return {
      text: "text-secondary",
      border: "border-secondary",
      bg: "bg-secondary",
    };
  };

  return (
    <div className="bg-transparent text-foreground min-h-screen selection:bg-primary/30 font-display">
      <div className="relative overflow-x-hidden">
        <ASMRStaticBackground />

        <div className="layout-container flex h-full grow flex-col relative z-10">
          <GlobalHeader />

          <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-32 pb-12 md:pb-24">
            {/* Header */}
            <section className="relative" id="pricing">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4">
                  Choose Your{" "}
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary italic">
                    Growth Plan
                  </span>
                </h2>
                <p className="text-foreground/50 max-w-2xl mx-auto">
                  Flexible plans designed for every stage — whether you're a
                  student building skills or a professional scaling services.
                </p>
              </motion.div>

              {/* Filter Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center gap-4 mb-12"
              >
                <div className="flex items-center gap-2 p-1 rounded-xl glass-morphism">
                  {[
                    { key: "all", label: "All Plans" },
                    { key: "one_time", label: "One-Time" },
                    { key: "recurring", label: "Subscription" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setBillingFilter(tab.key as any)}
                      className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                        billingFilter === tab.key
                          ? "bg-primary text-primary-content shadow-lg"
                          : "text-foreground/60 hover:text-foreground"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Monthly / Yearly Toggle */}
                <AnimatePresence>
                  {billingFilter === "recurring" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-3"
                    >
                      <span
                        className={`text-sm font-bold transition-colors ${
                          cycleToggle === "monthly"
                            ? "text-primary"
                            : "text-foreground/40"
                        }`}
                      >
                        Monthly
                      </span>
                      <button
                        onClick={() =>
                          setCycleToggle(
                            cycleToggle === "monthly" ? "yearly" : "monthly",
                          )
                        }
                        className="w-12 h-6 rounded-full bg-foreground/10 relative transition-colors"
                      >
                        <motion.div
                          className="w-5 h-5 rounded-full bg-primary absolute top-0.5"
                          animate={{ left: cycleToggle === "monthly" ? 2 : 26 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      </button>
                      <span
                        className={`text-sm font-bold transition-colors ${
                          cycleToggle === "yearly"
                            ? "text-primary"
                            : "text-foreground/40"
                        }`}
                      >
                        Yearly
                      </span>
                      {cycleToggle === "yearly" && (
                        <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          Save up to 20%
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Plans Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                  />
                </div>
              ) : filteredPlans.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <span className="material-symbols-outlined text-5xl text-foreground/20 mb-4 block">
                    inventory_2
                  </span>
                  <p className="text-foreground/40 text-lg font-bold">
                    No plans available yet.
                  </p>
                  <p className="text-foreground/30 text-sm mt-2">
                    Check back soon — new plans are coming!
                  </p>
                </motion.div>
              ) : (
                <div
                  className={`grid gap-8 items-stretch ${
                    filteredPlans.length === 1
                      ? "grid-cols-1 max-w-md mx-auto"
                      : filteredPlans.length === 2
                        ? "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto"
                        : "grid-cols-1 md:grid-cols-3"
                  }`}
                >
                  <AnimatePresence mode="popLayout">
                    {filteredPlans.map((plan, i) => {
                      const accent = getAccentColor(plan, i);
                      return (
                        <motion.div
                          key={plan._id}
                          layout
                          initial={{ opacity: 0, scale: 0.95, y: 20 }}
                          animate={{
                            opacity: 1,
                            scale: plan.isFeatured ? 1.05 : 1,
                            y: 0,
                          }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: 0.05 * i, duration: 0.4 }}
                          whileHover={{ y: -8 }}
                          className={`flex flex-col glass-card rounded-2xl p-8 border transition-all duration-500 group relative overflow-hidden ${
                            plan.isFeatured
                              ? `border-2 ${accent.border} z-20 ${accent.bg}/5`
                              : "border-foreground/10"
                          }`}
                        >
                          {/* Featured badge */}
                          {plan.isFeatured && (
                            <div
                              className={`absolute top-0 right-0 ${accent.bg} text-primary-content text-[10px] font-black px-4 py-1 rounded-bl-lg uppercase tracking-widest`}
                            >
                              Most Popular
                            </div>
                          )}

                          {/* Billing type badge */}
                          <div className="mb-6">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                                plan.billingType === "one_time"
                                  ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/10"
                                  : "border-primary/30 text-primary bg-primary/10"
                              }`}
                            >
                              {plan.billingType === "one_time"
                                ? "One-Time"
                                : "Subscription"}
                            </span>
                          </div>

                          {/* Plan name & audience */}
                          <div className="mb-6">
                            <h3
                              className={`text-lg font-bold ${accent.text} uppercase tracking-widest mb-2`}
                            >
                              {plan.name}
                            </h3>
                            {plan.description && (
                              <p className="text-foreground/40 text-sm">
                                {plan.description}
                              </p>
                            )}
                          </div>

                          {/* Price */}
                          <div className="flex items-baseline gap-1 mb-2">
                            <span className="text-5xl font-black text-foreground">
                              {formatPrice(plan.price, plan.currency)}
                            </span>
                            <span className="text-foreground/40 font-medium">
                              {getBillingLabel(plan)}
                            </span>
                          </div>

                          {/* Target audience tag */}
                          {plan.targetAudience !== "both" && (
                            <span
                              className={`text-[10px] font-bold uppercase tracking-widest mb-6 ${
                                plan.targetAudience === "student"
                                  ? "text-secondary"
                                  : "text-primary"
                              }`}
                            >
                              For {plan.targetAudience}s
                            </span>
                          )}

                          {/* Features */}
                          <ul className="space-y-3 mb-10 flex-1 mt-4">
                            {plan.features.map((feature) => (
                              <li
                                key={feature}
                                className="flex items-start gap-3 text-sm text-foreground/70"
                              >
                                <span
                                  className={`material-symbols-outlined ${accent.text} text-lg shrink-0`}
                                >
                                  check_circle
                                </span>
                                {feature}
                              </li>
                            ))}
                          </ul>

                          {/* CTA */}
                          <Link
                            href="/register"
                            className={`w-full py-3.5 px-6 rounded-xl font-bold text-center transition-all ${
                              plan.isFeatured
                                ? `${accent.bg} text-primary-content uppercase tracking-wider shadow-xl hover:shadow-2xl`
                                : `border-2 ${accent.border} ${accent.text} hover:${accent.bg} hover:text-primary-content`
                            }`}
                          >
                            Get Started
                          </Link>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </section>

            <ShipTodayShowcase />
          </main>

          <GlobalFooter />
        </div>
      </div>
    </div>
  );
};

export default WhoWeArePricing;
