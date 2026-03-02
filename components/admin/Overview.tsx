"use client";

import React from "react";
import { motion } from "framer-motion";
import { ContactRequest, SidebarView } from "./types";

interface OverviewProps {
  totalUsers: number;
  totalStaff: number;
  unreadCount: number;
  cohortTotal: number;
  cohortNotNotified: number;
  contactRequests: ContactRequest[];
  setSidebarView: (view: SidebarView) => void;
}

const Overview = ({
  totalUsers,
  totalStaff,
  unreadCount,
  cohortTotal,
  cohortNotNotified,
  contactRequests,
  setSidebarView,
}: OverviewProps) => {
  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black mb-2 text-foreground">
          Dashboard Overview
        </h1>
        <p className="text-foreground/50">
          Welcome back, Superadmin. Here&apos;s your summary.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {/* Total Users */}
        <div className="bg-background/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-6 relative overflow-hidden group hover:border-primary/30 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors"></div>
          <div className="relative">
            <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 border border-primary/20">
              <span className="material-symbols-outlined text-primary text-2xl">
                group
              </span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-1">
              Total Users
            </p>
            <p className="text-4xl font-black text-foreground">{totalUsers}</p>
          </div>
        </div>

        {/* Total Staff */}
        <div className="bg-background/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-6 relative overflow-hidden group hover:border-secondary/30 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-secondary/10 transition-colors"></div>
          <div className="relative">
            <div className="size-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4 border border-secondary/20">
              <span className="material-symbols-outlined text-secondary text-2xl">
                badge
              </span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-1">
              Team Members
            </p>
            <p className="text-4xl font-black text-foreground">{totalStaff}</p>
          </div>
        </div>

        {/* Unread Requests */}
        <div className="bg-background/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-6 relative overflow-hidden group hover:border-rose-500/30 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-rose-500/10 transition-colors"></div>
          <div className="relative">
            <div className="size-12 bg-rose-500/10 rounded-xl flex items-center justify-center mb-4 border border-rose-500/20">
              <span className="material-symbols-outlined text-rose-500 text-2xl">
                notifications_active
              </span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-1">
              Unread Requests
            </p>
            <p className="text-4xl font-black text-foreground">{unreadCount}</p>
          </div>
        </div>

        {/* Cohort Waitlist */}
        <div
          onClick={() => setSidebarView("cohort")}
          className="bg-background/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-colors cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/10 transition-colors"></div>
          <div className="relative">
            <div className="size-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 border border-emerald-500/20">
              <span className="material-symbols-outlined text-emerald-500 text-2xl">
                groups
              </span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-1">
              Cohort Waitlist
            </p>
            <p className="text-4xl font-black text-foreground">{cohortTotal}</p>
            {cohortNotNotified > 0 && (
              <p className="text-xs text-emerald-500 font-bold mt-1">
                {cohortNotNotified} not yet notified
              </p>
            )}
          </div>
        </div>
      </div>

      {unreadCount > 0 && (
        <div className="bg-background/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-foreground">Recent Notifications</h3>
            <button
              onClick={() => setSidebarView("requests")}
              className="text-xs font-bold text-primary hover:underline"
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {contactRequests
              .filter((r) => !r.isRead)
              .slice(0, 5)
              .map((req) => (
                <div
                  key={req._id}
                  className="flex items-center gap-4 p-3 bg-foreground/5 rounded-xl border border-foreground/5"
                >
                  <div className="size-2 bg-rose-500 rounded-full animate-pulse shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">
                      {req.name}{" "}
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          req.userType === "student"
                            ? "bg-primary/20 text-primary"
                            : "bg-secondary/20 text-secondary"
                        }`}
                      >
                        {req.userType}
                      </span>
                    </p>
                    <p className="text-xs text-foreground/50 truncate">
                      {req.query}
                    </p>
                  </div>
                  <p className="text-[10px] text-foreground/30 shrink-0 whitespace-nowrap">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Overview;
