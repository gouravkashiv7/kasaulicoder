"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type SidebarView =
  | "overview"
  | "management"
  | "requests"
  | "pricing"
  | "cohort";

interface Plan {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingType: "one_time" | "recurring";
  billingCycle?: "monthly" | "yearly";
  features: string[];
  targetAudience: "student" | "professional" | "both";
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
}

interface ContactRequest {
  _id: string;
  name: string;
  email: string;
  userType: "student" | "professional";
  query: string;
  isRead: boolean;
  ipAddress: string;
  device: string;
  createdAt: string;
}

interface CohortInterest {
  _id: string;
  email: string;
  emailSent: boolean;
  createdAt: string;
}

const AdminDashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLogout = () => {
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; max-age=0";
    window.location.href = "/login";
  };

  const validAdminTabs: SidebarView[] = [
    "overview",
    "management",
    "requests",
    "pricing",
    "cohort",
  ];
  const tabFromUrl = searchParams.get("tab") as SidebarView | null;

  const [sidebarView, setSidebarViewState] = useState<SidebarView>(
    tabFromUrl && validAdminTabs.includes(tabFromUrl) ? tabFromUrl : "overview",
  );

  const setSidebarView = useCallback(
    (tab: SidebarView) => {
      setSidebarViewState(tab);
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // Sync on browser back/forward
  useEffect(() => {
    if (
      tabFromUrl &&
      validAdminTabs.includes(tabFromUrl) &&
      tabFromUrl !== sidebarView
    ) {
      setSidebarViewState(tabFromUrl);
    }
  }, [tabFromUrl]);
  const [activeTab, setActiveTab] = useState<"users" | "staff">("users");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalStaff, setTotalStaff] = useState(0);
  const [authError, setAuthError] = useState("");

  // Plans state
  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [planForm, setPlanForm] = useState({
    name: "",
    description: "",
    price: 0,
    currency: "INR",
    billingType: "one_time" as "one_time" | "recurring",
    billingCycle: "monthly" as "monthly" | "yearly",
    features: [""],
    targetAudience: "both" as "student" | "professional" | "both",
    isFeatured: false,
    isActive: true,
    sortOrder: 0,
  });
  const [planSubmitting, setPlanSubmitting] = useState(false);
  const [planError, setPlanError] = useState("");

  // Cohort Interest state
  const [cohortInterests, setCohortInterests] = useState<CohortInterest[]>([]);
  const [cohortTotal, setCohortTotal] = useState(0);
  const [cohortNotNotified, setCohortNotNotified] = useState(0);
  const [cohortLoading, setCohortLoading] = useState(false);

  // Add Staff Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    designation: "",
    roleDescription: "",
    image: "",
  });
  const [uploadError, setUploadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Fetch overview data on mount
  useEffect(() => {
    fetchOverviewData();
    fetchContacts();
    fetchPlans();
    fetchCohortInterests();
  }, []);

  useEffect(() => {
    if (sidebarView === "management") {
      fetchData();
    }
  }, [sidebarView, activeTab]);

  const fetchOverviewData = async () => {
    try {
      const [usersRes, staffRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/staff"),
      ]);

      if (usersRes.status === 403 || staffRes.status === 403) {
        setAuthError(
          "Access denied. Only superadmins can access this dashboard.",
        );
        return;
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setTotalUsers(usersData.length);
      }
      if (staffRes.ok) {
        const staffData = await staffRes.json();
        setTotalStaff(
          staffData.filter((s: any) => s.role !== "superadmin").length,
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchContacts = async () => {
    setContactsLoading(true);
    try {
      const res = await fetch("/api/admin/contacts");
      if (res.status === 403) {
        setAuthError(
          "Access denied. Only superadmins can access this dashboard.",
        );
        return;
      }
      if (res.ok) {
        const result = await res.json();
        setContactRequests(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setContactsLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint =
        activeTab === "users" ? "/api/admin/users" : "/api/admin/staff";
      const res = await fetch(endpoint);
      const result = await res.json();
      if (res.ok) {
        setData(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch("/api/admin/contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setContactRequests((prev) =>
          prev.map((r) => (r._id === id ? { ...r, isRead: true } : r)),
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 200 * 1024) {
      setUploadError("Image size must be less than 200KB");
      return;
    }
    setUploadError("");
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewStaff((prev) => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStaff),
      });
      const result = await res.json();
      if (res.ok) {
        setShowAddModal(false);
        setNewStaff({
          name: "",
          email: "",
          password: "",
          role: "admin",
          designation: "",
          roleDescription: "",
          image: "",
        });
        fetchData();
        fetchOverviewData();
      } else {
        setSubmitError(result.error || "Failed to create staff");
      }
    } catch (err) {
      setSubmitError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchPlans = async () => {
    setPlansLoading(true);
    try {
      const res = await fetch("/api/admin/plans");
      if (res.ok) {
        const data = await res.json();
        setPlans(data.plans);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPlansLoading(false);
    }
  };

  const resetPlanForm = () => {
    setPlanForm({
      name: "",
      description: "",
      price: 0,
      currency: "INR",
      billingType: "one_time",
      billingCycle: "monthly",
      features: [""],
      targetAudience: "both",
      isFeatured: false,
      isActive: true,
      sortOrder: 0,
    });
    setEditingPlan(null);
    setPlanError("");
  };

  const openEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      currency: plan.currency,
      billingType: plan.billingType,
      billingCycle: plan.billingCycle || "monthly",
      features: plan.features.length > 0 ? plan.features : [""],
      targetAudience: plan.targetAudience,
      isFeatured: plan.isFeatured,
      isActive: plan.isActive,
      sortOrder: plan.sortOrder,
    });
    setPlanError("");
    setShowPlanModal(true);
  };

  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlanSubmitting(true);
    setPlanError("");
    try {
      const cleanFeatures = planForm.features.filter((f) => f.trim() !== "");
      const payload = {
        ...planForm,
        features: cleanFeatures,
        billingCycle:
          planForm.billingType === "recurring"
            ? planForm.billingCycle
            : undefined,
      };

      let res;
      if (editingPlan) {
        res = await fetch("/api/admin/plans", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingPlan._id, ...payload }),
        });
      } else {
        res = await fetch("/api/admin/plans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const result = await res.json();
      if (res.ok) {
        setShowPlanModal(false);
        resetPlanForm();
        fetchPlans();
      } else {
        setPlanError(result.error || "Failed to save plan");
      }
    } catch {
      setPlanError("An unexpected error occurred.");
    } finally {
      setPlanSubmitting(false);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    try {
      const res = await fetch(`/api/admin/plans?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchPlans();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePlanActive = async (plan: Plan) => {
    try {
      await fetch("/api/admin/plans", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: plan._id, isActive: !plan.isActive }),
      });
      fetchPlans();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCohortInterests = async () => {
    setCohortLoading(true);
    try {
      const res = await fetch("/api/admin/cohort-interest");
      if (res.ok) {
        const data = await res.json();
        setCohortInterests(data.entries);
        setCohortTotal(data.total);
        setCohortNotNotified(data.notNotified);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCohortLoading(false);
    }
  };

  const handleMarkNotified = async (id: string) => {
    try {
      const res = await fetch("/api/admin/cohort-interest", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setCohortInterests((prev) =>
          prev.map((e) => (e._id === id ? { ...e, emailSent: true } : e)),
        );
        setCohortNotNotified((n) => Math.max(0, n - 1));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCohortEntry = async (id: string) => {
    if (!confirm("Remove this email from the waitlist?")) return;
    try {
      const res = await fetch(`/api/admin/cohort-interest?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCohortInterests((prev) => prev.filter((e) => e._id !== id));
        setCohortTotal((n) => n - 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = contactRequests.filter((r) => !r.isRead).length;

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
  ];

  if (authError) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center font-display">
        <div className="text-center max-w-md p-8">
          <div className="size-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-500/20">
            <span className="material-symbols-outlined text-rose-500 text-4xl">
              shield
            </span>
          </div>
          <h1 className="text-2xl font-black mb-3 text-rose-500">
            Access Denied
          </h1>
          <p className="text-foreground/60 mb-6">{authError}</p>
          <a
            href="/"
            className="inline-block bg-foreground/10 text-foreground font-bold px-6 py-3 rounded-xl hover:bg-foreground/20 transition-all"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex font-display">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-full bg-background border-r border-foreground/10 z-40 flex flex-col overflow-hidden"
      >
        {/* Logo area */}
        <div className="p-5 border-b border-foreground/10 flex items-center gap-3 min-h-18">
          <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/30 shrink-0">
            <span className="material-symbols-outlined text-primary text-lg">
              terminal
            </span>
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
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSidebarView(item.id)}
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
                  className={`${sidebarCollapsed ? "absolute top-1 right-1 " : "ml-auto "}bg-rose-500 text-white text-[10px] font-black min-w-5 h-5 rounded-full flex items-center justify-center px-1`}
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
            className="w-full flex items-center justify-center gap-3 px-3 py-3 rounded-xl text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-all"
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

      {/* Main Content */}
      <motion.main
        animate={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-1 min-h-screen"
      >
        <div className="max-w-7xl mx-auto px-8 py-10">
          <AnimatePresence mode="wait">
            {/* ========== OVERVIEW VIEW ========== */}
            {sidebarView === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-10">
                  <h1 className="text-3xl font-black mb-2 text-foreground">
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
                      <p className="text-4xl font-black text-foreground">
                        {totalUsers}
                      </p>
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
                      <p className="text-4xl font-black text-foreground">
                        {totalStaff}
                      </p>
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
                      <p className="text-4xl font-black text-foreground">
                        {unreadCount}
                      </p>
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
                      <p className="text-4xl font-black text-foreground">
                        {cohortTotal}
                      </p>
                      {cohortNotNotified > 0 && (
                        <p className="text-xs text-emerald-500 font-bold mt-1">
                          {cohortNotNotified} not yet notified
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recent unread requests preview */}
                {unreadCount > 0 && (
                  <div className="bg-background/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-black text-foreground">
                        Recent Notifications
                      </h3>
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
            )}

            {/* ========== MANAGEMENT VIEW ========== */}
            {sidebarView === "management" && (
              <motion.div
                key="management"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-10">
                  <h1 className="text-3xl font-black mb-2 text-foreground">
                    User & Staff Management
                  </h1>
                  <p className="text-foreground/50">
                    Monitor users and manage your elite team.
                  </p>
                </div>

                <div className="flex gap-4 mb-8">
                  <button
                    onClick={() => setActiveTab("users")}
                    className={`px-6 py-2 rounded-lg font-bold transition-all ${
                      activeTab === "users"
                        ? "bg-primary text-primary-content"
                        : "bg-foreground/5 text-foreground/60 hover:text-foreground"
                    }`}
                  >
                    Registered Users
                  </button>
                  <button
                    onClick={() => setActiveTab("staff")}
                    className={`px-6 py-2 rounded-lg font-bold transition-all ${
                      activeTab === "staff"
                        ? "bg-secondary text-white"
                        : "bg-foreground/5 text-foreground/60 hover:text-foreground"
                    }`}
                  >
                    Team Members
                  </button>

                  {activeTab === "staff" && (
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="ml-auto px-6 py-2 bg-primary text-primary-content font-bold rounded-lg hover:brightness-110 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">
                        add
                      </span>
                      Add Staff
                    </button>
                  )}
                </div>

                <div className="bg-background/40 backdrop-blur-xl border border-foreground/10 rounded-2xl overflow-hidden shadow-2xl">
                  {loading ? (
                    <div className="p-20 text-center animate-pulse text-primary font-bold">
                      Fetching records from the mainframe...
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-foreground/5 border-b border-foreground/10">
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-foreground/50">
                              Name
                            </th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-foreground/50">
                              Email
                            </th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-foreground/50">
                              Role
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
                          {data.map((item) => (
                            <tr
                              key={item._id}
                              className="hover:bg-foreground/5 transition-colors"
                            >
                              <td className="px-6 py-4 font-bold text-foreground">
                                {item.name}
                              </td>
                              <td className="px-6 py-4 text-foreground/60">
                                {item.email}
                              </td>
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
                              <td className="px-6 py-4 text-foreground/60 text-sm">
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
                                  <span className="text-xs text-foreground/80">
                                    {item.isActive !== false
                                      ? "Active"
                                      : "Inactive"}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {data.length === 0 && (
                            <tr>
                              <td
                                colSpan={5}
                                className="px-6 py-20 text-center text-foreground/50"
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
              </motion.div>
            )}

            {/* ========== REQUESTS VIEW ========== */}
            {sidebarView === "requests" && (
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
                                <span className="bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full animate-pulse">
                                  NEW
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-foreground/60 mb-1">
                              {req.email}
                            </p>
                            <p className="text-foreground/80 leading-relaxed mb-4">
                              {req.query}
                            </p>

                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-foreground/30">
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">
                                  public
                                </span>
                                {req.ipAddress}
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">
                                  devices
                                </span>
                                {req.device.length > 60
                                  ? req.device.substring(0, 60) + "..."
                                  : req.device}
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">
                                  schedule
                                </span>
                                {new Date(req.createdAt).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {!req.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(req._id)}
                              className="shrink-0 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-primary/20 transition-all"
                            >
                              Mark Read
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ========== PRICING VIEW ========== */}
            {sidebarView === "pricing" && (
              <motion.div
                key="pricing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h1 className="text-3xl font-black mb-2 text-foreground">
                      Pricing Plans
                    </h1>
                    <p className="text-foreground/50">
                      Manage one-time and subscription plans visible on your
                      pricing page.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      resetPlanForm();
                      setShowPlanModal(true);
                    }}
                    className="px-6 py-3 bg-primary text-primary-content font-bold rounded-xl hover:brightness-110 flex items-center gap-2 transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">
                      add
                    </span>
                    Add Plan
                  </button>
                </div>

                {plansLoading ? (
                  <div className="p-20 text-center animate-pulse text-primary font-bold">
                    Loading plans...
                  </div>
                ) : plans.length === 0 ? (
                  <div className="bg-background/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-20 text-center">
                    <span className="material-symbols-outlined text-5xl text-foreground/20 mb-4 block">
                      payments
                    </span>
                    <p className="text-foreground/50 font-bold">
                      No plans created yet.
                    </p>
                    <p className="text-foreground/30 text-sm mt-1">
                      Click &quot;Add Plan&quot; to create your first pricing
                      plan.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                      <motion.div
                        key={plan._id}
                        layout
                        className={`bg-background/40 backdrop-blur-xl border rounded-2xl p-6 relative overflow-hidden transition-all ${
                          plan.isActive
                            ? plan.isFeatured
                              ? "border-primary/40 shadow-[0_0_20px_rgba(var(--primary),0.1)]"
                              : "border-foreground/10"
                            : "border-foreground/5 opacity-60"
                        }`}
                      >
                        {/* Status + badges row */}
                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                          <span
                            className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                              plan.billingType === "one_time"
                                ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/20"
                                : "bg-primary/15 text-primary border border-primary/20"
                            }`}
                          >
                            {plan.billingType === "one_time"
                              ? "One-Time"
                              : plan.billingCycle}
                          </span>
                          <span
                            className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                              plan.targetAudience === "student"
                                ? "bg-secondary/15 text-secondary border border-secondary/20"
                                : plan.targetAudience === "professional"
                                  ? "bg-primary/15 text-primary border border-primary/20"
                                  : "bg-foreground/10 text-foreground/50 border border-foreground/10"
                            }`}
                          >
                            {plan.targetAudience}
                          </span>
                          {plan.isFeatured && (
                            <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/20">
                              Featured
                            </span>
                          )}
                          <span
                            className={`ml-auto text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                              plan.isActive
                                ? "bg-emerald-500/15 text-emerald-500"
                                : "bg-rose-500/15 text-rose-500"
                            }`}
                          >
                            {plan.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>

                        {/* Name + Price */}
                        <h3 className="text-xl font-black text-foreground mb-1">
                          {plan.name}
                        </h3>
                        {plan.description && (
                          <p className="text-foreground/40 text-sm mb-3">
                            {plan.description}
                          </p>
                        )}
                        <div className="flex items-baseline gap-1 mb-4">
                          <span className="text-3xl font-black text-foreground">
                            {new Intl.NumberFormat("en-IN", {
                              style: "currency",
                              currency: plan.currency,
                              minimumFractionDigits: 0,
                            }).format(plan.price)}
                          </span>
                          <span className="text-foreground/40 text-sm">
                            {plan.billingType === "one_time"
                              ? "one time"
                              : plan.billingCycle === "yearly"
                                ? "/year"
                                : "/mo"}
                          </span>
                        </div>

                        {/* Features */}
                        <ul className="space-y-2 mb-6">
                          {plan.features.map((f, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-foreground/60"
                            >
                              <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">
                                check
                              </span>
                              {f}
                            </li>
                          ))}
                        </ul>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-4 border-t border-foreground/5">
                          <button
                            onClick={() => openEditPlan(plan)}
                            className="flex-1 px-3 py-2 bg-foreground/5 rounded-lg text-xs font-bold text-foreground/70 hover:bg-foreground/10 transition-all flex items-center justify-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-sm">
                              edit
                            </span>
                            Edit
                          </button>
                          <button
                            onClick={() => handleTogglePlanActive(plan)}
                            className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                              plan.isActive
                                ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                            }`}
                          >
                            <span className="material-symbols-outlined text-sm">
                              {plan.isActive ? "visibility_off" : "visibility"}
                            </span>
                            {plan.isActive ? "Hide" : "Show"}
                          </button>
                          <button
                            onClick={() => handleDeletePlan(plan._id)}
                            className="px-3 py-2 bg-rose-500/10 text-rose-500 rounded-lg text-xs font-bold hover:bg-rose-500/20 transition-all flex items-center justify-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-sm">
                              delete
                            </span>
                          </button>
                        </div>

                        {/* Sort order indicator */}
                        <div className="absolute top-3 right-3 text-[10px] font-bold text-foreground/20">
                          #{plan.sortOrder}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ========== COHORT WAITLIST VIEW ========== */}
            {sidebarView === "cohort" && (
              <motion.div
                key="cohort"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h1 className="text-3xl font-black mb-2 text-foreground">
                      Cohort Waitlist
                    </h1>
                    <p className="text-foreground/50">
                      People interested in joining the next cohort.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-black rounded-xl flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">
                        groups
                      </span>
                      {cohortTotal} Total
                    </div>
                    {cohortNotNotified > 0 && (
                      <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-black rounded-xl flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">
                          notifications_unread
                        </span>
                        {cohortNotNotified} Pending
                      </div>
                    )}
                    <button
                      onClick={fetchCohortInterests}
                      className="p-2.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-all"
                      title="Refresh"
                    >
                      <span className="material-symbols-outlined text-base text-foreground/50">
                        refresh
                      </span>
                    </button>
                  </div>
                </div>

                {cohortLoading ? (
                  <div className="p-20 text-center animate-pulse text-primary font-bold">
                    Loading waitlist...
                  </div>
                ) : cohortInterests.length === 0 ? (
                  <div className="bg-background/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-20 text-center">
                    <span className="material-symbols-outlined text-5xl text-foreground/20 mb-4 block">
                      groups
                    </span>
                    <p className="text-foreground/50 font-bold">
                      No sign-ups yet.
                    </p>
                    <p className="text-foreground/30 text-sm mt-1">
                      When users register interest via the homepage,
                      they&apos;ll appear here.
                    </p>
                  </div>
                ) : (
                  <div className="bg-background/40 backdrop-blur-xl border border-foreground/10 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-foreground/5 border-b border-foreground/10">
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-foreground/50">
                              #
                            </th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-foreground/50">
                              Email
                            </th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-foreground/50">
                              Signed Up
                            </th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-foreground/50">
                              Status
                            </th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-foreground/50">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-foreground/5">
                          {cohortInterests.map((entry, idx) => (
                            <tr
                              key={entry._id}
                              className="hover:bg-foreground/5 transition-colors"
                            >
                              <td className="px-6 py-4 text-foreground/30 text-sm font-bold">
                                {idx + 1}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <div className="size-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-emerald-500 text-sm">
                                      person
                                    </span>
                                  </div>
                                  <span className="font-bold text-foreground text-sm">
                                    {entry.email}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-foreground/50 text-sm">
                                {new Date(entry.createdAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                                    entry.emailSent
                                      ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/20"
                                      : "bg-amber-500/15 text-amber-500 border border-amber-500/20"
                                  }`}
                                >
                                  {entry.emailSent ? "Notified" : "Pending"}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  {!entry.emailSent && (
                                    <button
                                      onClick={() =>
                                        handleMarkNotified(entry._id)
                                      }
                                      className="px-3 py-1.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                                      title="Mark as notified"
                                    >
                                      <span className="material-symbols-outlined text-sm">
                                        mark_email_read
                                      </span>
                                      Mark Notified
                                    </button>
                                  )}
                                  <button
                                    onClick={() =>
                                      handleDeleteCohortEntry(entry._id)
                                    }
                                    className="p-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-lg transition-all"
                                    title="Remove from waitlist"
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
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.main>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background border border-foreground/10 p-8 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-black text-foreground mb-6">
              Add New Staff Member
            </h2>

            {submitError && (
              <div className="bg-rose-500/10 text-rose-500 border border-rose-500/20 p-3 rounded-lg mb-6 text-sm font-bold">
                {submitError}
              </div>
            )}

            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-2">
                    Name
                  </label>
                  <input
                    required
                    value={newStaff.name}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, name: e.target.value })
                    }
                    type="text"
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2 focus:border-primary outline-none text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-2">
                    Email
                  </label>
                  <input
                    required
                    value={newStaff.email}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, email: e.target.value })
                    }
                    type="email"
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2 focus:border-primary outline-none text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-2">
                    Temporary Password
                  </label>
                  <input
                    required
                    value={newStaff.password}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, password: e.target.value })
                    }
                    type="password"
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2 focus:border-primary outline-none text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-2">
                    Role
                  </label>
                  <select
                    value={newStaff.role}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, role: e.target.value })
                    }
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2 focus:border-primary outline-none text-foreground appearance-none"
                  >
                    <option
                      value="admin"
                      className="bg-background text-foreground"
                    >
                      Admin
                    </option>
                    <option
                      value="superadmin"
                      className="bg-background text-foreground"
                    >
                      Superadmin
                    </option>
                    <option
                      value="editor"
                      className="bg-background text-foreground"
                    >
                      Editor
                    </option>
                    <option
                      value="support"
                      className="bg-background text-foreground"
                    >
                      Support
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-2">
                  Designation
                </label>
                <input
                  value={newStaff.designation}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, designation: e.target.value })
                  }
                  type="text"
                  placeholder="e.g. Founder & CEO"
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2 focus:border-primary outline-none text-foreground placeholder:text-foreground/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-2">
                  Role Description
                </label>
                <textarea
                  rows={2}
                  value={newStaff.roleDescription}
                  onChange={(e) =>
                    setNewStaff({
                      ...newStaff,
                      roleDescription: e.target.value,
                    })
                  }
                  placeholder="Short bio..."
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2 focus:border-primary outline-none text-foreground placeholder:text-foreground/30"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-2">
                  Profile Image (Max 200KB)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-sm text-foreground/60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary/20 file:text-primary hover:file:bg-primary/30"
                />
                {uploadError && (
                  <p className="text-rose-500 text-xs mt-2 font-bold">
                    {uploadError}
                  </p>
                )}
                {newStaff.image && (
                  <div className="mt-4 size-20 rounded-full border-2 border-primary overflow-hidden relative">
                    <img
                      src={newStaff.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-foreground/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2 rounded-lg font-bold text-foreground/60 hover:bg-foreground/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !!uploadError}
                  className="px-6 py-2 rounded-lg font-bold bg-primary text-primary-content hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating..." : "Create Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background border border-foreground/10 p-8 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-black text-foreground mb-6">
              {editingPlan ? "Edit Plan" : "Create New Plan"}
            </h2>

            {planError && (
              <div className="bg-rose-500/10 text-rose-500 border border-rose-500/20 p-3 rounded-lg mb-6 text-sm font-bold">
                {planError}
              </div>
            )}

            <form onSubmit={handlePlanSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-2">
                    Plan Name *
                  </label>
                  <input
                    required
                    value={planForm.name}
                    onChange={(e) =>
                      setPlanForm({ ...planForm, name: e.target.value })
                    }
                    type="text"
                    placeholder="e.g. Pro Plan"
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2.5 focus:border-primary outline-none text-foreground placeholder:text-foreground/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-2">
                    Price *
                  </label>
                  <div className="flex gap-2">
                    <input
                      required
                      value={planForm.price}
                      onChange={(e) =>
                        setPlanForm({
                          ...planForm,
                          price: Number(e.target.value),
                        })
                      }
                      type="number"
                      min="0"
                      className="flex-1 bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2.5 focus:border-primary outline-none text-foreground"
                    />
                    <select
                      value={planForm.currency}
                      onChange={(e) =>
                        setPlanForm({ ...planForm, currency: e.target.value })
                      }
                      className="bg-foreground/5 border border-foreground/10 rounded-lg px-3 py-2.5 focus:border-primary outline-none text-foreground appearance-none"
                    >
                      <option value="INR" className="bg-background">
                        INR
                      </option>
                      <option value="USD" className="bg-background">
                        USD
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-2">
                  Description
                </label>
                <input
                  value={planForm.description}
                  onChange={(e) =>
                    setPlanForm({ ...planForm, description: e.target.value })
                  }
                  type="text"
                  placeholder="Short description of the plan"
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2.5 focus:border-primary outline-none text-foreground placeholder:text-foreground/30"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-2">
                    Billing Type *
                  </label>
                  <select
                    value={planForm.billingType}
                    onChange={(e) =>
                      setPlanForm({
                        ...planForm,
                        billingType: e.target.value as "one_time" | "recurring",
                      })
                    }
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2.5 focus:border-primary outline-none text-foreground appearance-none"
                  >
                    <option value="one_time" className="bg-background">
                      One-Time
                    </option>
                    <option value="recurring" className="bg-background">
                      Recurring
                    </option>
                  </select>
                </div>
                {planForm.billingType === "recurring" && (
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-2">
                      Billing Cycle
                    </label>
                    <select
                      value={planForm.billingCycle}
                      onChange={(e) =>
                        setPlanForm({
                          ...planForm,
                          billingCycle: e.target.value as "monthly" | "yearly",
                        })
                      }
                      className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2.5 focus:border-primary outline-none text-foreground appearance-none"
                    >
                      <option value="monthly" className="bg-background">
                        Monthly
                      </option>
                      <option value="yearly" className="bg-background">
                        Yearly
                      </option>
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-2">
                    Target Audience
                  </label>
                  <select
                    value={planForm.targetAudience}
                    onChange={(e) =>
                      setPlanForm({
                        ...planForm,
                        targetAudience: e.target.value as
                          | "student"
                          | "professional"
                          | "both",
                      })
                    }
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2.5 focus:border-primary outline-none text-foreground appearance-none"
                  >
                    <option value="both" className="bg-background">
                      Both
                    </option>
                    <option value="student" className="bg-background">
                      Student
                    </option>
                    <option value="professional" className="bg-background">
                      Professional
                    </option>
                  </select>
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-2">
                  Features
                </label>
                <div className="space-y-2">
                  {planForm.features.map((feature, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        value={feature}
                        onChange={(e) => {
                          const updated = [...planForm.features];
                          updated[idx] = e.target.value;
                          setPlanForm({ ...planForm, features: updated });
                        }}
                        type="text"
                        placeholder={`Feature ${idx + 1}`}
                        className="flex-1 bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2 focus:border-primary outline-none text-foreground placeholder:text-foreground/30 text-sm"
                      />
                      {planForm.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = planForm.features.filter(
                              (_, i) => i !== idx,
                            );
                            setPlanForm({ ...planForm, features: updated });
                          }}
                          className="px-3 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500/20 transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">
                            close
                          </span>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setPlanForm({
                        ...planForm,
                        features: [...planForm.features, ""],
                      })
                    }
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">
                      add
                    </span>
                    Add Feature
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-2">
                    Sort Order
                  </label>
                  <input
                    value={planForm.sortOrder}
                    onChange={(e) =>
                      setPlanForm({
                        ...planForm,
                        sortOrder: Number(e.target.value),
                      })
                    }
                    type="number"
                    min="0"
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2.5 focus:border-primary outline-none text-foreground"
                  />
                </div>
                <div className="flex items-end gap-3 pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={planForm.isFeatured}
                      onChange={(e) =>
                        setPlanForm({
                          ...planForm,
                          isFeatured: e.target.checked,
                        })
                      }
                      className="accent-primary w-4 h-4"
                    />
                    <span className="text-sm font-bold text-foreground/70">
                      Featured
                    </span>
                  </label>
                </div>
                <div className="flex items-end gap-3 pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={planForm.isActive}
                      onChange={(e) =>
                        setPlanForm({ ...planForm, isActive: e.target.checked })
                      }
                      className="accent-emerald-500 w-4 h-4"
                    />
                    <span className="text-sm font-bold text-foreground/70">
                      Active
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-foreground/10">
                <button
                  type="button"
                  onClick={() => {
                    setShowPlanModal(false);
                    resetPlanForm();
                  }}
                  className="px-6 py-2 rounded-lg font-bold text-foreground/60 hover:bg-foreground/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={planSubmitting}
                  className="px-6 py-2 rounded-lg font-bold bg-primary text-primary-content hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {planSubmitting
                    ? "Saving..."
                    : editingPlan
                      ? "Update Plan"
                      : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
