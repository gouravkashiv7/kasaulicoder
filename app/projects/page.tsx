import type { Metadata } from "next";
import { getShowcaseProjects } from "@/backend/lib/showcase";
import GeneratedScreen from "@/components/marketing/GeneratedScreen";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "SaaS products, web applications and platforms designed and built by KasauliCoder, with screenshots, technology used and links to the live products.",
  alternates: { canonical: "/projects" },
};

// Read projects on each request so newly added projects appear without a redeploy.
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getShowcaseProjects();
  return <GeneratedScreen projects={projects} />;
}
