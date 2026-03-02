"use client";

import React, { useEffect, useState } from "react";
import MemberDashboard from "@/components/auth/MemberDashboard";
import { useRouter } from "next/navigation";

export default function MemberDashboardPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login?type=admin");
      return;
    }

    const user = JSON.parse(storedUser);
    if (user.loginType !== "admin" || user.role === "superadmin") {
      router.push("/");
      return;
    }

    setLoading(false);
  }, [router]);

  if (loading) return null;

  return <MemberDashboard />;
}
