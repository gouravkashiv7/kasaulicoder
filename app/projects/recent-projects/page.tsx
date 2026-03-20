import React from "react";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ProjectMediaDisplay } from "@/components/ui/ProjectMediaDisplay";
import connectDB from "@/backend/lib/db";
import Project from "@/backend/models/Project";

export const metadata: Metadata = {
  title: "Recent Projects",
  description:
    "Browse our past success stories and completed digital architectures.",
};

export default async function RecentProjects() {
  await connectDB();
  const projects = await Project.find({ status: "past" }).sort({
    createdAt: -1,
  });

  return (
    <div className="relative bg-background text-foreground font-sans min-h-screen flex flex-col">
      <GlobalHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-32 sm:pt-40 pb-20">
        <div className="mb-16">
          <div className="flex mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 text-foreground/70 text-[11px] font-bold tracking-[0.2em] uppercase">
              Past Work
            </div>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black mb-6 tracking-tight">
            Recent Case <span className="text-foreground/50">Studies</span>
          </h1>
          <p className="text-foreground/60 max-w-2xl text-xl leading-relaxed">
            Review the proven high-performance solutions we have previously
            engineered and shipped to our clients.
          </p>
        </div>

        <div className="grid gap-8">
          {projects.length === 0 ? (
            <div className="text-center py-20 text-foreground/40 font-bold border border-foreground/10 bg-foreground/5 rounded-3xl">
              No recent projects at the moment.
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project._id.toString()}
                className="grid lg:grid-cols-2 gap-8 items-center border border-foreground/10 bg-foreground/5 rounded-3xl p-6 sm:p-10 hover:border-foreground/20 transition-colors"
              >
                <div className="order-2 lg:order-1 flex flex-col gap-4">
                  <h3 className="text-2xl sm:text-3xl font-black text-foreground">
                    {project.title}
                  </h3>
                  <p className="text-lg font-bold text-foreground/80 italic">
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
                  <div className="mt-6">
                    <Link
                      href={`/projects/recent-projects/${project.slug}`}
                      className="inline-block px-6 py-2 bg-foreground text-background border border-transparent hover:bg-foreground/80 rounded-lg text-sm font-bold transition-colors"
                    >
                      Read Case Study
                    </Link>
                  </div>
                </div>

                <div className="order-1 lg:order-2 w-full">
                  <ProjectMediaDisplay
                    media={project.media || []}
                    liveUrl={project.liveUrl}
                    title={project.title}
                    aspectRatio="aspect-video"
                  />
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
