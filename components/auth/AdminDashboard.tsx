"use client";

import React, { useEffect, useState } from "react";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<"users" | "staff">("users");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint =
        activeTab === "users" ? "/api/admin/users" : "/api/admin/staff";
      const res = await fetch(endpoint);
      const result = await res.json();
      if (res.ok) {
        setData(result);
      } else {
        console.error(result.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col font-display">
      <GlobalHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full pt-32 px-6 pb-20">
        <div className="mb-10">
          <h1 className="text-4xl font-black mb-4">Admin Command Center</h1>
          <p className="text-slate-400">
            Monitor users and manage your elite team
          </p>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              activeTab === "users"
                ? "bg-primary text-background-dark"
                : "bg-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            Registered Users
          </button>
          <button
            onClick={() => setActiveTab("staff")}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              activeTab === "staff"
                ? "bg-secondary text-white"
                : "bg-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            Team Members
          </button>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-20 text-center animate-pulse text-primary font-bold">
              Fetching records from the mainframe...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">
                      Name
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">
                      Email
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">
                      Role
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold">{item.name}</td>
                      <td className="px-6 py-4 text-slate-400">{item.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                            item.role === "superadmin"
                              ? "bg-rose-500/20 text-rose-400"
                              : item.role === "admin"
                                ? "bg-amber-500/20 text-amber-400"
                                : "bg-primary/20 text-primary"
                          }`}
                        >
                          {item.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`size-2 rounded-full ${
                              item.isActive !== false
                                ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                : "bg-rose-500"
                            }`}
                          ></div>
                          <span className="text-xs">
                            {item.isActive !== false ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {data.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-20 text-center text-slate-500"
                      >
                        No records found in this sector.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default AdminDashboard;
