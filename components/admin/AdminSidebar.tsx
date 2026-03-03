"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import Image from "next/image";
import { SidebarView } from "./types";

interface SidebarProps {
  sidebarView: SidebarView;
  setSidebarView: (view: SidebarView) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  unreadCount: number;
  cohortNotNotified: number;
  handleLogout: () => void;
}

const Sidebar = ({
  sidebarView,
  setSidebarView,
  sidebarCollapsed,
  setSidebarCollapsed,
  mobileMenuOpen,
  setMobileMenuOpen,
  unreadCount,
  cohortNotNotified,
  handleLogout,
}: SidebarProps) => {
  const sidebarItems = [
    {
      id: "overview" as SidebarView,
      label: "Overview",
      icon: "dashboard",
    },
    {
      id: "management" as SidebarView,
      label: "Management",
      icon: "group",
    },
    {
      id: "requests" as SidebarView,
      label: "Requests",
      icon: "mail",
      badge: unreadCount,
    },
    {
      id: "pricing" as SidebarView,
      label: "Pricing",
      icon: "payments",
    },
    {
      id: "cohort" as SidebarView,
      label: "Cohort Waitlist",
      icon: "groups",
      badge: cohortNotNotified,
    },
    {
      id: "programs" as SidebarView,
      label: "Programs",
      icon: "terminal",
    },
    {
      id: "blogs" as SidebarView,
      label: "Blogs",
      icon: "article",
    },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{
        width: sidebarCollapsed ? 72 : 260,
        x: 0,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed left-0 top-0 h-full bg-background border-r border-foreground/10 z-40 flex flex-col overflow-hidden
        ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        } transition-transform duration-300 md:transition-none`}
      style={{ width: sidebarCollapsed ? 72 : 260 }}
    >
      {/* Logo area */}
      <div className="p-5 border-b border-foreground/10 flex items-center gap-3 min-h-18">
        <Link href="/" className="flex items-center gap-3">
          <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/30 shrink-0 overflow-hidden relative">
            <Image
              src="/logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="object-contain theme-logo"
            />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-lg font-black tracking-tighter text-foreground whitespace-nowrap overflow-hidden"
              >
                Admin<span className="text-primary">Panel</span>
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        {/* Close button — mobile only */}
        <button
          className="ml-auto md:hidden text-foreground/50 hover:text-foreground"
          onClick={() => setMobileMenuOpen(false)}
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setSidebarView(item.id);
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all relative group ${
              sidebarView === item.id
                ? "bg-primary/10 text-primary"
                : "text-foreground/50 hover:text-foreground hover:bg-foreground/5"
            }`}
          >
            <span className="material-symbols-outlined text-xl shrink-0">
              {item.icon}
            </span>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-sm font-bold whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            {item.badge && item.badge > 0 && (
              <span
                className={`${
                  sidebarCollapsed ? "absolute top-1 right-1" : "ml-auto"
                } bg-rose-500 text-white text-[10px] font-black min-w-5 h-5 rounded-full flex items-center justify-center px-1`}
              >
                {item.badge}
              </span>
            )}
            {sidebarView === item.id && (
              <motion.div
                layoutId="sidebar-active"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </nav>

      {/* Logout + Collapse */}
      <div className="p-3 border-t border-foreground/10 space-y-1">
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-center pb-2 overflow-hidden"
            >
              <ThemeSwitcher />
            </motion.div>
          )}
        </AnimatePresence>

        <Link
          href="/"
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-all group"
        >
          <span className="material-symbols-outlined text-xl shrink-0">
            home
          </span>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-sm font-bold whitespace-nowrap overflow-hidden"
              >
                Return to Site
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-rose-500/70 hover:text-rose-500 hover:bg-rose-500/5 transition-all"
        >
          <span className="material-symbols-outlined text-xl shrink-0">
            logout
          </span>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-sm font-bold whitespace-nowrap overflow-hidden"
              >
                Log Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        {/* Collapse toggle — desktop only */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden md:flex w-full items-center justify-center gap-3 px-3 py-3 rounded-xl text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-all"
        >
          <span
            className="material-symbols-outlined text-xl transition-transform duration-300"
            style={{
              transform: sidebarCollapsed ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            chevron_left
          </span>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-sm font-bold whitespace-nowrap overflow-hidden"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
