import type { Metadata } from "next";
import { getShowcaseProjects } from "@/backend/lib/showcase";
import ProjectListPage from "@/components/projects/ProjectListPage";

export const metadata: Metadata = {
  title: "Completed Projects",
  description:
    "Completed SaaS products, web applications and platforms built by KasauliCoder.",
  alternates: { canonical: "/projects/recent-projects" },
};

// Cached and re-read from the database at most once a minute, so new or
// edited projects appear within a minute without hitting the DB per visit.
export const revalidate = 60;

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
