import { redirect } from "next/navigation";
import AdminDashboard from "@/components/auth/AdminDashboard";
import { getServerSession } from "@/backend/lib/auth";

export default async function AdminDashboardPage() {
  const session = await getServerSession();
  if (!session) redirect("/login");

  const hasAccess =
    session.type === "admin" &&
    ["superadmin", "admin", "editor"].includes(session.role);
  if (!hasAccess) redirect("/");

  return <AdminDashboard />;
}
