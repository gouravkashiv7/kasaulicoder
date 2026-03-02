"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

type SidebarView = "overview" | "projects" | "learning" | "settings";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  userType: "student" | "professional";
  loginType: string;
  pic?: string;
}

const MAX_PIC_BYTES = 200 * 1024; // 200 KB

const UserDashboard = ({ userType }: { userType: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Derive active tab from URL ?tab=...
  const tabFromUrl = searchParams.get("tab") as SidebarView | null;
  const validTabs: SidebarView[] = [
    "overview",
    "projects",
    "learning",
    "settings",
  ];
  const [sidebarView, setSidebarViewState] = useState<SidebarView>(
    tabFromUrl && validTabs.includes(tabFromUrl) ? tabFromUrl : "overview",
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [user, setUser] = useState<UserData | null>(null);

  // Settings state
  const [settingsForm, setSettingsForm] = useState({ name: "", email: "" });
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState<{
    text: string;
    ok: boolean;
  } | null>(null);

  // Image cropper state
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [croppedPic, setCroppedPic] = useState<string | null>(null);
  const [picError, setPicError] = useState("");
  const cropperRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setSettingsForm({ name: parsed.name || "", email: parsed.email || "" });
      if (parsed.pic) setCroppedPic(parsed.pic);
    }
  }, []);

  // Sync tab to URL
  const setSidebarView = useCallback(
    (tab: SidebarView) => {
      setSidebarViewState(tab);
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // Keep in sync when URL changes externally (browser back/forward)
  useEffect(() => {
    if (
      tabFromUrl &&
      validTabs.includes(tabFromUrl) &&
      tabFromUrl !== sidebarView
    ) {
      setSidebarViewState(tabFromUrl);
    }
  }, [tabFromUrl]);

  const isStudent = userType === "student";

  const handleLogout = () => {
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; max-age=0";
    window.location.href = "/login";
  };

  const sidebarItems = isStudent
    ? [
        { id: "overview" as SidebarView, label: "Overview", icon: "dashboard" },
        {
          id: "projects" as SidebarView,
          label: "My Projects",
          icon: "rocket_launch",
        },
        {
          id: "learning" as SidebarView,
          label: "Learning Path",
          icon: "school",
        },
        { id: "settings" as SidebarView, label: "Settings", icon: "settings" },
      ]
    : [
        { id: "overview" as SidebarView, label: "Overview", icon: "dashboard" },
        { id: "projects" as SidebarView, label: "Services", icon: "build" },
        {
          id: "learning" as SidebarView,
          label: "Consultations",
          icon: "support_agent",
        },
        { id: "settings" as SidebarView, label: "Settings", icon: "settings" },
      ];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // ── Image handling ────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPicError("");
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_PIC_BYTES) {
      setPicError(
        `File too large. Maximum size is 200 KB (your file: ${(file.size / 1024).toFixed(0)} KB).`,
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setRawImageSrc(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
    // Reset the input so same file can be re-selected
    e.target.value = "";
  };

  const handleCropDone = () => {
    const cropper = (cropperRef.current as any)?.cropper;
    if (!cropper) return;
    const canvas = cropper.getCroppedCanvas({ width: 256, height: 256 });
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);

    // Validate final cropped size
    const approxBytes = Math.ceil(
      (dataUrl.length - (dataUrl.indexOf(",") + 1)) * 0.75,
    );
    if (approxBytes > MAX_PIC_BYTES) {
      setPicError(
        "Cropped image still exceeds 200 KB. Please use a smaller source image.",
      );
      setShowCropper(false);
      return;
    }

    setCroppedPic(dataUrl);
    setShowCropper(false);
    setRawImageSrc(null);
  };

  // ── Settings save ────────────────────────────────────────────────
  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsMsg(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: settingsForm.name,
          email: settingsForm.email,
          pic: croppedPic || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // Update localStorage with new data
        const updated = { ...user, ...data.user };
        localStorage.setItem("user", JSON.stringify(updated));
        setUser(updated as UserData);
        setSettingsMsg({ text: "Profile updated successfully!", ok: true });
      } else {
        setSettingsMsg({ text: data.error || "Failed to save.", ok: false });
      }
    } catch {
      setSettingsMsg({ text: "Network error. Please try again.", ok: false });
    } finally {
      setSettingsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex font-display">
      {/* ── Sidebar ── */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-full bg-background border-r border-foreground/10 z-40 flex flex-col overflow-hidden"
      >
        {/* Logo */}
        <div className="p-5 border-b border-foreground/10 flex items-center gap-3 min-h-18">
          <Link href="/">
            <div
              className={`size-8 rounded-lg flex items-center justify-center border shrink-0 ${isStudent ? "bg-secondary/10 border-secondary/30" : "bg-primary/10 border-primary/30"}`}
            >
              <span
                className={`material-symbols-outlined text-lg ${isStudent ? "text-secondary" : "text-primary"}`}
              >
                terminal
              </span>
            </div>
          </Link>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-lg font-black tracking-tighter text-foreground whitespace-nowrap overflow-hidden"
              >
                Kasauli
                <span className={isStudent ? "text-secondary" : "text-primary"}>
                  Coder
                </span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSidebarView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all relative group ${
                sidebarView === item.id
                  ? isStudent
                    ? "bg-secondary/10 text-secondary"
                    : "bg-primary/10 text-primary"
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
              {sidebarView === item.id && (
                <motion.div
                  layoutId="user-sidebar-active"
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full ${isStudent ? "bg-secondary" : "bg-primary"}`}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Bottom: Logout + Collapse */}
        <div className="p-3 border-t border-foreground/10 space-y-1">
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
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center px-3 py-3 rounded-xl text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-all"
          >
            <span
              className="material-symbols-outlined text-xl transition-transform duration-300"
              style={{
                transform: sidebarCollapsed ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              chevron_left
            </span>
          </button>
        </div>
      </motion.aside>

      {/* ── Main ── */}
      <motion.main
        animate={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-1 min-h-screen"
      >
        <div className="max-w-7xl mx-auto px-8 py-10">
          <AnimatePresence mode="wait">
            {/* ══════════════ OVERVIEW ══════════════ */}
            {sidebarView === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-10">
                  <h1 className="text-3xl font-black mb-2">
                    {greeting()},{" "}
                    <span
                      className={isStudent ? "text-secondary" : "text-primary"}
                    >
                      {user?.name || "User"}
                    </span>
                  </h1>
                  <p className="text-foreground/50">
                    {isStudent
                      ? "Here's your learning progress and project activity."
                      : "Here's your service overview and consultation activity."}
                  </p>
                </div>

                <div className="mb-8">
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${isStudent ? "bg-secondary/10 text-secondary border-secondary/20" : "bg-primary/10 text-primary border-primary/20"}`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {isStudent ? "school" : "work"}
                    </span>
                    {isStudent ? "Student Account" : "Professional Account"}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  {(isStudent
                    ? [
                        {
                          label: "Active Projects",
                          value: "0",
                          icon: "rocket_launch",
                          color: "secondary",
                        },
                        {
                          label: "Learning Hours",
                          value: "0",
                          icon: "schedule",
                          color: "primary",
                        },
                        {
                          label: "Cohort Rank",
                          value: "—",
                          icon: "leaderboard",
                          color: "amber-500",
                        },
                      ]
                    : [
                        {
                          label: "Active Services",
                          value: "0",
                          icon: "build",
                          color: "primary",
                        },
                        {
                          label: "Consultations",
                          value: "0",
                          icon: "support_agent",
                          color: "secondary",
                        },
                        {
                          label: "Total Invested",
                          value: "₹0",
                          icon: "payments",
                          color: "emerald-500",
                        },
                      ]
                  ).map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="bg-background/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-6 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-foreground/3 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                      <div className="relative">
                        <div className="size-12 bg-foreground/5 rounded-xl flex items-center justify-center mb-4 border border-foreground/10">
                          <span
                            className={`material-symbols-outlined text-${stat.color} text-2xl`}
                          >
                            {stat.icon}
                          </span>
                        </div>
                        <p className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-1">
                          {stat.label}
                        </p>
                        <p className="text-4xl font-black text-foreground">
                          {stat.value}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-background/40 backdrop-blur-xl border border-foreground/10 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-foreground/10 flex items-center gap-3">
                      <span
                        className={`material-symbols-outlined ${isStudent ? "text-secondary" : "text-primary"}`}
                      >
                        {isStudent ? "trophy" : "trending_up"}
                      </span>
                      <h3 className="font-black text-foreground">
                        {isStudent ? "Your Learning Path" : "Service Requests"}
                      </h3>
                    </div>
                    <div className="p-6">
                      {isStudent ? (
                        <div className="space-y-6">
                          {[
                            ["AI Fundamentals", "bg-secondary"],
                            ["Production Systems", "bg-secondary/60"],
                            ["System Architecture", "bg-secondary/40"],
                          ].map(([label, cls]) => (
                            <div key={label}>
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-foreground/70 font-bold">
                                  {label}
                                </span>
                                <span className="text-secondary font-black">
                                  0%
                                </span>
                              </div>
                              <div className="h-2 bg-foreground/5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${cls} rounded-full w-0`}
                                ></div>
                              </div>
                            </div>
                          ))}
                          <p className="text-xs text-foreground/30 text-center pt-2 font-bold uppercase tracking-widest">
                            Your curriculum will appear once the cohort begins
                          </p>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <span className="material-symbols-outlined text-5xl text-foreground/15 mb-4 block">
                            inbox
                          </span>
                          <p className="text-foreground/40 font-bold mb-2">
                            No active service requests
                          </p>
                          <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm font-bold hover:bg-primary/20 transition-all"
                          >
                            <span className="material-symbols-outlined text-sm">
                              add
                            </span>
                            Request a Service
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-background/40 backdrop-blur-xl border border-foreground/10 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-foreground/10 flex items-center gap-3">
                      <span
                        className={`material-symbols-outlined ${isStudent ? "text-secondary" : "text-primary"}`}
                      >
                        {isStudent ? "today" : "calendar_month"}
                      </span>
                      <h3 className="font-black text-foreground">
                        {isStudent
                          ? "Upcoming Sessions"
                          : "Consultation Schedule"}
                      </h3>
                    </div>
                    <div className="p-6 text-center py-14">
                      <span className="material-symbols-outlined text-5xl text-foreground/15 mb-4 block">
                        event_upcoming
                      </span>
                      <p className="text-foreground/40 font-bold mb-2">
                        {isStudent
                          ? "No upcoming sessions"
                          : "No consultations scheduled"}
                      </p>
                      <p className="text-xs text-foreground/30">
                        {isStudent
                          ? "Sessions will be scheduled once your cohort begins."
                          : "Book a consultation with our team to get started."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-10">
                  <h3 className="font-black text-foreground mb-4">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {(isStudent
                      ? [
                          {
                            title: "View Curriculum",
                            icon: "menu_book",
                            desc: "Course structure",
                          },
                          {
                            title: "Community",
                            icon: "forum",
                            desc: "Join discussions",
                          },
                          {
                            title: "Resources",
                            icon: "download",
                            desc: "Learning materials",
                          },
                          {
                            title: "Support",
                            icon: "help_center",
                            desc: "Get help",
                          },
                        ]
                      : [
                          {
                            title: "Our Services",
                            icon: "design_services",
                            desc: "Explore offerings",
                            href: "/pricing",
                          },
                          {
                            title: "Book Consultation",
                            icon: "calendar_month",
                            desc: "Schedule a call",
                            href: "/contact",
                          },
                          {
                            title: "Documentation",
                            icon: "description",
                            desc: "Technical docs",
                            href: "#",
                          },
                          {
                            title: "Support",
                            icon: "help_center",
                            desc: "Submit a ticket",
                            href: "/contact",
                          },
                        ]
                    ).map((action, i) => (
                      <motion.div
                        key={action.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className="relative group/qa"
                      >
                        {isStudent ? (
                          <div className="flex items-center gap-3 p-4 bg-background/40 border border-foreground/10 rounded-xl cursor-not-allowed opacity-55 select-none">
                            <div className="size-10 rounded-lg bg-foreground/5 flex items-center justify-center text-foreground/40">
                              <span className="material-symbols-outlined">
                                {action.icon}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-foreground/50">
                                {action.title}
                              </p>
                              <p className="text-[10px] text-foreground/30 uppercase tracking-widest">
                                {action.desc}
                              </p>
                            </div>
                            <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 translate-y-1 opacity-0 group-hover/qa:opacity-100 group-hover/qa:translate-y-0 transition-all duration-200 z-20">
                              <div className="bg-foreground text-background text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
                                Coming Soon
                              </div>
                              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-foreground" />
                            </div>
                          </div>
                        ) : (
                          <Link
                            href={(action as any).href}
                            className="flex items-center gap-3 p-4 bg-background/40 border border-foreground/10 rounded-xl transition-all group hover:border-primary/30"
                          >
                            <div className="size-10 rounded-lg bg-foreground/5 flex items-center justify-center group-hover:text-primary transition-colors">
                              <span className="material-symbols-outlined">
                                {action.icon}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-foreground">
                                {action.title}
                              </p>
                              <p className="text-[10px] text-foreground/40 uppercase tracking-widest">
                                {action.desc}
                              </p>
                            </div>
                          </Link>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══════════════ PROJECTS ══════════════ */}
            {sidebarView === "projects" && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-10">
                  <h1 className="text-3xl font-black mb-2">
                    {isStudent ? "My Projects" : "My Services"}
                  </h1>
                  <p className="text-foreground/50">
                    {isStudent
                      ? "Track your active projects and submissions."
                      : "View your active services, invoices, and project history."}
                  </p>
                </div>
                <div className="bg-background/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-16 text-center">
                  <div
                    className={`size-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isStudent ? "bg-secondary/10 border border-secondary/20" : "bg-primary/10 border border-primary/20"}`}
                  >
                    <span
                      className={`material-symbols-outlined text-4xl ${isStudent ? "text-secondary" : "text-primary"}`}
                    >
                      {isStudent ? "rocket_launch" : "build"}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-foreground mb-3">
                    {isStudent ? "No Projects Yet" : "No Active Services"}
                  </h2>
                  <p className="text-foreground/40 max-w-md mx-auto mb-8">
                    {isStudent
                      ? "Projects will be assigned once your cohort begins."
                      : "You haven't requested any services yet. Explore our offerings."}
                  </p>
                  <Link
                    href={isStudent ? "/careers" : "/pricing"}
                    className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all ${isStudent ? "bg-secondary text-white hover:shadow-[0_0_25px_rgba(168,85,247,0.4)]" : "bg-primary text-primary-content hover:shadow-[0_0_25px_rgba(0,242,255,0.4)]"}`}
                  >
                    {isStudent ? "View Learning Path" : "Explore Services"}
                    <span className="material-symbols-outlined text-sm">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </motion.div>
            )}

            {/* ══════════════ LEARNING ══════════════ */}
            {sidebarView === "learning" && (
              <motion.div
                key="learning"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-10">
                  <h1 className="text-3xl font-black mb-2">
                    {isStudent ? "Learning Path" : "Consultations"}
                  </h1>
                  <p className="text-foreground/50">
                    {isStudent
                      ? "Your curriculum, milestones, and mentor sessions."
                      : "Your consultation history and upcoming sessions."}
                  </p>
                </div>
                {isStudent ? (
                  <div className="space-y-6">
                    <div className="bg-background/40 backdrop-blur-xl border border-secondary/20 rounded-2xl p-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                      <div className="relative">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-black uppercase tracking-widest mb-4">
                          <span className="size-2 rounded-full bg-amber-400 animate-pulse"></span>
                          Upcoming
                        </div>
                        <h2 className="text-2xl font-black text-foreground mb-2">
                          Cohort 4.0
                        </h2>
                        <p className="text-foreground/50 mb-6 max-w-lg">
                          The next cohort is coming soon. You'll be notified
                          when enrollment opens and your curriculum is ready.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            { label: "Duration", value: "12 Weeks" },
                            { label: "Projects", value: "3-5" },
                            { label: "Mentors", value: "Assigned" },
                            { label: "Status", value: "Pending" },
                          ].map((item) => (
                            <div
                              key={item.label}
                              className="bg-background/60 p-4 rounded-xl border border-foreground/5"
                            >
                              <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 mb-1">
                                {item.label}
                              </p>
                              <p className="text-lg font-black text-foreground">
                                {item.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="bg-background/40 backdrop-blur-xl border border-foreground/10 rounded-2xl overflow-hidden">
                      <div className="p-6 border-b border-foreground/10">
                        <h3 className="font-black text-foreground flex items-center gap-2">
                          <span className="material-symbols-outlined text-secondary">
                            flag
                          </span>
                          Milestones
                        </h3>
                      </div>
                      <div className="p-6 space-y-4">
                        {[
                          {
                            title: "Account Created",
                            status: "done",
                            icon: "check_circle",
                          },
                          {
                            title: "Profile Setup",
                            status: "current",
                            icon: "radio_button_checked",
                          },
                          {
                            title: "Cohort Onboarding",
                            status: "locked",
                            icon: "lock",
                          },
                          {
                            title: "First Project Assignment",
                            status: "locked",
                            icon: "lock",
                          },
                          {
                            title: "Mid-Cohort Review",
                            status: "locked",
                            icon: "lock",
                          },
                          {
                            title: "Final Presentation",
                            status: "locked",
                            icon: "lock",
                          },
                        ].map((m) => (
                          <div
                            key={m.title}
                            className="flex items-center gap-4"
                          >
                            <span
                              className={`material-symbols-outlined text-xl ${m.status === "done" ? "text-emerald-400" : m.status === "current" ? "text-secondary animate-pulse" : "text-foreground/15"}`}
                            >
                              {m.icon}
                            </span>
                            <span
                              className={`text-sm font-bold ${m.status === "done" ? "text-foreground/60 line-through" : m.status === "current" ? "text-foreground" : "text-foreground/25"}`}
                            >
                              {m.title}
                            </span>
                            {m.status === "current" && (
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-secondary/20 text-secondary tracking-widest">
                                In Progress
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-background/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-16 text-center">
                    <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20">
                      <span className="material-symbols-outlined text-primary text-4xl">
                        support_agent
                      </span>
                    </div>
                    <h2 className="text-xl font-black text-foreground mb-3">
                      No Consultations Yet
                    </h2>
                    <p className="text-foreground/40 max-w-md mx-auto mb-8">
                      Schedule a consultation to discuss your project
                      requirements with our senior engineers.
                    </p>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-content rounded-xl font-bold text-sm hover:shadow-[0_0_25px_rgba(0,242,255,0.4)] transition-all"
                    >
                      Book a Consultation
                      <span className="material-symbols-outlined text-sm">
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

            {/* ══════════════ SETTINGS ══════════════ */}
            {sidebarView === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-10">
                  <h1 className="text-3xl font-black mb-2">Account Settings</h1>
                  <p className="text-foreground/50">
                    Manage your profile, photo, and preferences.
                  </p>
                </div>

                <form
                  onSubmit={handleSettingsSave}
                  className="space-y-6 max-w-2xl"
                >
                  {/* Profile Photo */}
                  <div className="bg-background/40 backdrop-blur-xl border border-foreground/10 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-foreground/10">
                      <h3 className="font-black text-foreground flex items-center gap-2">
                        <span
                          className={`material-symbols-outlined ${isStudent ? "text-secondary" : "text-primary"}`}
                        >
                          photo_camera
                        </span>
                        Profile Photo
                      </h3>
                      <p className="text-xs text-foreground/40 mt-1">
                        Max 200 KB. Will be cropped to a square.
                      </p>
                    </div>
                    <div className="p-6 flex items-center gap-6">
                      <div className="relative shrink-0">
                        <div
                          className={`size-24 rounded-2xl overflow-hidden border-2 ${isStudent ? "border-secondary/30" : "border-primary/30"} bg-foreground/5`}
                        >
                          {croppedPic ? (
                            <img
                              src={croppedPic}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div
                              className={`w-full h-full flex items-center justify-center text-4xl font-black ${isStudent ? "text-secondary" : "text-primary"}`}
                            >
                              {user?.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                          )}
                        </div>
                        {croppedPic && (
                          <button
                            type="button"
                            onClick={() => {
                              setCroppedPic(null);
                              setPicError("");
                            }}
                            className="absolute -top-2 -right-2 size-6 bg-rose-500 text-white rounded-full flex items-center justify-center hover:bg-rose-600 transition-all shadow-lg"
                          >
                            <span className="material-symbols-outlined text-sm">
                              close
                            </span>
                          </button>
                        )}
                      </div>
                      <div className="flex flex-col gap-3">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm border transition-all ${isStudent ? "border-secondary/30 text-secondary hover:bg-secondary/10" : "border-primary/30 text-primary hover:bg-primary/10"}`}
                        >
                          <span className="material-symbols-outlined text-sm">
                            upload
                          </span>
                          Upload Photo
                        </button>
                        {picError && (
                          <p className="text-xs text-rose-500 font-bold">
                            {picError}
                          </p>
                        )}
                        <p className="text-[11px] text-foreground/30">
                          JPG, PNG, WebP · Max 200 KB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="bg-background/40 backdrop-blur-xl border border-foreground/10 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-foreground/10">
                      <h3 className="font-black text-foreground flex items-center gap-2">
                        <span
                          className={`material-symbols-outlined ${isStudent ? "text-secondary" : "text-primary"}`}
                        >
                          person
                        </span>
                        Profile Information
                      </h3>
                    </div>
                    <div className="p-6 space-y-5">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-2">
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={settingsForm.name}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              name: e.target.value,
                            })
                          }
                          className={`w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 outline-none text-foreground placeholder:text-foreground/25 transition-all focus:border-${isStudent ? "secondary" : "primary"}/40 focus:ring-2 focus:ring-${isStudent ? "secondary" : "primary"}/10`}
                          placeholder="Your display name"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={settingsForm.email}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              email: e.target.value,
                            })
                          }
                          className={`w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 outline-none text-foreground placeholder:text-foreground/25 transition-all focus:border-${isStudent ? "secondary" : "primary"}/40 focus:ring-2 focus:ring-${isStudent ? "secondary" : "primary"}/10`}
                          placeholder="your@email.com"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 mb-2">
                            Account Type
                          </p>
                          <p
                            className={`font-black capitalize ${isStudent ? "text-secondary" : "text-primary"}`}
                          >
                            {userType}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 mb-2">
                            Member Since
                          </p>
                          <p className="font-bold text-foreground">
                            {new Date().toLocaleDateString("en-US", {
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Message */}
                  <AnimatePresence>
                    {settingsMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`p-4 rounded-xl border text-sm font-bold text-center ${settingsMsg.ok ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"}`}
                      >
                        {settingsMsg.text}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={settingsSaving}
                      className={`flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-wait ${isStudent ? "bg-secondary text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]" : "bg-primary text-primary-content hover:shadow-[0_0_20px_rgba(0,242,255,0.4)]"}`}
                    >
                      {settingsSaving ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                          Saving...
                        </span>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>

                  {/* Danger Zone */}
                  <div className="bg-background/40 backdrop-blur-xl border border-rose-500/10 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-rose-500/10">
                      <h3 className="font-black text-rose-500 flex items-center gap-2">
                        <span className="material-symbols-outlined">
                          warning
                        </span>
                        Danger Zone
                      </h3>
                    </div>
                    <div className="p-6 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-foreground">Log Out</p>
                        <p className="text-xs text-foreground/40">
                          End your current session
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="px-6 py-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl text-sm font-bold hover:bg-rose-500/20 transition-all"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.main>

      {/* ══════════════ CROPPER MODAL ══════════════ */}
      <AnimatePresence>
        {showCropper && rawImageSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background border border-foreground/10 rounded-2xl overflow-hidden w-full max-w-lg shadow-2xl"
            >
              <div className="p-6 border-b border-foreground/10 flex items-center justify-between">
                <h2 className="font-black text-foreground text-lg">
                  Crop Your Photo
                </h2>
                <button
                  onClick={() => {
                    setShowCropper(false);
                    setRawImageSrc(null);
                  }}
                  className="p-2 rounded-lg hover:bg-foreground/5 text-foreground/50 hover:text-foreground transition-all"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="p-4 bg-black/20">
                <Cropper
                  ref={cropperRef}
                  src={rawImageSrc}
                  style={{ height: 360, width: "100%" }}
                  aspectRatio={1}
                  guides={true}
                  viewMode={1}
                  dragMode="move"
                  autoCropArea={0.9}
                  background={false}
                  responsive
                  checkOrientation={false}
                />
              </div>
              <p className="text-[11px] text-foreground/30 text-center py-2 font-bold uppercase tracking-widest">
                Drag to reposition · Scroll to zoom
              </p>
              <div className="p-4 border-t border-foreground/10 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCropper(false);
                    setRawImageSrc(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm text-foreground/60 hover:bg-foreground/5 border border-foreground/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCropDone}
                  className={`flex-1 py-2.5 rounded-xl font-black text-sm transition-all ${isStudent ? "bg-secondary text-white hover:brightness-110" : "bg-primary text-primary-content hover:brightness-110"}`}
                >
                  Use This Crop
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDashboard;
