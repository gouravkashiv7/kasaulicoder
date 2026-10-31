"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { MailAdminsForm } from "../types";

interface MailAdminsModalProps {
  mailForm: MailAdminsForm | null;
  setMailForm: (val: MailAdminsForm | null) => void;
  executeSend: () => void;
}

const MAX_SUBJECT = 150;
const MAX_MESSAGE = 5000;

const MailAdminsModal = ({
  mailForm,
  setMailForm,
  executeSend,
}: MailAdminsModalProps) => {
  const valid =
    (mailForm?.subject.trim().length ?? 0) > 0 &&
    (mailForm?.message.trim().length ?? 0) > 0 &&
    (mailForm?.recipientCount ?? 0) > 0;

  return (
    <AnimatePresence>
      {mailForm && (
        <div
          key="mail-admins-modal-overlay"
          className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="mail-admins-title"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-background border border-foreground/10 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="size-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-4xl">mail</span>
            </div>
            <h3
              id="mail-admins-title"
              className="text-xl font-black text-foreground mb-2 text-center"
            >
              Email all admins
            </h3>
            <p className="text-sm text-foreground/50 mb-6 leading-relaxed text-center">
              {mailForm.recipientCount === null
                ? "Checking who will receive this…"
                : mailForm.recipientCount === 0
                  ? "There are no active admins to email."
                  : `This goes to ${mailForm.recipientCount} active admin${mailForm.recipientCount === 1 ? "" : "s"}. They cannot see each other's addresses, and replies come back to you.`}
            </p>

            <label
              htmlFor="mail-admins-subject"
              className="block text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-2"
            >
              Subject
            </label>
            <input
              id="mail-admins-subject"
              type="text"
              value={mailForm.subject}
              maxLength={MAX_SUBJECT}
              disabled={mailForm.isSubmitting}
              onChange={(e) =>
                setMailForm({
                  ...mailForm,
                  subject: e.target.value,
                  error: undefined,
                })
              }
              className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl p-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/40 mb-4"
            />

            <label
              htmlFor="mail-admins-message"
              className="block text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-2"
            >
              Message
            </label>
            <textarea
              id="mail-admins-message"
              value={mailForm.message}
              maxLength={MAX_MESSAGE}
              rows={7}
              disabled={mailForm.isSubmitting}
              onChange={(e) =>
                setMailForm({
                  ...mailForm,
                  message: e.target.value,
                  error: undefined,
                })
              }
              className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl p-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/40 resize-none mb-1"
            />
            <p className="text-[10px] text-foreground/30 text-right mb-4">
              {mailForm.message.length}/{MAX_MESSAGE}
            </p>

            {mailForm.error && (
              <div
                role="alert"
                className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs font-bold"
              >
                {mailForm.error}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                type="button"
                disabled={mailForm.isSubmitting || !valid}
                onClick={executeSend}
                className="py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 bg-primary text-primary-content hover:brightness-110 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mailForm.isSubmitting && (
                  <div className="size-3 border-2 border-primary-content/30 border-t-primary-content rounded-full animate-spin" />
                )}
                Send Email
              </button>
              <button
                type="button"
                disabled={mailForm.isSubmitting}
                onClick={() => setMailForm(null)}
                className="mt-2 text-foreground/30 hover:text-foreground font-bold text-[10px] uppercase tracking-widest transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MailAdminsModal;
