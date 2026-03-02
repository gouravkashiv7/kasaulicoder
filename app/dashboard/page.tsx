"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirect() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

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
      } else {
        const userType = user.role || "user";
        router.push(`/user/${userType}/dashboard`);
      }
    } catch (e) {
      router.push("/login");
    }
  }, [router]);

  // Optionally return a sleek loading state while redirecting
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return null;
}
