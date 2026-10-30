import type { Metadata } from "next";
import Link from "next/link";
import connectDB from "@/backend/lib/db";
import Project, { type IProject } from "@/backend/models/Project";
import GlobalFooter from "@/components/layout/GlobalFooter";
import GlobalHeader from "@/components/layout/GlobalHeader";
import { ProjectMediaDisplay } from "@/components/ui/ProjectMediaDisplay";

export const metadata: Metadata = {
  title: "Active Projects",
  description: "Software projects KasauliCoder is currently building.",
};

export default async function ActiveProjects() {
  await connectDB();
  const rawProjects = await Project.find({ status: "active" })
    .sort({ createdAt: -1 })
    .lean();

  // Next.js serialization requirement: POJOs only (no Mongoose ObjectIds)
  const projects = JSON.parse(JSON.stringify(rawProjects)) as IProject[];

  return (
    <div className="relative bg-background text-foreground font-sans min-h-screen flex flex-col">
      <GlobalHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-32 sm:pt-40 pb-20">
        <div className="mb-16">
          <div className="flex mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold tracking-[0.2em] uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              In Development
            </div>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black mb-6 tracking-tight">
            Active <span className="text-primary">Projects</span>
          </h1>
          <p className="text-foreground/60 max-w-2xl text-xl leading-relaxed">
            Software and digital solutions we are currently designing and
            building.
          </p>
        </div>

        <div className="grid gap-8">
          {projects.length === 0 ? (
            <div className="text-center py-20 text-foreground/40 font-bold border border-foreground/10 bg-foreground/5 rounded-3xl">
              No active projects at the moment.
            </div>
          ) : (
            projects.map((project: IProject) => (
              <div
                key={project._id.toString()}
                className="grid lg:grid-cols-2 gap-8 items-center border border-foreground/10 bg-foreground/5 rounded-3xl p-6 sm:p-10 hover:border-primary/30 transition-colors"
              >
                <div className="w-full">
                  <ProjectMediaDisplay
                    media={project.media || []}
                    liveUrl={project.liveUrl}
                    title={project.title}
                    aspectRatio="aspect-video"
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <h3 className="text-2xl sm:text-3xl font-black text-foreground">
                    {project.title}
                  </h3>
                  <p className="text-lg font-bold text-primary italic">
                    {project.outcome}
                  </p>
                  <p className="text-foreground/70 leading-relaxed">
                    {project.desc}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.tags?.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-foreground/10 rounded-md text-xs font-bold text-foreground/80 uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex gap-4">
                    <Link
                      href={`/projects/active-projects/${project.slug}`}
                      className="px-6 py-2 bg-primary text-background rounded-lg text-sm font-bold shadow-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                    >
                      View Details
                      <span className="material-symbols-outlined text-sm">
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}
