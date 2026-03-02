"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const UserSettings = () => {
  return (
    <div className="bg-background-light dark:bg-[#0f2223] text-slate-900 dark:text-slate-100 min-h-screen font-display">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar Navigation */}
        <motion.aside
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-64 shrink-0 border-r border-slate-200 dark:border-white/10 flex flex-col glass-panel md:flex"
        >
          <div className="p-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-background-dark shadow-[0_0_15px_rgba(0,242,255,0.5)] group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined font-bold text-black">
                  terminal
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Command
              </h2>
            </Link>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link
              href="/projects"
              className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined">rocket_launch</span>
              <span className="font-medium">Projects</span>
            </Link>
            <Link
              href="/insights"
              className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined">analytics</span>
              <span className="font-medium">Analytics</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined">group</span>
              <span className="font-medium">Team</span>
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined">settings</span>
              <span className="font-medium">Settings</span>
            </Link>
          </nav>{" "}
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-primary animate-pulse"></div>
            <p className="text-sm text-slate-300">All nodes operational</p>
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-background-light dark:bg-[#0b1617]">
          {/* Top Nav Bar Component */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-0 z-10 glass-panel border-b border-white/5 px-8 py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-full max-w-md">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                  search
                </span>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 transition-all text-white placeholder:text-slate-500"
                  placeholder="Search system resources..."
                  type="text"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-primary relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-[#0b1617]"></span>
              </button>
              <button className="p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-primary">
                <span className="material-symbols-outlined">settings</span>
              </button>
              <div className="h-8 w-px bg-white/10 mx-2"></div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-white leading-none">
                    Alex Neon
                  </p>
                  <p className="text-xs text-primary leading-none mt-1">
                    Pro Tier Member
                  </p>
                </div>
                <div className="size-10 rounded-full bg-primary/20 border-2 border-primary overflow-hidden relative">
                  <Image
                    alt="User avatar"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAonxKRIaPbdUAfmV_NkmNqlw6a4ob_BxsS5srhGJExYC7rourDfkrxCAGQLH1Ox6pdvascurO4F6jeC2DZ3qO6BLqX24Z5qDyk8nQtmEF6CjBRL1PxxUiH9J6hWM2RWRFYQsScEgPWz4-koQt0IWdGx8hTzBubtKM4CJGnZeZpl5nrnamm3j6U9NI9Vxz7-L8Bbl6_r3tkzKPzdkCy5xmKla5CJ_XhIVGYxst2QOAvXa9J_59f4VHd2aGW7lXfRRMJU7PyXRAjBs0"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </motion.header>

          <div className="p-8 max-w-6xl mx-auto space-y-8">
            {/* User Profile Header */}
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start justify-between">
              <div className="flex flex-col md:flex-row gap-6 items-center text-center md:text-left">
                <div className="relative group">
                  <div className="size-32 rounded-2xl overflow-hidden border-2 border-primary/50 neon-glow relative">
                    <Image
                      alt="Large user avatar"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuzjaKuWy4yxrdaSsPsdhz0k89vrfcMnGfNCN7QP42Xr95JztX0lDlqPo1V7F8dnqd_9Mm6_XmMh0Ofl3cqJxTAD68_BxjQr-LwcNZZOp6GIr5ouDyxJkaDEoPCyK2ojSmjCmzSZb9pIJbo4-eIzuX067QUrRSr1xR_ewwaxJtQ2VAwUi4nHuKODzOXoA9YLEiobpZIVN-9QBcD_VvmvGHRIvJLIexR3XV87XYVw568uoP5gcv9PoRqIfDTQffCI57YLPciCV1mgQ"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button className="absolute -bottom-2 -right-2 size-10 bg-primary rounded-full flex items-center justify-center text-[#0b1617] shadow-lg border-4 border-[#0b1617] hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-sm">
                      photo_camera
                    </span>
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                      Alex Neon
                    </h1>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary border border-primary/30 uppercase tracking-tighter">
                      Verified
                    </span>
                  </div>
                  <p className="text-slate-400 font-medium">
                    Full Stack Developer & Systems Architect
                  </p>
                  <div className="flex flex-wrap gap-4 pt-2 justify-center md:justify-start">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span className="material-symbols-outlined text-sm">
                        location_on
                      </span>
                      San Francisco, CA
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span className="material-symbols-outlined text-sm">
                        link
                      </span>
                      neon-ops.io
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span className="material-symbols-outlined text-sm">
                        calendar_today
                      </span>
                      Joined Oct 2023
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-2.5 rounded-lg border border-white/10 bg-white/5 font-bold text-sm hover:bg-white/10 transition-colors">
                  Edit Profile
                </button>
                <button className="px-6 py-2.5 rounded-lg bg-primary text-[#0b1617] font-bold text-sm neon-glow hover:brightness-110 transition-all">
                  Upgrade Plan
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  label: "Projects Completed",
                  value: "24",
                  change: "+12%",
                  icon: "rocket_launch",
                  color: "primary",
                },
                {
                  label: "Hours Logged",
                  value: "1,240",
                  change: "+5%",
                  icon: "schedule",
                  color: "blue-400",
                },
                {
                  label: "Credits Remaining",
                  value: "450",
                  change: "-2%",
                  icon: "token",
                  color: "purple-500",
                  down: true,
                },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`glass-panel rounded-xl p-6 border-l-4 border-l-${stat.color}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <span
                      className={`material-symbols-outlined text-${stat.color}`}
                    >
                      {stat.icon}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-4xl font-bold text-white">
                      {stat.value}
                    </h3>
                    <span
                      className={`text-${stat.down ? "rose-500" : stat.color} text-sm font-bold flex items-center`}
                    >
                      {stat.change}{" "}
                      <span className="material-symbols-outlined text-xs">
                        {stat.down ? "trending_down" : "trending_up"}
                      </span>
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Plan & Enrolled Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="glass-panel rounded-xl overflow-hidden flex flex-col"
              >
                <div className="p-6 border-b border-white/5">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      workspace_premium
                    </span>
                    Current Enrolled Plan
                  </h2>
                </div>
                <div className="p-8 flex-1 bg-linear-to-tr from-primary/5 to-transparent">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-2xl font-bold text-white mb-1 tracking-tight">
                        Pro Tier Membership
                      </h4>
                      <p className="text-slate-400">
                        Next renewal: Nov 15, 2024
                      </p>
                    </div>
                    <span className="bg-primary text-[#0b1617] px-3 py-1 rounded font-bold text-xs uppercase shadow-[0_0_15px_rgba(0,242,255,0.4)]">
                      Active
                    </span>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-300">
                          Compute Resources Usage
                        </span>
                        <span className="text-white font-bold">85%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary neon-glow w-[85%] rounded-full"></div>
                      </div>
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <li className="flex items-center gap-2 text-sm text-slate-300">
                        <span className="material-symbols-outlined text-primary text-sm">
                          check_circle
                        </span>
                        Unlimited API Access
                      </li>
                      <li className="flex items-center gap-2 text-sm text-slate-300">
                        <span className="material-symbols-outlined text-primary text-sm">
                          check_circle
                        </span>
                        High Priority Compute
                      </li>
                      <li className="flex items-center gap-2 text-sm text-slate-300">
                        <span className="material-symbols-outlined text-primary text-sm">
                          check_circle
                        </span>
                        24/7 Premium Support
                      </li>
                      <li className="flex items-center gap-2 text-sm text-slate-300">
                        <span className="material-symbols-outlined text-primary text-sm">
                          check_circle
                        </span>
                        Custom Domain Config
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="p-4 bg-white/5 border-t border-white/5 text-center">
                  <a
                    className="text-primary text-sm font-bold hover:underline"
                    href="#"
                  >
                    Manage Subscription & Invoices
                  </a>
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass-panel rounded-xl flex flex-col"
              >
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      history
                    </span>
                    Recent Activity
                  </h2>
                  <button className="text-xs font-bold text-slate-400 hover:text-primary transition-colors">
                    View All
                  </button>
                </div>
                <div className="p-0 flex-1 overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-slate-500 uppercase text-[10px] tracking-widest border-b border-white/5">
                        <th className="px-6 py-4 font-bold">Action</th>
                        <th className="px-6 py-4 font-bold">Date</th>
                        <th className="px-6 py-4 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        {
                          action: 'Deployed "Project X-Alpha"',
                          date: "Oct 24, 14:22",
                          status: "Success",
                          type: "success",
                        },
                        {
                          action: "Billing cycle updated",
                          date: "Oct 22, 09:10",
                          status: "Auto",
                          type: "info",
                        },
                        {
                          action: "Profile bio modified",
                          date: "Oct 21, 18:45",
                          status: "Info",
                          type: "default",
                        },
                        {
                          action: "System security audit",
                          date: "Oct 19, 11:30",
                          status: "Secure",
                          type: "success",
                        },
                        {
                          action: "SSH Keys renewed",
                          date: "Oct 15, 23:12",
                          status: "Success",
                          type: "warning",
                        },
                      ].map((activity, i) => (
                        <tr
                          key={i}
                          className="hover:bg-white/5 transition-colors group"
                        >
                          <td className="px-6 py-4 text-white font-medium">
                            {activity.action}
                          </td>
                          <td className="px-6 py-4 text-slate-400">
                            {activity.date}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                activity.type === "success"
                                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                  : activity.type === "info"
                                    ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                    : activity.type === "warning"
                                      ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                      : "bg-white/10 text-slate-400"
                              }`}
                            >
                              {activity.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>

            {/* Footer Quick Links */}
            <div className="pt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  title: "API Docs",
                  icon: "description",
                  desc: "Endpoints reference",
                },
                {
                  title: "Dev Community",
                  icon: "forum",
                  desc: "Support & Forums",
                },
                {
                  title: "Resources",
                  icon: "download",
                  desc: "Assets & Plugins",
                },
                {
                  title: "Help Desk",
                  icon: "help_center",
                  desc: "Submit a ticket",
                },
              ].map((link, i) => (
                <motion.button
                  key={link.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 p-4 glass-panel rounded-xl hover:border-primary transition-all group"
                >
                  <div className="size-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:text-primary">
                    <span className="material-symbols-outlined">
                      {link.icon}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-white">{link.title}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-tighter">
                      {link.desc}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserSettings;
