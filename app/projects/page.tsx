import type { Metadata } from "next";
import { getShowcaseProjects } from "@/backend/lib/showcase";
import GeneratedScreen from "@/components/marketing/GeneratedScreen";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "SaaS products, web applications and platforms designed and built by KasauliCoder, with screenshots, technology used and links to the live products.",
  alternates: { canonical: "/projects" },
};

// Cached and re-read from the database at most once a minute, so new or
// edited projects appear within a minute without hitting the DB per visit.
export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await getShowcaseProjects();
  return <GeneratedScreen projects={projects} />;
}
