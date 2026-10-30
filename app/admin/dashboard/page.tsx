import { redirect } from "next/navigation";
import { getServerSession } from "@/backend/lib/auth";
import AdminDashboard from "@/components/auth/AdminDashboard";

export default async function AdminDashboardPage() {
  const session = await getServerSession();
  if (!session) redirect("/login");

  const hasAccess =
    session.type === "admin" &&
    ["superadmin", "admin", "editor"].includes(session.role);
  if (!hasAccess) redirect("/");

  return <AdminDashboard />;
}
