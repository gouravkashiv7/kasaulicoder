"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { RejectConfirm } from "../types";

interface RejectRequestModalProps {
  rejectConfirm: RejectConfirm | null;
  setRejectConfirm: (val: RejectConfirm | null) => void;
  executeReject: (sendEmail: boolean) => void;
}

const MAX_REASON = 1000;

const RejectRequestModal = ({
  rejectConfirm,
  setRejectConfirm,
  executeReject,
}: RejectRequestModalProps) => {
  const reasonValid = (rejectConfirm?.reason.trim().length ?? 0) > 0;

  return (
    <AnimatePresence>
      {rejectConfirm && (
        <div
          key="reject-request-modal-overlay"
          className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reject-request-title"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-background border border-foreground/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8"
          >
            <div className="size-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-rose-500/10 text-rose-500">
              <span className="material-symbols-outlined text-4xl">block</span>
            </div>
            <h3
              id="reject-request-title"
              className="text-xl font-black text-foreground mb-2 text-center"
            >
              Reject request from {rejectConfirm.name}?
            </h3>
            <p className="text-sm text-foreground/50 mb-6 leading-relaxed text-center">
              Add a reason, then choose whether to email it to{" "}
              <span className="break-all font-bold text-foreground/70">
                {rejectConfirm.email}
              </span>{" "}
              or reject without notifying them.
            </p>

            <label
              htmlFor="reject-reason"
              className="block text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-2"
            >
              Rejection reason
            </label>
            <textarea
              id="reject-reason"
              value={rejectConfirm.reason}
              maxLength={MAX_REASON}
              rows={4}
              disabled={rejectConfirm.isSubmitting}
              onChange={(e) =>
                setRejectConfirm({
                  ...rejectConfirm,
                  reason: e.target.value,
                  error: undefined,
                })
              }
              placeholder="e.g. Outside our current service scope"
              className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl p-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/40 resize-none mb-1"
            />
            <p className="text-[10px] text-foreground/30 text-right mb-4">
              {rejectConfirm.reason.length}/{MAX_REASON}
            </p>

            {rejectConfirm.error && (
              <div
                role="alert"
                className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs font-bold"
              >
                {rejectConfirm.error}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                type="button"
                disabled={rejectConfirm.isSubmitting || !reasonValid}
                onClick={() => executeReject(true)}
                className="py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 bg-rose-500 text-white hover:brightness-110 shadow-lg shadow-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {rejectConfirm.isSubmitting && (
                  <div className="size-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                Reject & Email Reason
              </button>
              <button
                type="button"
                disabled={rejectConfirm.isSubmitting || !reasonValid}
                onClick={() => executeReject(false)}
                className="py-3 bg-foreground/5 text-foreground font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-foreground/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject without email
              </button>
              <button
                type="button"
                disabled={rejectConfirm.isSubmitting}
                onClick={() => setRejectConfirm(null)}
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

export default RejectRequestModal;
