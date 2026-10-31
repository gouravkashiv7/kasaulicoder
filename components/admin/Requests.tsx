"use client";

import { motion } from "framer-motion";
import type { ContactRequest } from "./types";

interface RequestsProps {
  contactRequests: ContactRequest[];
  contactsLoading: boolean;
  unreadCount: number;
  handleMarkAsRead: (id: string) => void;
  handleReject: (req: ContactRequest) => void;
  notice?: string;
  onDismissNotice?: () => void;
}

const Requests = ({
  contactRequests,
  contactsLoading,
  unreadCount,
  handleMarkAsRead,
  handleReject,
  notice,
  onDismissNotice,
}: RequestsProps) => {
  return (
    <motion.div
      key="requests"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black mb-2 text-foreground">
          Consultation Requests
        </h1>
        <p className="text-foreground/50">
          {unreadCount > 0
            ? `You have ${unreadCount} unread request${unreadCount > 1 ? "s" : ""}.`
            : "All caught up! No new requests."}
        </p>
      </div>

      {notice && (
        <div
          role="alert"
          className="mb-4 flex items-start justify-between gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-600 text-xs font-bold"
        >
          <span>{notice}</span>
          <button
            type="button"
            onClick={onDismissNotice}
            aria-label="Dismiss"
            className="shrink-0 hover:opacity-70"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {contactsLoading ? (
        <div className="p-20 text-center animate-pulse text-primary font-bold">
          Loading requests...
        </div>
      ) : contactRequests.length === 0 ? (
        <div className="bg-background/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-10 md:p-20 text-center">
          <span className="material-symbols-outlined text-5xl text-foreground/20 mb-4 block">
            inbox
          </span>
          <p className="text-foreground/50 font-bold">
            No consultation requests yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {contactRequests.map((req) => (
            <motion.div
              key={req._id}
              layout
              className={`bg-background/40 backdrop-blur-xl border rounded-2xl p-4 md:p-6 transition-all ${
                req.status === "rejected"
                  ? "border-rose-500/20 opacity-70"
                  : req.isRead
                    ? "border-foreground/5 opacity-70"
                    : "border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.05)]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="font-black text-foreground text-lg break-words">
                      {req.name}
                    </h3>
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                        req.userType === "student"
                          ? "bg-primary/20 text-primary"
                          : "bg-secondary/20 text-secondary"
                      }`}
                    >
                      {req.userType}
                    </span>
                    {req.status === "rejected" && (
                      <span className="bg-rose-500/15 text-rose-500 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                        Rejected
                      </span>
                    )}
                    {!req.isRead && req.status !== "rejected" && (
                      <span className="bg-rose-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full animate-pulse">
                        New
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-foreground/40 mb-4 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">
                        mail
                      </span>
                      <span className="break-all">{req.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">
                        calendar_today
                      </span>
                      {new Date(req.createdAt).toLocaleString()}
                    </div>
                    {req.device && (
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">
                          {req.device.toLowerCase().includes("mobile")
                            ? "smartphone"
                            : "desktop_windows"}
                        </span>
                        {req.device}
                      </div>
                    )}
                  </div>
                  {(req.company ||
                    req.service ||
                    req.budget ||
                    req.timeline) && (
                    <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-xs mb-4">
                      {[
                        ["Company", req.company],
                        ["Service", req.service],
                        ["Budget", req.budget],
                        ["Timeline", req.timeline],
                      ]
                        .filter(([, value]) => value)
                        .map(([label, value]) => (
                          <div key={label} className="flex gap-2">
                            <dt className="text-foreground/40 font-bold">
                              {label}:
                            </dt>
                            <dd className="text-foreground/80 break-words">
                              {value}
                            </dd>
                          </div>
                        ))}
                    </dl>
                  )}
                  <div className="bg-foreground/5 rounded-xl p-4 border border-foreground/5">
                    <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                      {req.query}
                    </p>
                  </div>
                  {req.status === "rejected" && req.rejectionReason && (
                    <div className="mt-3 bg-rose-500/5 rounded-xl p-4 border border-rose-500/20">
                      <p className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-1">
                        Rejection reason
                        {req.rejectionEmailSent
                          ? " · emailed to requester"
                          : " · not emailed"}
                      </p>
                      <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap break-words">
                        {req.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>

                <div className="shrink-0 flex flex-col gap-2">
                  {!req.isRead && req.status !== "rejected" && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(req._id)}
                      className="size-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all border border-primary/20 group"
                      title="Mark as read"
                      aria-label={`Mark request from ${req.name} as read`}
                    >
                      <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                        done_all
                      </span>
                    </button>
                  )}
                  {req.status !== "rejected" && (
                    <button
                      type="button"
                      onClick={() => handleReject(req)}
                      className="size-10 flex items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all border border-rose-500/20 group"
                      title="Reject request"
                      aria-label={`Reject request from ${req.name}`}
                    >
                      <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                        block
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Requests;
