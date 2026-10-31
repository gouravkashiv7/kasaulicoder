import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectDetail } from "@/backend/lib/showcase";
import ProjectDetail from "@/components/projects/ProjectDetail";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const project = await getProjectDetail(slug, "past");

  if (!project) {
    return { title: "Project Not Found" };
  }

  const description = project.desc?.substring(0, 160) || project.outcome;
  const image = project.media.find((m) => m.type === "image")?.url;
  return {
    title: project.title,
    description,
    alternates: { canonical: `/projects/recent-projects/${project.slug}` },
    openGraph: {
      title: `${project.title} | KasauliCoder`,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function ProjectPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const project = await getProjectDetail(slug, "past");

  if (!project) {
    notFound();
  }

  return <ProjectDetail project={project} />;
}
