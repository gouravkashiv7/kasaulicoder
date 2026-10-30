import { redirect } from "next/navigation";
import { getServerSession } from "@/backend/lib/auth";

export default async function DashboardRedirect() {
  const session = await getServerSession();
  if (!session) redirect("/login");

  if (session.type === "admin") redirect("/admin/dashboard");

  // Route based on userType (student/professional)
  redirect(`/user/${session.userType || "student"}/dashboard`);
}
