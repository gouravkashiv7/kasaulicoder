import { redirect } from "next/navigation";
import { getServerSession } from "@/backend/lib/auth";
import AdminDashboard from "@/components/auth/AdminDashboard";

export default async function AdminDashboardPage() {
  const session = await getServerSession();
  if (!session) redirect("/login");

  // Directors of any staff role use the director tabs here
  const hasAccess =
    session.type === "admin" &&
    (["superadmin", "admin", "editor"].includes(session.role) ||
      Boolean(session.isDirector));
  if (!hasAccess) redirect("/");

  return <AdminDashboard role={session.role} isDirector={session.isDirector} />;
}
