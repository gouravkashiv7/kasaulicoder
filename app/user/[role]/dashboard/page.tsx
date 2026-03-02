"use client";

import React, { useEffect, useState } from "react";
import UserDashboard from "@/components/auth/UserDashboard";
import { useRouter, useParams } from "next/navigation";

export default function UserDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [validRole, setValidRole] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      if (
        user.role === "admin" ||
        user.role === "superadmin" ||
        user.loginType === "admin"
      ) {
        router.push("/admin/dashboard");
        return;
      }

      // Validate the role param matches the user's type
      const role = params?.role as string;
      const userType = user.userType || "student";

      if (role !== "student" && role !== "professional") {
        router.push(`/user/${userType}/dashboard`);
        return;
      }

      setValidRole(role);
      setLoading(false);
    } catch (e) {
      router.push("/login");
    }
  }, [router, params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return <UserDashboard userType={validRole || "student"} />;
}
