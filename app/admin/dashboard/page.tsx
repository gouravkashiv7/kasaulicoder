"use client";

import React, { useEffect, useState } from "react";
import AdminDashboard from "@/components/auth/AdminDashboard";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(storedUser);
    if (
      user.role !== "admin" &&
      user.role !== "superadmin" &&
      user.loginType !== "admin"
    ) {
      router.push("/dashboard");
      return;
    }

    setLoading(false);
  }, [router]);

  if (loading) return null;

  return <AdminDashboard />;
}
