"use client";

import { motion } from "framer-motion";
import type { DirectoryRecord } from "./types";

interface ManagementProps {
  activeTab: "users" | "staff";
  setActiveTab: (tab: "users" | "staff") => void;
  userSearch: string;
  setUserSearch: (s: string) => void;
  userTypeFilter: "all" | "student" | "professional";
  setUserTypeFilter: (f: "all" | "student" | "professional") => void;
  userDateFilter: "all" | "7" | "30" | "90";
  setUserDateFilter: (f: "all" | "7" | "30" | "90") => void;
  userSortField: "userType" | "createdAt" | "name";
  setUserSortField: (f: "userType" | "createdAt" | "name") => void;
  userSortDir: "asc" | "desc";
  setUserSortDir: (d: "asc" | "desc") => void;
  data: DirectoryRecord[];
  loading: boolean;
  onAddStaff: () => void;
  handleToggleUserStatus: (item: DirectoryRecord) => void;
  handleToggleStaffStatus: (item: DirectoryRecord) => void;
  openEditStaff: (item: DirectoryRecord) => void;
  onMailAdmins: () => void;
  onSendReset: (item: DirectoryRecord) => void;
  resetSendingId: string | null;
  notice: string;
  onDismissNotice: () => void;
}

const Management = ({
  activeTab,
  setActiveTab,
  userSearch,
  setUserSearch,
  userTypeFilter,
  setUserTypeFilter,
  userDateFilter,
  setUserDateFilter,
  userSortField,
  setUserSortField,
  userSortDir,
  setUserSortDir,
  data,
  loading,
  onAddStaff,
  handleToggleUserStatus,
  handleToggleStaffStatus,
  openEditStaff,
  onMailAdmins,
  onSendReset,
  resetSendingId,
  notice,
  onDismissNotice,
}: ManagementProps) => {
  // logic to compute displayed rows
  let rows =
    activeTab === "staff"
      ? data.filter((item) => item.role !== "superadmin")
      : [...data];

  if (activeTab === "users") {
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase();
      rows = rows.filter((u) => u.name?.toLowerCase().includes(q));
    }
    if (userTypeFilter !== "all") {
      rows = rows.filter((u) => u.userType === userTypeFilter);
    }
    if (userDateFilter !== "all") {
      const days = parseInt(userDateFilter, 10);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      rows = rows.filter((u) => new Date(u.createdAt) >= cutoff);
    }
    rows.sort((a, b) => {
      let va: string | number, vb: string | number;
      if (userSortField === "createdAt") {
        va = new Date(a.createdAt).getTime();
        vb = new Date(b.createdAt).getTime();
      } else if (userSortField === "userType") {
        va = a.userType ?? "";
        vb = b.userType ?? "";
      } else {
        va = a.name?.toLowerCase() ?? "";
        vb = b.name?.toLowerCase() ?? "";
      }
      if (va < vb) return userSortDir === "asc" ? -1 : 1;
      if (va > vb) return userSortDir === "asc" ? 1 : -1;
      return 0;
    });
  }

  // Team members are shown in one block per role, in this order
  const ROLE_GROUPS = [
    { role: "admin", label: "Admins" },
    { role: "editor", label: "Editors" },
    { role: "support", label: "Support" },
  ];
  const groups =
    activeTab === "staff"
      ? [
          ...ROLE_GROUPS.map((g) => ({
            ...g,
            items: rows
              .filter((r) => r.role === g.role)
              .sort((a, b) => a.name.localeCompare(b.name)),
          })),
          {
            role: "other",
            label: "Other",
            items: rows.filter(
              (r) => !ROLE_GROUPS.some((g) => g.role === r.role),
            ),
          },
        ].filter((g) => g.items.length > 0)
      : [{ role: "users", label: "", items: rows }];

  const isEmpty = rows.length === 0;
  const colCount = 5;

  return (
    <motion.div
      key="management"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black mb-2 text-foreground">
          Members & Team Management
        </h1>
        <p className="text-foreground/50">
          Monitor registered members and manage your team.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 md:gap-4 mb-8">
        <button
          type="button"
          onClick={() => setActiveTab("staff")}
          className={`px-4 md:px-6 py-2 rounded-lg font-bold text-sm md:text-base transition-all ${
            activeTab === "staff"
              ? "bg-secondary text-white"
              : "bg-foreground/5 text-foreground/60 hover:text-foreground"
          }`}
        >
          Team Members
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`px-4 md:px-6 py-2 rounded-lg font-bold text-sm md:text-base transition-all ${
            activeTab === "users"
              ? "bg-primary text-primary-content"
              : "bg-foreground/5 text-foreground/60 hover:text-foreground"
          }`}
        >
          Registered Members
        </button>
        {activeTab === "staff" && (
          <div className="ml-auto flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onMailAdmins}
              className="px-4 md:px-6 py-2 bg-foreground/5 text-foreground/80 font-bold rounded-lg hover:bg-foreground/10 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">mail</span>
              Email All Admins
            </button>
            <button
              type="button"
              onClick={onAddStaff}
              className="px-4 md:px-6 py-2 bg-primary text-primary-content font-bold rounded-lg hover:brightness-110 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add Team Member
            </button>
          </div>
        )}
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

      {activeTab === "users" && (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="relative w-full lg:w-auto">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 text-lg pointer-events-none">
              search
            </span>
            <input
              type="text"
              placeholder="Search by name…"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full lg:w-72 pl-10 pr-4 py-2 rounded-xl bg-foreground/5 border border-foreground/10 text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-primary/40 transition-colors"
            />
          </div>

          <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
            <div className="flex gap-1 bg-foreground/5 rounded-xl p-1 shrink-0">
              {(["all", "student", "professional"] as const).map((v) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setUserTypeFilter(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    userTypeFilter === v
                      ? v === "student"
                        ? "bg-primary text-primary-content shadow"
                        : v === "professional"
                          ? "bg-secondary text-white shadow"
                          : "bg-foreground/20 text-foreground shadow"
                      : "text-foreground/50 hover:text-foreground"
                  }`}
                >
                  {v === "all"
                    ? "All types"
                    : v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex gap-1 bg-foreground/5 rounded-xl p-1 shrink-0">
              {(["all", "7", "30", "90"] as const).map((v) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setUserDateFilter(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    userDateFilter === v
                      ? "bg-primary text-primary-content shadow"
                      : "text-foreground/50 hover:text-foreground"
                  }`}
                >
                  {v === "all" ? "All time" : `Last ${v}d`}
                </button>
              ))}
            </div>

            <div className="flex gap-1 bg-foreground/5 rounded-xl p-1 shrink-0">
              {[
                { field: "createdAt" as const, label: "Joined" },
                { field: "userType" as const, label: "Type" },
                { field: "name" as const, label: "Name" },
              ].map(({ field, label }) => (
                <button
                  type="button"
                  key={field}
                  onClick={() => {
                    if (userSortField === field) {
                      setUserSortDir(userSortDir === "asc" ? "desc" : "asc");
                    } else {
                      setUserSortField(field);
                      setUserSortDir(field === "createdAt" ? "desc" : "asc");
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-all ${
                    userSortField === field
                      ? "bg-foreground/15 text-foreground"
                      : "text-foreground/50 hover:text-foreground"
                  }`}
                >
                  {label}
                  {userSortField === field && (
                    <span className="material-symbols-outlined text-[14px]">
                      {userSortDir === "asc"
                        ? "arrow_upward"
                        : "arrow_downward"}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-background/40 backdrop-blur-xl border border-foreground/10 rounded-2xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-20 text-center animate-pulse text-primary font-bold">
            Loading records…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left border-collapse">
              <thead>
                <tr className="bg-foreground/5 border-b border-foreground/10">
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-foreground/50">
                    Name
                  </th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-foreground/50">
                    Email
                  </th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-foreground/50">
                    {activeTab === "users" ? "User Type" : "Role"}
                  </th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-foreground/50">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-foreground/50">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/10">
                {groups.flatMap((group) => [
                  ...(activeTab === "staff"
                    ? [
                        <tr
                          key={`group-${group.role}`}
                          className="bg-foreground/3"
                        >
                          <th
                            colSpan={colCount}
                            scope="colgroup"
                            className="px-6 py-2 text-left text-[11px] font-black uppercase tracking-widest text-foreground/60"
                          >
                            {group.label}{" "}
                            <span className="text-foreground/30">
                              · {group.items.length}
                            </span>
                          </th>
                        </tr>,
                      ]
                    : []),
                  ...group.items.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-foreground/5 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-foreground">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-foreground/60 text-sm">
                        {item.email}
                      </td>
                      {activeTab === "users" ? (
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                              item.userType === "professional"
                                ? "bg-secondary/20 text-secondary"
                                : "bg-primary/20 text-primary"
                            }`}
                          >
                            {item.userType ?? "—"}
                          </span>
                        </td>
                      ) : (
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                              item.role === "superadmin"
                                ? "bg-rose-500/20 text-rose-400"
                                : item.role === "admin"
                                  ? "bg-amber-500/20 text-amber-400"
                                  : item.role === "editor"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : item.role === "support"
                                      ? "bg-emerald-500/20 text-emerald-400"
                                      : "bg-primary/20 text-primary"
                            }`}
                          >
                            {item.role}
                          </span>
                          {item.isDirector && (
                            <span className="ml-2 px-2 py-1 rounded text-[10px] font-black uppercase bg-primary/15 text-primary">
                              Director
                            </span>
                          )}
                        </td>
                      )}
                      <td className="px-6 py-4 text-foreground/60 text-sm">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {activeTab === "users" ? (
                            <button
                              type="button"
                              onClick={() => handleToggleUserStatus(item)}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                item.isActive !== false
                                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20"
                                  : "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20"
                              }`}
                            >
                              <span className="material-symbols-outlined text-base">
                                {item.isActive !== false
                                  ? "toggle_on"
                                  : "toggle_off"}
                              </span>
                              {item.isActive !== false ? "Active" : "Inactive"}
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleToggleStaffStatus(item)}
                                className={`flex items-center justify-center size-8 rounded-lg transition-all ${
                                  item.isActive !== false
                                    ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                                    : "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                                }`}
                                title={
                                  item.isActive !== false
                                    ? "Deactivate team member"
                                    : "Activate team member"
                                }
                              >
                                <span className="material-symbols-outlined text-base">
                                  {item.isActive !== false
                                    ? "toggle_on"
                                    : "toggle_off"}
                                </span>
                              </button>
                              <button
                                type="button"
                                onClick={() => openEditStaff(item)}
                                className="px-3 py-1.5 bg-foreground/5 hover:bg-foreground/10 text-foreground/70 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                              >
                                <span className="material-symbols-outlined text-sm">
                                  edit
                                </span>
                                Edit
                              </button>
                              {item.isActive !== false && (
                                <button
                                  type="button"
                                  onClick={() => onSendReset(item)}
                                  disabled={resetSendingId !== null}
                                  title={`Email ${item.name} a password reset link`}
                                  className="px-3 py-1.5 bg-foreground/5 hover:bg-foreground/10 text-foreground/70 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <span className="material-symbols-outlined text-sm">
                                    {resetSendingId === item._id
                                      ? "hourglass_top"
                                      : "lock_reset"}
                                  </span>
                                  {resetSendingId === item._id
                                    ? "Sending…"
                                    : "Send Reset"}
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )),
                ])}
                {isEmpty && (
                  <tr>
                    <td
                      colSpan={colCount}
                      className="px-6 py-20 text-center text-foreground/50"
                    >
                      {userSearch ||
                      userDateFilter !== "all" ||
                      userTypeFilter !== "all"
                        ? "No members match your filters."
                        : "No records found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Management;
