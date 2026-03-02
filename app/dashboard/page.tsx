"use client";

import React, { useEffect, useState } from "react";
import UserSettings from "@/components/auth/UserSettings";
import AdminDashboard from "@/components/auth/AdminDashboard";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would check a validated session
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  // If user is admin/superadmin, show the admin dashboard
  if (user?.role === "superadmin" || user?.role === "admin") {
    return <AdminDashboard />;
  }

  return <UserSettings />;
}
