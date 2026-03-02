"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StatusToggleModalProps {
  toggleConfirm: {
    id: string;
    type: "users" | "staff";
    currentStatus: boolean;
    name: string;
    isSubmitting: boolean;
  } | null;
  setToggleConfirm: (val: any) => void;
  executeStatusToggle: (sendEmail: boolean) => void;
}

const StatusToggleModal = ({
  toggleConfirm,
  setToggleConfirm,
  executeStatusToggle,
}: StatusToggleModalProps) => {
  return (
    <AnimatePresence>
      {toggleConfirm && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-background border border-foreground/10 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl p-8 text-center"
          >
            <div
              className={`size-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                toggleConfirm.currentStatus
                  ? "bg-rose-500/10 text-rose-500"
                  : "bg-emerald-500/10 text-emerald-500"
              }`}
            >
              <span className="material-symbols-outlined text-4xl">
                {toggleConfirm.currentStatus ? "person_off" : "person_check"}
              </span>
            </div>
            <h3 className="text-xl font-black text-foreground mb-2">
              {toggleConfirm.currentStatus ? "Deactivate" : "Activate"}{" "}
              {toggleConfirm.name}?
            </h3>
            <p className="text-sm text-foreground/50 mb-8 leading-relaxed">
              Are you sure you want to{" "}
              {toggleConfirm.currentStatus ? "suspend" : "resume"} access for
              this {toggleConfirm.type === "users" ? "member" : "team member"}?
            </p>

            <div className="flex flex-col gap-3">
              <button
                disabled={toggleConfirm.isSubmitting}
                onClick={() => executeStatusToggle(true)}
                className={`py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                  toggleConfirm.currentStatus
                    ? "bg-rose-500 text-white hover:brightness-110 shadow-lg shadow-rose-500/20"
                    : "bg-emerald-600 text-white hover:brightness-110 shadow-lg shadow-emerald-500/20"
                }`}
              >
                {toggleConfirm.isSubmitting && (
                  <div className="size-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                Confirm & Notify User
              </button>
              <button
                disabled={toggleConfirm.isSubmitting}
                onClick={() => executeStatusToggle(false)}
                className="py-3 bg-foreground/5 text-foreground font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-foreground/10 transition-all"
              >
                Confirm Silently
              </button>
              <button
                disabled={toggleConfirm.isSubmitting}
                onClick={() => setToggleConfirm(null)}
                className="mt-2 text-foreground/30 hover:text-foreground font-bold text-[10px] uppercase tracking-widest transition-colors"
              >
                Go Back
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default StatusToggleModal;
