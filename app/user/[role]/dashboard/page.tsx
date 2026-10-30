import { redirect } from "next/navigation";
import UserDashboard from "@/components/auth/UserDashboard";
import { getServerSession } from "@/backend/lib/auth";

export default async function UserDashboardPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const session = await getServerSession();
  if (!session) redirect("/login");

  if (session.type === "admin") redirect("/admin/dashboard");

  // Validate the role param matches a known user type
  const { role } = await params;
  if (role !== "student" && role !== "professional") {
    redirect(`/user/${session.userType || "student"}/dashboard`);
  }

  return <UserDashboard userType={role} />;
}
