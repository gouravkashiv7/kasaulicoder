import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";
import connectDB from "@/backend/lib/db";
import Project from "@/backend/models/Project";
import { Metadata } from "next";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  await connectDB();

  const project = await Project.findOne({
    slug: params.slug,
    status: "past",
  });

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
        project.images && project.images.length > 0 ? [project.images[0]] : [],
    },
  };
}

export default async function RecentProjectPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  await connectDB();

  // Find the exact project via slug and past status
  const project = await Project.findOne({
    slug: params.slug,
    status: "past",
  }).populate("members", "name image designation");

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

          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-white/10 text-foreground/80 rounded-full text-xs font-black uppercase tracking-widest border border-white/20">
                Completed Project
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

            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight text-foreground">
              {project.title}
            </h1>
            <p className="text-xl md:text-2xl text-foreground/60 font-bold italic">
              {project.outcome}
            </p>
          </header>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {project.images && project.images.length > 0 && (
                <div className="w-full aspect-video relative rounded-2xl overflow-hidden shadow-2xl border border-white/5 grayscale saturate-50 hover:grayscale-0 hover:saturate-100 transition-all duration-700">
                  <Image
                    src={project.images[0]}
                    fill
                    className="object-cover"
                    alt={project.title}
                  />
                </div>
              )}

              <div className="prose prose-invert max-w-none prose-p:text-foreground/70 prose-headings:text-foreground prose-a:text-primary">
                <h3 className="text-2xl font-bold mb-4">Case Study</h3>
                <p className="text-lg leading-relaxed">{project.desc}</p>

                {project.content && (
                  <div className="mt-8 whitespace-pre-wrap">
                    {project.content}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl opacity-90 hover:opacity-100 transition-opacity">
                <h4 className="text-sm font-black text-foreground/50 uppercase tracking-widest mb-6">
                  Team Members Who Worked On It
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
                    Team members not specified.
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
                      className="w-full py-4 rounded-xl bg-white text-black font-black flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
                    >
                      <span className="material-symbols-outlined">
                        open_in_new
                      </span>
                      Visit Project
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
                      Source Code
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
