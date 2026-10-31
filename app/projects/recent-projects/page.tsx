import type { Metadata } from "next";
import { getShowcaseProjects } from "@/backend/lib/showcase";
import ProjectListPage from "@/components/projects/ProjectListPage";

export const metadata: Metadata = {
  title: "Completed Projects",
  description:
    "Completed SaaS products, web applications and platforms built by KasauliCoder.",
  alternates: { canonical: "/projects/recent-projects" },
};

// Read projects on each request so newly added projects appear without a redeploy.
export const dynamic = "force-dynamic";

export default async function RecentProjects() {
  const projects = await getShowcaseProjects({ status: "past" });
  return (
    <ProjectListPage
      label="Completed work"
      title="Completed projects"
      intro="Software and digital solutions we have designed, built and delivered."
      emptyText="There are no completed projects to show yet."
      projects={projects}
    />
  );
}
