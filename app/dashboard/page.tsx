import { redirect } from "next/navigation";
import { getServerSession } from "@/backend/lib/auth";

export default async function DashboardRedirect() {
  const session = await getServerSession();
  if (!session) redirect("/login");

  // Same split as login: superadmins use the admin dashboard, other staff
  // the member dashboard
  if (session.type === "admin") {
    redirect(
      session.role === "superadmin" ? "/admin/dashboard" : "/member/dashboard",
    );
  }

  // Route based on userType (student/professional)
  redirect(`/user/${session.userType || "student"}/dashboard`);
}
