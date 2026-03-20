import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ProjectMediaDisplay } from "@/components/ui/ProjectMediaDisplay";
import { notFound } from "next/navigation";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";
import connectDB from "@/backend/lib/db";
import Project from "@/backend/models/Project";
import "@/backend/models/Staff"; // Ensure Staff schema is registered for populate
import { Metadata } from "next";

export const dynamic = "force-dynamic";

/** Fetch project data once to be shared by metadata and the page */
async function getProject(slug: string) {
  await connectDB();
  const rawProject = await Project.findOne({
    slug: slug,
    status: "active",
  })
    .populate("members", "name image designation")
    .lean();

  if (!rawProject) return null;
  return JSON.parse(JSON.stringify(rawProject));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: "Project Not Found | Kasauli Coder",
    };
  }

  return {
    title: `${project.title} | Active Project | Kasauli Coder`,
    description: project.outcome || project.desc?.substring(0, 160),
    openGraph: {
      title: project.title,
      description: project.outcome || project.desc?.substring(0, 160),
      images:
        project.media && project.media.length > 0 
          ? [project.media[0].url] 
          : [],
    },
  };
}

export default async function ActiveProjectPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-display flex flex-col">
      <GlobalHeader />

      <main className="grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary font-bold hover:underline mb-8"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Home
          </Link>

          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-black uppercase tracking-widest animate-pulse border border-primary/30">
                In Progress (Active)
              </span>
              {project.tags?.map((tag: string) => (
                <span
                  key={tag}
                  className="text-xs font-bold text-foreground/60 bg-white/5 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
              {project.title}
            </h1>
            <p className="text-xl md:text-2xl text-primary font-bold italic">
              {project.outcome}
            </p>
          </header>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <div className="w-full">
                <ProjectMediaDisplay
                  media={project.media || []}
                  liveUrl={project.liveUrl}
                  title={project.title}
                  aspectRatio="aspect-video"
                />
              </div>

              <div className="prose prose-invert max-w-none prose-p:text-foreground/70 prose-headings:text-foreground prose-a:text-primary">
                <h3 className="text-2xl font-bold mb-4">Project Overview</h3>
                <p className="text-lg leading-relaxed">{project.desc}</p>

                {project.content && (
                  <div className="mt-8 whitespace-pre-wrap">
                    {project.content}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <h4 className="text-sm font-black text-foreground/50 uppercase tracking-widest mb-6">
                  Team Members Working on It
                </h4>
                {project.members && project.members.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {project.members.map((member: any) => (
                      <div key={member._id} className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-foreground/10 relative overflow-hidden border border-white/10">
                          {member.image ? (
                            <Image
                              src={member.image}
                              alt={member.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-xs uppercase text-foreground/40">
                              {member.name.substring(0, 2)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-sm leading-none">
                            {member.name}
                          </p>
                          {member.designation && (
                            <p className="text-xs text-foreground/50 mt-1">
                              {member.designation}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-foreground/50 italic">
                    Team assignment pending.
                  </p>
                )}
              </div>

              {((project.githubUrl && project.githubUrl !== "#") ||
                (project.liveUrl && project.liveUrl !== "#") ||
                (project.videoUrl && project.videoUrl !== "#")) && (
                <div className="flex flex-col gap-3">
                  {project.videoUrl && project.videoUrl !== "#" && (
                    <a
                      href={project.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 rounded-xl bg-white text-black font-black flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
                    >
                      <span className="material-symbols-outlined">
                        smart_display
                      </span>
                      Watch Demo Video
                    </a>
                  )}
                  {project.liveUrl && project.liveUrl !== "#" && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 rounded-xl bg-primary text-background font-black flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                    >
                      <span className="material-symbols-outlined">
                        open_in_new
                      </span>
                      View Live Version
                    </a>
                  )}
                  {project.githubUrl && project.githubUrl !== "#" && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-foreground font-black flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                    >
                      <span className="material-symbols-outlined">code</span>
                      View Source Code
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}
