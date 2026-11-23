import { redirect } from "next/navigation";
import { getServerSession } from "@/backend/lib/auth";
import UserDashboard from "@/components/auth/UserDashboard";

export default async function UserDashboardPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const session = await getServerSession();
  if (!session) redirect("/login");

  // Same split as login: superadmins use the admin dashboard, other staff
  // the member dashboard
  if (session.type === "admin") {
    redirect(
      session.role === "superadmin" ? "/admin/dashboard" : "/member/dashboard",
    );
  }

  // Validate the role param matches a known user type
  const { role } = await params;
  if (role !== "student" && role !== "professional") {
    redirect(`/user/${session.userType || "student"}/dashboard`);
  }

  return <UserDashboard userType={role} />;
}
