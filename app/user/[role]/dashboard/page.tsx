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

  // Each user sees only the dashboard for their own account type
  const { role } = await params;
  const ownType = session.userType || "student";
  if (role !== ownType) redirect(`/user/${ownType}/dashboard`);

  return <UserDashboard userType={role} />;
}
