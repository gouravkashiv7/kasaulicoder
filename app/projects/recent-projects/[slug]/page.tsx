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
    status: "past",
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
    title: `${project.title} | Case Study | Kasauli Coder`,
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

export default async function RecentProjectPage(props: {
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
            className="inline-flex items-center gap-2 text-foreground/50 font-bold hover:text-foreground transition-colors mb-8"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Home
          </Link>

          <header className="mb-16 text-center">
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <span className="px-3 py-1 bg-white/10 text-foreground/80 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                Completed Project
              </span>
              {project.tags?.map((tag: string) => (
                <span
                  key={tag}
                  className="text-[10px] font-black uppercase text-foreground/40 bg-white/5 px-2 py-1 rounded border border-white/5"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter text-foreground max-w-4xl mx-auto leading-[0.9]">
              {project.title}
            </h1>
            <p className="text-xl md:text-2xl text-foreground/50 font-bold italic max-w-2xl mx-auto">
              {project.outcome}
            </p>
          </header>

          <div className="grid lg:grid-cols-3 gap-8 items-stretch mb-20">
            <div className="lg:col-span-2">
              <ProjectMediaDisplay
                media={project.media || []}
                liveUrl={project.liveUrl}
                title={project.title}
                aspectRatio="aspect-video"
                className="h-full shadow-2xl"
              />
            </div>

            <div className="flex flex-col gap-6 h-full">
              <div className="flex-1 bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col justify-center backdrop-blur-sm">
                <h4 className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] mb-8 text-center">
                  Team Members Who Worked On It
                </h4>
                {project.members && project.members.length > 0 ? (
                  <div className="space-y-6">
                    {project.members.map((member: any) => (
                      <div key={member._id} className="flex flex-col items-center text-center group">
                        <div className="size-16 rounded-full bg-foreground/10 relative overflow-hidden border-2 border-white/10 mb-3 group-hover:border-primary/50 transition-colors">
                          {member.image ? (
                            <Image
                              src={member.image}
                              alt={member.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-black text-xl uppercase text-foreground/20">
                              {member.name.substring(0, 2)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-foreground text-base tracking-tight leading-none mb-1">
                            {member.name}
                          </p>
                          {member.designation && (
                            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                              {member.designation}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-foreground/30 italic text-center">
                    Project contributors remains confidential.
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
                      className="w-full py-4 rounded-xl bg-white text-black font-black flex items-center justify-center gap-2 hover:bg-white/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span className="material-symbols-outlined">smart_display</span>
                      Watch Demo Video
                    </a>
                  )}
                  {project.liveUrl && project.liveUrl !== "#" && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 rounded-xl bg-primary text-primary-content font-black flex items-center justify-center gap-2 hover:brightness-110 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span className="material-symbols-outlined">open_in_new</span>
                      Visit Project
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="prose prose-invert max-w-none text-center prose-p:text-xl prose-p:leading-relaxed prose-p:text-foreground/70 prose-headings:text-foreground prose-headings:font-black prose-headings:tracking-tighter prose-strong:text-foreground">
              <h3 className="text-3xl md:text-5xl font-black mb-10 tracking-tighter">
                The Case Study
              </h3>
              <div className="space-y-8 bg-white/5 border border-white/10 p-10 md:p-16 rounded-[2.5rem] backdrop-blur-md">
                <p>{project.desc}</p>

                {project.content && (
                  <div className="mt-12 text-left whitespace-pre-wrap font-medium border-t border-white/10 pt-12 opacity-80 italic">
                    {project.content}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}
