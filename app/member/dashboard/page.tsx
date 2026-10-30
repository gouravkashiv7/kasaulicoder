import { redirect } from "next/navigation";
import MemberDashboard from "@/components/auth/MemberDashboard";
import { getServerSession } from "@/backend/lib/auth";

export default async function MemberDashboardPage() {
  const session = await getServerSession();
  if (!session) redirect("/login?type=admin");

  if (session.type !== "admin" || session.role === "superadmin") {
    redirect("/");
  }

  return <MemberDashboard />;
}
