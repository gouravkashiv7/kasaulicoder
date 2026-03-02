"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plan } from "./types";

interface PricingProps {
  plans: Plan[];
  plansLoading: boolean;
  setShowPlanModal: (show: boolean) => void;
  openEditPlan: (plan: Plan) => void;
  handleDeletePlan: (id: string) => void;
  handleTogglePlanActive: (plan: Plan) => void;
}

const Pricing = ({
  plans,
  plansLoading,
  setShowPlanModal,
  openEditPlan,
  handleDeletePlan,
  handleTogglePlanActive,
}: PricingProps) => {
  return (
    <motion.div
      key="pricing"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black mb-2 text-foreground">
            Pricing Plans
          </h1>
          <p className="text-foreground/50">
            Manage your subscription tiers and billing options.
          </p>
        </div>
        <button
          onClick={() => {
            setShowPlanModal(true);
          }}
          className="px-6 py-3 bg-primary text-primary-content font-black rounded-xl hover:brightness-110 flex items-center gap-2 shadow-lg shadow-primary/20 transition-all"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Create New Plan
        </button>
      </div>

      {plansLoading ? (
        <div className="p-20 text-center animate-pulse text-primary font-bold text-lg">
          Synchronizing pricing data...
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-background/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-20 text-center">
          <span className="material-symbols-outlined text-6xl text-foreground/10 mb-6 block">
            payments
          </span>
          <p className="text-foreground/40 font-bold mb-6">
            No pricing plans found in the system.
          </p>
          <button
            onClick={() => setShowPlanModal(true)}
            className="text-primary font-bold hover:underline"
          >
            Click here to create your first plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {plans
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((plan) => (
              <div
                key={plan._id}
                className={`bg-background/40 backdrop-blur-xl border rounded-2xl p-6 transition-all relative overflow-hidden group ${
                  plan.isActive
                    ? "border-foreground/10"
                    : "border-rose-500/20 opacity-60 grayscale-[0.5]"
                }`}
              >
                {!plan.isActive && (
                  <div className="absolute top-3 right-3 bg-rose-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full z-10">
                    Inactive
                  </div>
                )}
                {plan.isFeatured && (
                  <div className="absolute top-0 left-0 bg-primary text-primary-content text-[10px] font-black uppercase px-3 py-1 rounded-br-xl shadow-lg">
                    Featured Tier
                  </div>
                )}
                <div className="mb-6 pt-4">
                  <h3 className="text-xl font-black text-foreground mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-foreground/50 line-clamp-2 min-h-8">
                    {plan.description}
                  </p>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-black text-foreground">
                    {plan.currency} {plan.price.toLocaleString()}
                  </span>
                  <span className="text-foreground/40 text-xs font-bold ml-1 italic">
                    {plan.billingType === "recurring"
                      ? `/ ${plan.billingCycle}`
                      : "/ one-time"}
                  </span>
                </div>
                <div className="space-y-3 mb-8">
                  <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">
                    Key Features
                  </p>
                  {plan.features.slice(0, 4).map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs text-foreground/60"
                    >
                      <span className="material-symbols-outlined text-sm text-emerald-500 shrink-0">
                        check_circle
                      </span>
                      <span className="truncate">{f}</span>
                    </div>
                  ))}
                  {plan.features.length > 4 && (
                    <p className="text-[10px] text-foreground/30 font-bold pl-6">
                      +{plan.features.length - 4} more features
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditPlan(plan)}
                    className="flex-1 py-2.5 bg-foreground/5 hover:bg-foreground/10 text-foreground font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">
                      edit_note
                    </span>
                    Modify
                  </button>
                  <button
                    onClick={() => handleTogglePlanActive(plan)}
                    className={`size-10 flex items-center justify-center rounded-xl transition-all border ${
                      plan.isActive
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20"
                        : "bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20"
                    }`}
                    title={plan.isActive ? "Deactivate" : "Activate"}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {plan.isActive ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                  <button
                    onClick={() => handleDeletePlan(plan._id)}
                    className="size-10 flex items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20 hover:bg-orange-500/20 transition-all"
                    title="Delete Permanently"
                  >
                    <span className="material-symbols-outlined text-lg">
                      delete_forever
                    </span>
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </motion.div>
  );
};

export default Pricing;
