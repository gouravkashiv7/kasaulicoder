"use client";

import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AdminBlogManagement from "@/components/admin/AdminBlogManagement";
import AdminProjectsManagement from "@/components/admin/AdminProjectsManagement";
// Components
import AdminSidebar from "@/components/admin/AdminSidebar";
import Cohort from "@/components/admin/Cohort";
import Assets from "@/components/admin/director/Assets";
import Discussions from "@/components/admin/director/Discussions";
import Finance from "@/components/admin/director/Finance";
import Policies from "@/components/admin/director/Policies";
import { useDirectorBadges } from "@/components/admin/director/useDirectorBadges";
import Management from "@/components/admin/Management";
import MailAdminsModal from "@/components/admin/modals/MailAdminsModal";
import PlanModal from "@/components/admin/modals/PlanModal";
import ProgramModal from "@/components/admin/modals/ProgramModal";
import RejectRequestModal from "@/components/admin/modals/RejectRequestModal";
import SocialMediaModal from "@/components/admin/modals/SocialMediaModal";
// Modals
import StaffModal from "@/components/admin/modals/StaffModal";
import StatusToggleModal from "@/components/admin/modals/StatusToggleModal";
import Overview from "@/components/admin/Overview";
import Pricing from "@/components/admin/Pricing";
import Programs from "@/components/admin/Programs";
import Requests from "@/components/admin/Requests";
import RecordsTab from "@/components/admin/records/RecordsTab";
import SocialMediaManagement from "@/components/admin/SocialMediaManagement";
// Types
import type {
  CohortInterest,
  ContactRequest,
  CurrentUser,
  DirectoryRecord,
  MailAdminsForm,
  Plan,
  PlanForm,
  Program,
  ProgramForm,
  RejectConfirm,
  SidebarView,
  SocialMediaAccount,
  SocialMediaFormData,
  StaffForm,
  ToggleConfirm,
} from "@/components/admin/types";

const EMPTY_STAFF: StaffForm = {
  name: "",
  email: "",
  password: "",
  role: "admin",
  designation: "",
  roleDescription: "",
  image: "",
  isDirector: false,
};

const EMPTY_PLAN: PlanForm = {
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
};

const EMPTY_PROGRAM: ProgramForm = {
  name: "",
  tagline: "",
  description: "",
  image: "",
  features: [""],
  isActive: true,
  isVisible: true,
  sortOrder: 0,
};

interface AdminDashboardProps {
  // Role comes from the verified server session so the first paint is correct
  role: string;
  isDirector: boolean;
}

const AdminDashboard = ({ role, isDirector }: AdminDashboardProps) => {
  const searchParams = useSearchParams();

  // Only used for the viewer's own id (social media credential access)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const isSuperAdmin = role === "superadmin";

  // Navigation Logic
  const validAdminTabs = useMemo<SidebarView[]>(() => {
    const allTabs: SidebarView[] = [
      "overview",
      "management",
      "requests",
      "pricing",
      "cohort",
      "programs",
      "blogs",
      "projects",
      "social-media",
    ];
    if (isDirector || isSuperAdmin) {
      allTabs.push("finance", "policies", "assets", "discussions");
    }
    if (isSuperAdmin) return allTabs;
    // Staff (admin role) restricted tabs
    return allTabs.filter(
      (t) =>
        !["management", "requests", "pricing", "cohort", "programs"].includes(
          t,
        ),
    );
  }, [isSuperAdmin, isDirector]);

  // The URL is the single source of truth for the active tab, so a click can
  // never be overwritten by a stale copy of the previous tab.
  const tabFromUrl = searchParams.get("tab") as SidebarView | null;
  const sidebarView: SidebarView =
    tabFromUrl && validAdminTabs.includes(tabFromUrl) ? tabFromUrl : "overview";
  const directorBadges = useDirectorBadges(isDirector, sidebarView);

  const setSidebarView = useCallback((tab: SidebarView) => {
    const params = new URLSearchParams(window.location.search);
    params.set("tab", tab);
    // replaceState is picked up by useSearchParams without a server round trip
    window.history.replaceState(null, "", `?${params.toString()}`);
    window.scrollTo({ top: 0 });
  }, []);

  // Main State
  const [activeTab, setActiveTab] = useState<"users" | "staff">("staff");
  const activeTabRef = useRef<"users" | "staff">("staff");
  const [data, setData] = useState<DirectoryRecord[]>([]);
  // Lists start in a loading state so the empty state never flashes before the
  // first fetch; later refetches are silent and keep the current rows on screen.
  const [loading, setLoading] = useState(true);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [contactsLoading, setContactsLoading] = useState(true);
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
  const [plansLoading, setPlansLoading] = useState(true);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [planForm, setPlanForm] = useState(EMPTY_PLAN);
  const [planSubmitting, setPlanSubmitting] = useState(false);
  const [planError, setPlanError] = useState("");

  // Cohort Interest
  const [cohortInterests, setCohortInterests] = useState<CohortInterest[]>([]);
  const [cohortTotal, setCohortTotal] = useState(0);
  const [cohortNotNotified, setCohortNotNotified] = useState(0);
  const [cohortLoading, setCohortLoading] = useState(true);

  // Programs State
  const [programs, setPrograms] = useState<Program[]>([]);
  const [programsLoading, setProgramsLoading] = useState(true);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [programForm, setProgramForm] = useState(EMPTY_PROGRAM);
  const [programSubmitting, setProgramSubmitting] = useState(false);
  const [programError, setProgramError] = useState("");
  const [programViewMode, setProgramViewMode] = useState<"grid" | "list">(
    "grid",
  );

  // Staff Management Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<DirectoryRecord | null>(
    null,
  );
  const [newStaff, setNewStaff] = useState(EMPTY_STAFF);
  const [uploadError, setUploadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Social Media State
  const [socialMediaAccounts, setSocialMediaAccounts] = useState<
    SocialMediaAccount[]
  >([]);
  const [socialMediaLoading, setSocialMediaLoading] = useState(true);
  const [showSocialMediaModal, setShowSocialMediaModal] = useState(false);
  const [editingSocialMediaAccount, setEditingSocialMediaAccount] =
    useState<SocialMediaAccount | null>(null);
  const [socialMediaError, setSocialMediaError] = useState("");
  const [socialMediaSubmitting, setSocialMediaSubmitting] = useState(false);
  const [allStaff, setAllStaff] = useState<DirectoryRecord[]>([]);

  // UI State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Status Toggle Confirmation
  const [toggleConfirm, setToggleConfirm] = useState<ToggleConfirm | null>(
    null,
  );

  // Reject Request Confirmation
  const [rejectConfirm, setRejectConfirm] = useState<RejectConfirm | null>(
    null,
  );

  const [requestNotice, setRequestNotice] = useState("");

  // Email all admins / send reset links (superadmin)
  const [mailForm, setMailForm] = useState<MailAdminsForm | null>(null);
  const [resetSendingId, setResetSendingId] = useState<string | null>(null);
  const [staffNotice, setStaffNotice] = useState("");

  // API Callbacks
  // Fetchers never flip their loading flag back on: loading starts true, and a
  // refetch swaps in fresh data without replacing the list with a spinner.
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
          staffData.filter((s: DirectoryRecord) => s.role !== "superadmin")
            .length,
        );
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchContacts = useCallback(async () => {
    if (!isSuperAdmin) return;
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
  }, [isSuperAdmin]);

  const fetchData = useCallback(async () => {
    const tab = activeTab;
    try {
      const endpoint =
        tab === "users" ? "/api/admin/users" : "/api/admin/staff";
      const res = await fetch(endpoint);
      const result = await res.json();
      // Ignore a response for a tab the admin has already switched away from
      if (res.ok && activeTabRef.current === tab) {
        setData(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (activeTabRef.current === tab) setLoading(false);
    }
  }, [activeTab]);

  const changeManagementTab = (tab: "users" | "staff") => {
    if (tab === activeTabRef.current) return;
    activeTabRef.current = tab;
    // Users and staff rows have different shapes; never show one under the other
    setData([]);
    setLoading(true);
    setActiveTab(tab);
  };

  const fetchPlans = useCallback(async () => {
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

  const fetchSocialMediaAccounts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/social-media");
      if (res.ok) {
        const data = await res.json();
        setSocialMediaAccounts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSocialMediaLoading(false);
    }
  }, []);

  const fetchAllStaff = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/staff");
      if (res.ok) {
        const data = await res.json();
        setAllStaff(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Lifecycle: refetch whenever a panel is opened so it never shows data from
  // the previous visit. Contacts and cohort are also refreshed on every
  // navigation because the sidebar badges depend on them.
  useEffect(() => {
    if (isSuperAdmin) {
      fetchContacts();
      fetchCohortInterests();
    }
    switch (sidebarView) {
      case "overview":
        if (isSuperAdmin) fetchOverviewData();
        break;
      case "management":
        fetchData();
        break;
      case "pricing":
        fetchPlans();
        break;
      case "programs":
        fetchPrograms();
        break;
      case "social-media":
        fetchSocialMediaAccounts();
        if (isSuperAdmin) fetchAllStaff();
        break;
    }
  }, [
    sidebarView,
    isSuperAdmin,
    fetchOverviewData,
    fetchContacts,
    fetchData,
    fetchPlans,
    fetchCohortInterests,
    fetchPrograms,
    fetchSocialMediaAccounts,
    fetchAllStaff,
  ]);

  // New requests and waitlist signups arrive while the tab is in the
  // background; catch up when the admin comes back.
  useEffect(() => {
    if (!isSuperAdmin) return;
    const refresh = () => {
      fetchContacts();
      fetchCohortInterests();
      fetchOverviewData();
    };
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [isSuperAdmin, fetchContacts, fetchCohortInterests, fetchOverviewData]);

  // Handlers
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.warn("Logout request failed:", e);
    }
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleToggleUserStatus = (item: DirectoryRecord) => {
    setToggleConfirm({
      id: item._id,
      type: "users",
      currentStatus: item.isActive !== false,
      name: item.name,
      isSubmitting: false,
    });
  };

  const handleToggleStaffStatus = (item: DirectoryRecord) => {
    setToggleConfirm({
      id: item._id,
      type: "staff",
      currentStatus: item.isActive !== false,
      name: item.name,
      isSubmitting: false,
    });
  };

  const openMailAdmins = async () => {
    setStaffNotice("");
    setMailForm({
      subject: "",
      message: "",
      recipientCount: null,
      isSubmitting: false,
    });
    try {
      const res = await fetch("/api/admin/staff/broadcast");
      const result = await res.json().catch(() => ({}));
      setMailForm((prev) =>
        prev
          ? {
              ...prev,
              recipientCount: res.ok ? (result.count ?? 0) : 0,
              error: res.ok
                ? undefined
                : result.error || "Could not check recipients",
            }
          : null,
      );
    } catch (err) {
      console.error(err);
      setMailForm((prev) =>
        prev
          ? { ...prev, recipientCount: 0, error: "Something went wrong" }
          : null,
      );
    }
  };

  const executeMailAdmins = async () => {
    if (!mailForm) return;
    setMailForm({ ...mailForm, isSubmitting: true, error: undefined });
    try {
      const res = await fetch("/api/admin/staff/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: mailForm.subject,
          message: mailForm.message,
        }),
      });
      const result = await res.json().catch(() => ({}));
      if (res.ok) {
        setMailForm(null);
        setStaffNotice(result.message || "Email sent");
      } else {
        setMailForm((prev) =>
          prev
            ? {
                ...prev,
                isSubmitting: false,
                error: result.error || "Could not send the email",
              }
            : null,
        );
      }
    } catch (err) {
      console.error(err);
      setMailForm((prev) =>
        prev
          ? { ...prev, isSubmitting: false, error: "Something went wrong" }
          : null,
      );
    }
  };

  const handleSendReset = async (item: DirectoryRecord) => {
    setStaffNotice("");
    setResetSendingId(item._id);
    try {
      const res = await fetch("/api/admin/staff/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item._id }),
      });
      const result = await res.json().catch(() => ({}));
      setStaffNotice(
        res.ok
          ? result.message || `Reset email sent to ${item.email}`
          : result.error || "Could not send the reset email",
      );
    } catch (err) {
      console.error(err);
      setStaffNotice("Something went wrong");
    } finally {
      setResetSendingId(null);
    }
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

      const result = await res.json().catch(() => ({}));
      if (res.ok) {
        setData((prev) =>
          prev.map((item) =>
            item._id === toggleConfirm.id
              ? { ...item, isActive: result.isActive }
              : item,
          ),
        );
        setToggleConfirm(null);
      } else {
        setToggleConfirm((prev) =>
          prev
            ? {
                ...prev,
                isSubmitting: false,
                error: result.error || "Could not update status",
              }
            : null,
        );
      }
    } catch (err) {
      console.error(err);
      setToggleConfirm((prev) =>
        prev
          ? { ...prev, isSubmitting: false, error: "Something went wrong" }
          : null,
      );
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

  const openRejectRequest = (req: ContactRequest) => {
    setRejectConfirm({
      id: req._id,
      name: req.name,
      email: req.email,
      reason: "",
      isSubmitting: false,
    });
  };

  const executeReject = async (sendEmail: boolean) => {
    if (!rejectConfirm) return;
    const { id, reason } = rejectConfirm;
    setRejectConfirm({
      ...rejectConfirm,
      isSubmitting: true,
      error: undefined,
    });
    try {
      const res = await fetch("/api/admin/contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "reject", reason, sendEmail }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setContactRequests((prev) =>
          prev.map((r) => (r._id === id ? { ...r, ...data.data } : r)),
        );
        setRejectConfirm(null);
        setRequestNotice(data.emailError || "");
      } else {
        setRejectConfirm((prev) =>
          prev
            ? {
                ...prev,
                isSubmitting: false,
                error: data.error || "Failed to reject request",
              }
            : null,
        );
      }
    } catch (err) {
      console.error(err);
      setRejectConfirm((prev) =>
        prev
          ? { ...prev, isSubmitting: false, error: "Something went wrong" }
          : null,
      );
    }
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    try {
      let res: Response;
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
        setNewStaff(EMPTY_STAFF);
        fetchData();
        fetchOverviewData();
        fetchAllStaff();
      } else {
        const result = await res.json();
        setSubmitError(result.error || "Operation failed");
      }
    } catch {
      setSubmitError("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // "Add" must start from a blank form, not whatever was last edited or typed
  const openNewStaff = () => {
    setEditingStaff(null);
    setNewStaff(EMPTY_STAFF);
    setSubmitError("");
    setUploadError("");
    setShowAddModal(true);
  };

  const openEditStaff = (staff: DirectoryRecord) => {
    setSubmitError("");
    setUploadError("");
    setEditingStaff(staff);
    setNewStaff({
      name: staff.name,
      email: staff.email,
      password: "",
      role: staff.role ?? "admin",
      designation: staff.designation || "",
      roleDescription: staff.roleDescription || "",
      image: staff.image || "",
      isDirector: staff.isDirector === true,
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

      let res: Response;
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
        setPlanForm(EMPTY_PLAN);
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

  const openNewPlan = () => {
    setEditingPlan(null);
    setPlanForm(EMPTY_PLAN);
    setPlanError("");
    setShowPlanModal(true);
  };

  const openEditPlan = (plan: Plan) => {
    setPlanError("");
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
        // Deleting a pending entry also shrinks the "to be notified" count
        const removed = cohortInterests.find((e) => e._id === id);
        setCohortInterests((prev) => prev.filter((e) => e._id !== id));
        setCohortTotal((n) => Math.max(0, n - 1));
        if (removed && !removed.emailSent) {
          setCohortNotNotified((n) => Math.max(0, n - 1));
        }
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

      let res: Response;
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
        setProgramForm(EMPTY_PROGRAM);
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

  const openNewProgram = () => {
    setEditingProgram(null);
    setProgramForm(EMPTY_PROGRAM);
    setProgramError("");
    setShowProgramModal(true);
  };

  const openEditProgram = (program: Program) => {
    setProgramError("");
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

  const handleSaveSocialMediaAccount = async (
    formData: SocialMediaFormData,
  ) => {
    setSocialMediaSubmitting(true);
    setSocialMediaError("");
    try {
      let res: Response;
      if (editingSocialMediaAccount) {
        res = await fetch("/api/admin/social-media", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingSocialMediaAccount._id,
            ...formData,
          }),
        });
      } else {
        res = await fetch("/api/admin/social-media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (res.ok) {
        setShowSocialMediaModal(false);
        setEditingSocialMediaAccount(null);
        fetchSocialMediaAccounts();
      } else {
        const result = await res.json();
        setSocialMediaError(result.error || "Operation failed");
      }
    } catch {
      setSocialMediaError("An error occurred");
    } finally {
      setSocialMediaSubmitting(false);
    }
  };

  const handleDeleteSocialMediaAccount = async (id: string) => {
    if (!confirm("Are you sure you want to delete this social account?"))
      return;
    try {
      const res = await fetch(`/api/admin/social-media?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchSocialMediaAccounts();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditSocialMedia = (account: SocialMediaAccount) => {
    setSocialMediaError("");
    setEditingSocialMediaAccount(account);
    setShowSocialMediaModal(true);
  };

  const unreadCount = contactRequests.filter(
    (r) => !r.isRead && r.status !== "rejected",
  ).length;

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
          type="button"
          aria-label="Open navigation menu"
          onClick={() => {
            // The drawer is always full width; a desktop-collapsed rail would hide labels
            setSidebarCollapsed(false);
            setMobileMenuOpen(true);
          }}
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
              className="object-contain theme-logo"
            />
          </div>
          <span className="text-base font-black tracking-tight text-foreground truncate">
            Admin<span className="text-primary">Panel</span>
          </span>
        </Link>
      </div>

      <AdminSidebar
        role={role}
        isDirector={isDirector}
        directorBadges={directorBadges}
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

      <main
        className={`flex-1 min-w-0 min-h-screen w-full transition-[margin] duration-300 ease-in-out ${
          sidebarCollapsed ? "md:ml-[72px]" : "md:ml-[260px]"
        }`}
      >
        <div className="h-14 md:hidden" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
          <AnimatePresence mode="wait">
            {sidebarView === "overview" && (
              <Overview
                role={role}
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
                setActiveTab={changeManagementTab}
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
                onAddStaff={openNewStaff}
                handleToggleUserStatus={handleToggleUserStatus}
                handleToggleStaffStatus={handleToggleStaffStatus}
                openEditStaff={openEditStaff}
                onMailAdmins={openMailAdmins}
                onSendReset={handleSendReset}
                resetSendingId={resetSendingId}
                notice={staffNotice}
                onDismissNotice={() => setStaffNotice("")}
              />
            )}
            {sidebarView === "requests" && (
              <Requests
                contactRequests={contactRequests}
                contactsLoading={contactsLoading}
                unreadCount={unreadCount}
                handleMarkAsRead={handleMarkAsRead}
                handleReject={openRejectRequest}
                notice={requestNotice}
                onDismissNotice={() => setRequestNotice("")}
              />
            )}
            {sidebarView === "pricing" && (
              <Pricing
                plans={plans}
                plansLoading={plansLoading}
                onCreate={openNewPlan}
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
                onCreate={openNewProgram}
                openEditProgram={openEditProgram}
                handleToggleProgramActive={handleToggleProgramActive}
                handleToggleProgramVisibility={handleToggleProgramVisibility}
                handleDeleteProgram={handleDeleteProgram}
              />
            )}
            {sidebarView === "finance" && (
              <RecordsTab
                tab="finance"
                isDirector={isDirector}
                isSuperAdmin={isSuperAdmin}
              >
                <Finance />
              </RecordsTab>
            )}
            {sidebarView === "policies" && (
              <RecordsTab
                tab="policies"
                isDirector={isDirector}
                isSuperAdmin={isSuperAdmin}
              >
                <Policies />
              </RecordsTab>
            )}
            {sidebarView === "assets" && (
              <RecordsTab
                tab="assets"
                isDirector={isDirector}
                isSuperAdmin={isSuperAdmin}
              >
                <Assets />
              </RecordsTab>
            )}
            {sidebarView === "discussions" && (
              <RecordsTab
                tab="discussions"
                isDirector={isDirector}
                isSuperAdmin={isSuperAdmin}
              >
                <Discussions />
              </RecordsTab>
            )}
            {sidebarView === "blogs" && <AdminBlogManagement />}
            {sidebarView === "projects" && <AdminProjectsManagement />}
            {sidebarView === "social-media" && (
              <SocialMediaManagement
                accounts={socialMediaAccounts}
                loading={socialMediaLoading}
                currentUser={
                  currentUser
                    ? { ...currentUser, id: currentUser._id || currentUser.id }
                    : null
                }
                isSuperAdmin={isSuperAdmin}
                onAdd={() => {
                  setEditingSocialMediaAccount(null);
                  setSocialMediaError("");
                  setShowSocialMediaModal(true);
                }}
                onEdit={openEditSocialMedia}
                onDelete={handleDeleteSocialMediaAccount}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

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

      <RejectRequestModal
        rejectConfirm={rejectConfirm}
        setRejectConfirm={setRejectConfirm}
        executeReject={executeReject}
      />

      <MailAdminsModal
        mailForm={mailForm}
        setMailForm={setMailForm}
        executeSend={executeMailAdmins}
      />

      <SocialMediaModal
        showModal={showSocialMediaModal}
        setShowModal={setShowSocialMediaModal}
        editingAccount={editingSocialMediaAccount}
        setEditingAccount={setEditingSocialMediaAccount}
        staffList={allStaff.filter((staff) => staff.role !== "superadmin")}
        onSave={handleSaveSocialMediaAccount}
        isSubmitting={socialMediaSubmitting}
        error={socialMediaError}
      />
    </div>
  );
};

export default AdminDashboard;
