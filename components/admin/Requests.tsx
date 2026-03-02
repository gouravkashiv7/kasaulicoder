"use client";

import React from "react";
import { motion } from "framer-motion";
import { ContactRequest } from "./types";

interface RequestsProps {
  contactRequests: ContactRequest[];
  contactsLoading: boolean;
  unreadCount: number;
  handleMarkAsRead: (id: string) => void;
}

const Requests = ({
  contactRequests,
  contactsLoading,
  unreadCount,
  handleMarkAsRead,
}: RequestsProps) => {
  return (
    <motion.div
      key="requests"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-10">
        <h1 className="text-3xl font-black mb-2 text-foreground">
          Consultation Requests
        </h1>
        <p className="text-foreground/50">
          {unreadCount > 0
            ? `You have ${unreadCount} unread request${unreadCount > 1 ? "s" : ""}.`
            : "All caught up! No new requests."}
        </p>
      </div>

      {contactsLoading ? (
        <div className="p-20 text-center animate-pulse text-primary font-bold">
          Loading requests...
        </div>
      ) : contactRequests.length === 0 ? (
        <div className="bg-background/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-20 text-center">
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
              className={`bg-background/40 backdrop-blur-xl border rounded-2xl p-6 transition-all ${
                req.isRead
                  ? "border-foreground/5 opacity-70"
                  : "border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.05)]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="font-black text-foreground text-lg">
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
                    {!req.isRead && (
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
                      {req.email}
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
                  <div className="bg-foreground/5 rounded-xl p-4 border border-foreground/5">
                    <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                      {req.query}
                    </p>
                  </div>
                </div>

                {!req.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(req._id)}
                    className="shrink-0 size-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all border border-primary/20 group"
                    title="Mark as read"
                  >
                    <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                      done_all
                    </span>
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Requests;
