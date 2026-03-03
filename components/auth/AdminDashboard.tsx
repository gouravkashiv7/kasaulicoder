"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Types
import {
  SidebarView,
  Program,
  Plan,
  ContactRequest,
  CohortInterest,
} from "@/components/admin/types";

// Components
import AdminSidebar from "@/components/admin/AdminSidebar";
import Overview from "@/components/admin/Overview";
import Management from "@/components/admin/Management";
import Requests from "@/components/admin/Requests";
import Pricing from "@/components/admin/Pricing";
import Cohort from "@/components/admin/Cohort";
import Programs from "@/components/admin/Programs";

// Modals
import StaffModal from "@/components/admin/modals/StaffModal";
import PlanModal from "@/components/admin/modals/PlanModal";
import ProgramModal from "@/components/admin/modals/ProgramModal";
import StatusToggleModal from "@/components/admin/modals/StatusToggleModal";

const AdminDashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Navigation Logic
  const validAdminTabs: SidebarView[] = [
    "overview",
    "management",
    "requests",
    "pricing",
    "cohort",
    "programs",
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

  useEffect(() => {
    if (
      tabFromUrl &&
      validAdminTabs.includes(tabFromUrl) &&
      tabFromUrl !== sidebarView
    ) {
      setSidebarViewState(tabFromUrl);
    }
  }, [tabFromUrl, sidebarView, validAdminTabs]);

  // Main State
  const [activeTab, setActiveTab] = useState<"users" | "staff">("users");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalStaff, setTotalStaff] = useState(0);
  const [authError, setAuthError] = useState("");

  // Users Management State
  const [userSearch, setUserSearch] = useState("");
  const [userDateFilter, setUserDateFilter] = useState<
    "all" | "7" | "30" | "90"
  >("all");
  const [userTypeFilter, setUserTypeFilter] = useState<
    "all" | "student" | "professional"
  >("all");
  const [userSortField, setUserSortField] = useState<
    "userType" | "createdAt" | "name"
  >("createdAt");
  const [userSortDir, setUserSortDir] = useState<"asc" | "desc">("desc");

  // Plans State
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

  // Cohort Interest
  const [cohortInterests, setCohortInterests] = useState<CohortInterest[]>([]);
  const [cohortTotal, setCohortTotal] = useState(0);
  const [cohortNotNotified, setCohortNotNotified] = useState(0);
  const [cohortLoading, setCohortLoading] = useState(false);

  // Programs State
  const [programs, setPrograms] = useState<Program[]>([]);
  const [programsLoading, setProgramsLoading] = useState(false);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [programForm, setProgramForm] = useState({
    name: "",
    tagline: "",
    description: "",
    image: "",
    features: [""],
    isActive: true,
    isVisible: true,
    sortOrder: 0,
  });
  const [programSubmitting, setProgramSubmitting] = useState(false);
  const [programError, setProgramError] = useState("");
  const [programViewMode, setProgramViewMode] = useState<"grid" | "list">(
    "grid",
  );

  // Staff Management Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
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

  // UI State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Status Toggle Confirmation
  const [toggleConfirm, setToggleConfirm] = useState<{
    id: string;
    type: "users" | "staff";
    currentStatus: boolean;
    name: string;
    isSubmitting: boolean;
  } | null>(null);

  // Responsive Check
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // API Callbacks
  const fetchOverviewData = useCallback(async () => {
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
  }, []);

  const fetchContacts = useCallback(async () => {
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
  }, []);

  const fetchData = useCallback(async () => {
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
  }, [activeTab]);

  const fetchPlans = useCallback(async () => {
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
  }, []);

  const fetchCohortInterests = useCallback(async () => {
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
  }, []);

  const fetchPrograms = useCallback(async () => {
    setProgramsLoading(true);
    try {
      const res = await fetch("/api/admin/programs");
      if (res.ok) {
        const data = await res.json();
        setPrograms(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProgramsLoading(false);
    }
  }, []);

  // Lifecycle
  useEffect(() => {
    fetchOverviewData();
    fetchContacts();
    fetchPlans();
    fetchCohortInterests();
    fetchPrograms();
  }, [
    fetchOverviewData,
    fetchContacts,
    fetchPlans,
    fetchCohortInterests,
    fetchPrograms,
  ]);

  useEffect(() => {
    if (sidebarView === "management") {
      fetchData();
    }
  }, [sidebarView, activeTab, fetchData]);

  // Handlers
  const handleLogout = () => {
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; max-age=0";
    window.location.href = "/login";
  };

  const handleToggleUserStatus = (item: any) => {
    setToggleConfirm({
      id: item._id,
      type: "users",
      currentStatus: item.isActive !== false,
      name: item.name,
      isSubmitting: false,
    });
  };

  const handleToggleStaffStatus = (item: any) => {
    setToggleConfirm({
      id: item._id,
      type: "staff",
      currentStatus: item.isActive !== false,
      name: item.name,
      isSubmitting: false,
    });
  };

  const executeStatusToggle = async (sendEmail: boolean) => {
    if (!toggleConfirm) return;
    setToggleConfirm((prev) => (prev ? { ...prev, isSubmitting: true } : null));

    try {
      const endpoint =
        toggleConfirm.type === "users"
          ? "/api/admin/users"
          : "/api/admin/staff";
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: toggleConfirm.id, sendEmail }),
      });

      const result = await res.json();
      if (res.ok) {
        setData((prev) =>
          prev.map((item) =>
            item._id === toggleConfirm.id
              ? { ...item, isActive: result.isActive }
              : item,
          ),
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setToggleConfirm(null);
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

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    try {
      let res;
      if (editingStaff) {
        res = await fetch("/api/admin/staff", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingStaff._id, ...newStaff }),
        });
      } else {
        res = await fetch("/api/admin/staff", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newStaff),
        });
      }

      if (res.ok) {
        setShowAddModal(false);
        setEditingStaff(null);
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
        const result = await res.json();
        setSubmitError(result.error || "Operation failed");
      }
    } catch (err) {
      setSubmitError("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditStaff = (staff: any) => {
    setEditingStaff(staff);
    setNewStaff({
      name: staff.name,
      email: staff.email,
      password: "",
      role: staff.role,
      designation: staff.designation || "",
      roleDescription: staff.roleDescription || "",
      image: staff.image || "",
    });
    setShowAddModal(true);
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

      if (res.ok) {
        setShowPlanModal(false);
        setEditingPlan(null);
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
        fetchPlans();
      } else {
        const result = await res.json();
        setPlanError(result.error || "Failed to save plan");
      }
    } catch {
      setPlanError("An unexpected error occurred.");
    } finally {
      setPlanSubmitting(false);
    }
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
    setShowPlanModal(true);
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

  const handleProgramSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProgramSubmitting(true);
    setProgramError("");
    try {
      const cleanFeatures = programForm.features.filter((f) => f.trim() !== "");
      const payload = { ...programForm, features: cleanFeatures };

      let res;
      if (editingProgram) {
        res = await fetch("/api/admin/programs", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: editingProgram._id, ...payload }),
        });
      } else {
        res = await fetch("/api/admin/programs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setShowProgramModal(false);
        setEditingProgram(null);
        setProgramForm({
          name: "",
          tagline: "",
          description: "",
          image: "",
          features: [""],
          isActive: true,
          isVisible: true,
          sortOrder: 0,
        });
        fetchPrograms();
      } else {
        const result = await res.json();
        setProgramError(result.error || "Failed to save program");
      }
    } catch {
      setProgramError("An unexpected error occurred.");
    } finally {
      setProgramSubmitting(false);
    }
  };

  const openEditProgram = (program: Program) => {
    setEditingProgram(program);
    setProgramForm({
      name: program.name,
      tagline: program.tagline,
      description: program.description,
      image: program.image,
      features: program.features.length > 0 ? program.features : [""],
      isActive: program.isActive,
      isVisible: program.isVisible !== false,
      sortOrder: program.sortOrder,
    });
    setShowProgramModal(true);
  };

  const handleDeleteProgram = async (id: string) => {
    if (!confirm("Are you sure you want to delete this program?")) return;
    try {
      const res = await fetch(`/api/admin/programs?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchPrograms();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleProgramActive = async (program: Program) => {
    try {
      await fetch("/api/admin/programs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: program._id, isActive: !program.isActive }),
      });
      fetchPrograms();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleProgramVisibility = async (program: Program) => {
    try {
      await fetch("/api/admin/programs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: program._id,
          isVisible: program.isVisible === false,
        }),
      });
      fetchPrograms();
    } catch (err) {
      console.error(err);
    }
  };

  const handleProgramImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      setProgramError("Image size must be less than 500KB");
      return;
    }
    setProgramError("");
    const reader = new FileReader();
    reader.onloadend = () => {
      setProgramForm((prev) => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const unreadCount = contactRequests.filter((r) => !r.isRead).length;

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
      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-20 md:hidden flex items-center gap-3 px-4 h-14 bg-background/80 backdrop-blur-lg border-b border-foreground/10">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="size-9 flex items-center justify-center rounded-xl bg-foreground/5 shrink-0"
        >
          <span className="material-symbols-outlined text-xl text-foreground/70">
            menu
          </span>
        </button>
        <Link href="/" className="flex items-center gap-2 overflow-hidden">
          <div className="size-7 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/30 shrink-0 overflow-hidden relative">
            <Image
              src="/logo.png"
              alt="Logo"
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
          <span className="text-base font-black tracking-tight text-foreground truncate">
            Admin<span className="text-primary">Panel</span>
          </span>
        </Link>
      </div>

      <AdminSidebar
        sidebarView={sidebarView}
        setSidebarView={setSidebarView}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        unreadCount={unreadCount}
        cohortNotNotified={cohortNotNotified}
        handleLogout={handleLogout}
      />

      <motion.main
        animate={{ marginLeft: isMobile ? 0 : sidebarCollapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-1 min-h-screen w-full"
      >
        <div className="h-14 md:hidden" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
          <AnimatePresence mode="wait">
            {sidebarView === "overview" && (
              <Overview
                totalUsers={totalUsers}
                totalStaff={totalStaff}
                unreadCount={unreadCount}
                cohortTotal={cohortTotal}
                cohortNotNotified={cohortNotNotified}
                contactRequests={contactRequests}
                setSidebarView={setSidebarView}
              />
            )}
            {sidebarView === "management" && (
              <Management
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                userSearch={userSearch}
                setUserSearch={setUserSearch}
                userTypeFilter={userTypeFilter}
                setUserTypeFilter={setUserTypeFilter}
                userDateFilter={userDateFilter}
                setUserDateFilter={setUserDateFilter}
                userSortField={userSortField}
                setUserSortField={setUserSortField}
                userSortDir={userSortDir}
                setUserSortDir={setUserSortDir}
                data={data}
                loading={loading}
                setShowAddModal={setShowAddModal}
                handleToggleUserStatus={handleToggleUserStatus}
                handleToggleStaffStatus={handleToggleStaffStatus}
                openEditStaff={openEditStaff}
              />
            )}
            {sidebarView === "requests" && (
              <Requests
                contactRequests={contactRequests}
                contactsLoading={contactsLoading}
                unreadCount={unreadCount}
                handleMarkAsRead={handleMarkAsRead}
              />
            )}
            {sidebarView === "pricing" && (
              <Pricing
                plans={plans}
                plansLoading={plansLoading}
                setShowPlanModal={setShowPlanModal}
                openEditPlan={openEditPlan}
                handleDeletePlan={handleDeletePlan}
                handleTogglePlanActive={handleTogglePlanActive}
              />
            )}
            {sidebarView === "cohort" && (
              <Cohort
                cohortInterests={cohortInterests}
                cohortTotal={cohortTotal}
                cohortNotNotified={cohortNotNotified}
                cohortLoading={cohortLoading}
                handleMarkNotified={handleMarkNotified}
                handleDeleteCohortEntry={handleDeleteCohortEntry}
              />
            )}
            {sidebarView === "programs" && (
              <Programs
                programs={programs}
                programsLoading={programsLoading}
                programViewMode={programViewMode}
                setProgramViewMode={setProgramViewMode}
                setShowProgramModal={setShowProgramModal}
                openEditProgram={openEditProgram}
                handleToggleProgramActive={handleToggleProgramActive}
                handleToggleProgramVisibility={handleToggleProgramVisibility}
                handleDeleteProgram={handleDeleteProgram}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.main>

      {/* Modals */}
      <StaffModal
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        editingStaff={editingStaff}
        setEditingStaff={setEditingStaff}
        newStaff={newStaff}
        setNewStaff={setNewStaff}
        handleCreateStaff={handleCreateStaff}
        isSubmitting={isSubmitting}
        uploadError={uploadError}
        setUploadError={setUploadError}
        submitError={submitError}
      />

      <PlanModal
        showPlanModal={showPlanModal}
        setShowPlanModal={setShowPlanModal}
        editingPlan={editingPlan}
        planForm={planForm}
        setPlanForm={setPlanForm}
        handlePlanSubmit={handlePlanSubmit}
        planSubmitting={planSubmitting}
        planError={planError}
      />

      <ProgramModal
        showProgramModal={showProgramModal}
        setShowProgramModal={setShowProgramModal}
        editingProgram={editingProgram}
        programForm={programForm}
        setProgramForm={setProgramForm}
        handleProgramImageUpload={handleProgramImageUpload}
        handleProgramSubmit={handleProgramSubmit}
        programSubmitting={programSubmitting}
        programError={programError}
      />

      <StatusToggleModal
        toggleConfirm={toggleConfirm}
        setToggleConfirm={setToggleConfirm}
        executeStatusToggle={executeStatusToggle}
      />
    </div>
  );
};

export default AdminDashboard;
