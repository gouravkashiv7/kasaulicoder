"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PlanModalProps {
  showPlanModal: boolean;
  setShowPlanModal: (show: boolean) => void;
  editingPlan: any;
  planForm: any;
  setPlanForm: React.Dispatch<React.SetStateAction<any>>;
  handlePlanSubmit: (e: React.FormEvent) => void;
  planSubmitting: boolean;
  planError: string;
}

const PlanModal = ({
  showPlanModal,
  setShowPlanModal,
  editingPlan,
  planForm,
  setPlanForm,
  handlePlanSubmit,
  planSubmitting,
  planError,
}: PlanModalProps) => {
  return (
    <AnimatePresence>
      {showPlanModal && (
        <div
          key="plan-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-background border border-foreground/10 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-foreground/10 flex justify-between items-center bg-foreground/5">
              <h2 className="text-xl font-black text-foreground">
                {editingPlan
                  ? "Modify Pricing Plan"
                  : "Create New Pricing Plan"}
              </h2>
              <button
                onClick={() => setShowPlanModal(false)}
                className="size-8 flex items-center justify-center rounded-full hover:bg-foreground/10 text-foreground/50 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form
              onSubmit={handlePlanSubmit}
              className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 flex-1">
                  <label className="text-[10px] font-black uppercase text-foreground/40 ml-1">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    required
                    value={planForm.name}
                    onChange={(e) =>
                      setPlanForm({ ...planForm, name: e.target.value })
                    }
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40 transition-colors"
                    placeholder="e.g. Professional Coding"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-foreground/40 ml-1">
                    Display Order (Low to High)
                  </label>
                  <input
                    type="number"
                    value={planForm.sortOrder}
                    onChange={(e) =>
                      setPlanForm({
                        ...planForm,
                        sortOrder: parseInt(e.target.value),
                      })
                    }
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-foreground/40 ml-1">
                  Description
                </label>
                <textarea
                  required
                  value={planForm.description}
                  onChange={(e) =>
                    setPlanForm({ ...planForm, description: e.target.value })
                  }
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40 transition-colors min-h-20 resize-none"
                  placeholder="Summarize what this plan offers…"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-foreground/40 ml-1">
                    Price
                  </label>
                  <input
                    type="number"
                    required
                    value={planForm.price}
                    onChange={(e) =>
                      setPlanForm({
                        ...planForm,
                        price: parseFloat(e.target.value),
                      })
                    }
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-foreground/40 ml-1">
                    Currency
                  </label>
                  <select
                    value={planForm.currency}
                    onChange={(e) =>
                      setPlanForm({ ...planForm, currency: e.target.value })
                    }
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40 transition-colors appearance-none"
                  >
                    <option value="INR">Indian Rupee (INR)</option>
                    <option value="USD">US Dollar (USD)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-foreground/40 ml-1">
                    Billing Type
                  </label>
                  <select
                    value={planForm.billingType}
                    onChange={(e) =>
                      setPlanForm({
                        ...planForm,
                        billingType: e.target.value as any,
                      })
                    }
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40 transition-colors appearance-none"
                  >
                    <option value="one_time">One-time Payment</option>
                    <option value="recurring">Recurring Subscription</option>
                  </select>
                </div>
                {planForm.billingType === "recurring" && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-foreground/40 ml-1">
                      Billing Cycle
                    </label>
                    <select
                      value={planForm.billingCycle}
                      onChange={(e) =>
                        setPlanForm({
                          ...planForm,
                          billingCycle: e.target.value as any,
                        })
                      }
                      className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40 transition-colors appearance-none"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-foreground/40 ml-1">
                    Target Audience
                  </label>
                  <select
                    value={planForm.targetAudience}
                    onChange={(e) =>
                      setPlanForm({
                        ...planForm,
                        targetAudience: e.target.value as any,
                      })
                    }
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40 transition-colors appearance-none"
                  >
                    <option value="both">All Audiences</option>
                    <option value="student">Students Only</option>
                    <option value="professional">Professionals Only</option>
                  </select>
                </div>
                <div className="flex items-center gap-6 h-18">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={planForm.isFeatured}
                      onChange={(e) =>
                        setPlanForm({
                          ...planForm,
                          isFeatured: e.target.checked,
                        })
                      }
                      className="size-4 rounded border-foreground/20 text-primary focus:ring-primary/20"
                    />
                    <span className="text-[10px] font-black uppercase text-foreground/40 group-hover:text-foreground/70 transition-colors">
                      Featured Tier
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={planForm.isActive}
                      onChange={(e) =>
                        setPlanForm({ ...planForm, isActive: e.target.checked })
                      }
                      className="size-4 rounded border-foreground/20 text-emerald-500 focus:ring-emerald-500/20"
                    />
                    <span className="text-[10px] font-black uppercase text-foreground/40 group-hover:text-foreground/70 transition-colors">
                      Active
                    </span>
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase text-foreground/40 ml-1">
                    Features List
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setPlanForm({
                        ...planForm,
                        features: [...planForm.features, ""],
                      })
                    }
                    className="text-[10px] font-black text-primary uppercase hover:underline"
                  >
                    + Add row
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {planForm.features.map((feature: string, idx: number) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          const newF = [...planForm.features];
                          newF[idx] = e.target.value;
                          setPlanForm({ ...planForm, features: newF });
                        }}
                        className="flex-1 bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary/40 transition-colors"
                        placeholder={`Feature #${idx + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newF = planForm.features.filter(
                            (_: any, i: number) => i !== idx,
                          );
                          setPlanForm({
                            ...planForm,
                            features: newF.length > 0 ? newF : [""],
                          });
                        }}
                        className="size-9 flex items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">
                          remove
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {planError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs font-bold text-center">
                  {planError}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="flex-1 py-3 text-foreground font-black text-xs uppercase bg-foreground/5 hover:bg-foreground/10 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={planSubmitting}
                  className="flex-2 py-3 bg-primary text-primary-content font-black text-xs uppercase rounded-xl hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {planSubmitting && (
                    <div className="size-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  )}
                  {editingPlan ? "Sync Changes" : "Deploy Plan"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PlanModal;
