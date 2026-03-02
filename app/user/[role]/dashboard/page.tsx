"use client";

import React, { useEffect, useState } from "react";
import UserSettings from "@/components/auth/UserSettings";
import { useRouter } from "next/navigation";

export default function UserDashboardPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(storedUser);
    if (user.role === "admin" || user.role === "superadmin") {
      router.push("/admin/dashboard");
      return;
    }

    setLoading(false);
  }, [router]);

  if (loading) return null;

  return <UserSettings />;
}
