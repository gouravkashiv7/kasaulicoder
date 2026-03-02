"use client";

import React from "react";
import { motion } from "framer-motion";
import { CohortInterest } from "./types";

interface CohortProps {
  cohortInterests: CohortInterest[];
  cohortTotal: number;
  cohortNotNotified: number;
  cohortLoading: boolean;
  handleMarkNotified: (id: string) => void;
  handleDeleteCohortEntry: (id: string) => void;
}

const Cohort = ({
  cohortInterests,
  cohortTotal,
  cohortNotNotified,
  cohortLoading,
  handleMarkNotified,
  handleDeleteCohortEntry,
}: CohortProps) => {
  return (
    <motion.div
      key="cohort"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-10">
        <h1 className="text-3xl font-black mb-2 text-foreground">
          Cohort Waitlist
        </h1>
        <p className="text-foreground/50">
          Emails collected from the &quot;Notify Me&quot; launch section.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-500/60 mb-1">
            Total Signups
          </p>
          <p className="text-4xl font-black text-emerald-500">{cohortTotal}</p>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-500/60 mb-1">
            To be Notified
          </p>
          <p className="text-4xl font-black text-orange-500">
            {cohortNotNotified}
          </p>
        </div>
      </div>

      {cohortLoading ? (
        <div className="p-20 text-center animate-pulse text-emerald-500 font-bold">
          Accessing waitlist records...
        </div>
      ) : cohortInterests.length === 0 ? (
        <div className="bg-background/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-20 text-center">
          <span className="material-symbols-outlined text-5xl text-foreground/20 mb-4 block">
            group_add
          </span>
          <p className="text-foreground/50 font-bold">
            No interests recorded yet.
          </p>
        </div>
      ) : (
        <div className="bg-background/40 backdrop-blur-xl border border-foreground/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-foreground/5 border-b border-foreground/10">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-foreground/50">
                  Email Address
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-foreground/50">
                  Joined At
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-foreground/50 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/10">
              {cohortInterests.map((entry) => (
                <tr
                  key={entry._id}
                  className="hover:bg-foreground/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-foreground font-bold">
                        {entry.email}
                      </span>
                      {entry.emailSent ? (
                        <span className="bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-500/10">
                          Notified
                        </span>
                      ) : (
                        <span className="bg-orange-500/10 text-orange-500 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-orange-500/10">
                          Pending
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground/40 text-sm">
                    {new Date(entry.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!entry.emailSent && (
                        <button
                          onClick={() => handleMarkNotified(entry._id)}
                          className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
                        >
                          Mark Sent
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteCohortEntry(entry._id)}
                        className="size-8 flex items-center justify-center bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500/20 transition-all"
                        title="Delete entry"
                      >
                        <span className="material-symbols-outlined text-sm">
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default Cohort;
