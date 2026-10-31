import Link from "next/link";
import GlobalFooter from "@/components/layout/GlobalFooter";
import GlobalHeader from "@/components/layout/GlobalHeader";
import ProjectShowcaseCard from "@/components/projects/ProjectShowcaseCard";
import { Icon, primaryButton, textLink } from "@/components/ui/marketing";
import type { ShowcaseProject } from "@/lib/projects";

// Shared layout for the completed and in-development project lists.
export default function ProjectListPage({
  label,
  title,
  intro,
  emptyText,
  projects,
}: {
  label: string;
  title: string;
  intro: string;
  emptyText: string;
  projects: ShowcaseProject[];
}) {
  return (
    <div className="relative bg-background text-foreground font-sans min-h-screen flex flex-col overflow-x-hidden">
      <GlobalHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-32 sm:pt-40 pb-20 sm:pb-28">
        <Link href="/projects" className={`${textLink} mb-10 text-sm`}>
          <Icon name="arrow_back" className="text-lg" />
          All projects
        </Link>
        <div className="mb-14 max-w-3xl">
          <p className="font-display text-base sm:text-lg font-semibold text-primary mb-4">
            {label}
          </p>
          <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight leading-[1.04] mb-6">
            {title}
          </h1>
          <p className="text-lg sm:text-xl text-foreground/70 leading-relaxed">
            {intro}
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-3xl border border-foreground/10 bg-foreground/5 px-6 py-16 text-center">
            <p className="text-lg text-foreground/70 mb-8">{emptyText}</p>
            <Link href="/projects" className={primaryButton}>
              Browse All Projects
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {projects.map((project, i) => (
              <ProjectShowcaseCard
                key={project._id}
                project={project}
                headingLevel="h2"
                priority={i < 2}
              />
            ))}
          </div>
        )}
      </main>

      <GlobalFooter />
    </div>
  );
}
