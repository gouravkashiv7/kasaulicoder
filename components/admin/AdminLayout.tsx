"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import type { SidebarView } from "@/components/admin/types";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab?: SidebarView;
}

export default function AdminLayout({
  children,
  activeTab = "overview",
}: AdminLayoutProps) {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string>();
  const router = useRouter();

  // Sidebar & UI State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [cohortNotNotified, setCohortNotNotified] = useState(0);

  // Auth Check
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    let user: { role: string };
    try {
      user = JSON.parse(storedUser);
    } catch {
      localStorage.removeItem("user");
      router.push("/login");
      return;
    }
    const hasAccess = ["superadmin", "admin", "editor"].includes(user.role);

    if (!hasAccess) {
      router.push("/");
      return;
    }

    setRole(user.role);
    setLoading(false);
  }, [router]);

  // Fetch badges (unread counts)
  const fetchBadges = useCallback(async () => {
    try {
      const [contactsRes, cohortRes] = await Promise.all([
        fetch("/api/admin/contacts"),
        fetch("/api/admin/cohort-interest"),
      ]);

      if (contactsRes.ok) {
        const contacts = await contactsRes.json();
        setUnreadCount(contacts.filter((r: any) => !r.isRead).length);
      }
      if (cohortRes.ok) {
        const cohort = await cohortRes.json();
        setCohortNotNotified(cohort.notNotified || 0);
      }
    } catch (err) {
      console.error("Failed to fetch badges:", err);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchBadges();
    }
  }, [loading, fetchBadges]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.warn("Logout request failed:", e);
    }
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleSetSidebarView = (view: SidebarView) => {
    router.push(`/admin/dashboard?tab=${view}`);
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex font-display">
      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-20 md:hidden flex items-center gap-3 px-4 h-14 bg-background/80 backdrop-blur-lg border-b border-foreground/10">
        <button
          type="button"
          aria-label="Open navigation menu"
          onClick={() => {
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
        sidebarView={activeTab}
        setSidebarView={handleSetSidebarView}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        unreadCount={unreadCount}
        cohortNotNotified={cohortNotNotified}
        handleLogout={handleLogout}
      />

      <main
        className={`flex-1 min-w-0 min-h-screen w-full relative transition-[margin] duration-300 ease-in-out ${
          sidebarCollapsed ? "md:ml-[72px]" : "md:ml-[260px]"
        }`}
      >
        <div className="h-14 md:hidden" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
