import type { Metadata } from "next";
import { getShowcaseProjects } from "@/backend/lib/showcase";
import ProjectListPage from "@/components/projects/ProjectListPage";

export const metadata: Metadata = {
  title: "Projects in Development",
  description: "Software projects KasauliCoder is currently building.",
  alternates: { canonical: "/projects/active-projects" },
};

// Read projects on each request so newly added projects appear without a redeploy.
export const dynamic = "force-dynamic";

export default async function ActiveProjects() {
  const projects = await getShowcaseProjects({ status: "active" });
  return (
    <ProjectListPage
      label="In development"
      title="Projects in development"
      intro="Software and digital solutions we are currently designing and building."
      emptyText="There are no projects in development to show right now."
      projects={projects}
    />
  );
}
