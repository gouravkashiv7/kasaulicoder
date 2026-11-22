import type { Metadata } from "next";
import { getShowcaseProjects } from "@/backend/lib/showcase";
import ProjectListPage from "@/components/projects/ProjectListPage";

export const metadata: Metadata = {
  title: "Projects in Development",
  description: "Software projects KasauliCoder is currently building.",
  alternates: { canonical: "/projects/active-projects" },
};

// Cached and re-read from the database at most once a minute, so new or
// edited projects appear within a minute without hitting the DB per visit.
export const revalidate = 60;

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
