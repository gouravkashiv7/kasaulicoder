"use client";

import { AnimatePresence, motion } from "framer-motion";
import type React from "react";

interface FinanceFormModalProps {
  open: boolean;
  title: string;
  submitLabel: string;
  saving: boolean;
  error: string;
  disabled?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  children: React.ReactNode;
}

// Shared shell for the small finance forms (client, payment, expense, actions)
const FinanceFormModal = ({
  open,
  title,
  submitLabel,
  saving,
  error,
  disabled,
  onClose,
  onSubmit,
  children,
}: FinanceFormModalProps) => (
  <AnimatePresence>
    {open && (
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-background border border-foreground/10 w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-3xl shadow-2xl p-6 sm:p-8 space-y-4"
        >
          <h3 className="text-xl font-black text-foreground">{title}</h3>
          {children}
          {error && (
            <p role="alert" className="text-sm font-bold text-rose-500">
              {error}
            </p>
          )}
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl font-bold text-foreground/60 hover:bg-foreground/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || disabled}
              className="px-6 py-3 bg-primary text-primary-content font-black rounded-xl hover:brightness-110 disabled:opacity-50"
            >
              {saving ? "Saving…" : submitLabel}
            </button>
          </div>
        </motion.form>
      </div>
    )}
  </AnimatePresence>
);

export const fieldClass =
  "w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40";
export const labelClass =
  "text-[10px] font-black uppercase text-foreground/40 ml-1";

export default FinanceFormModal;
