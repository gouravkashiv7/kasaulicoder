import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { ProjectDetailData } from "@/backend/lib/showcase";
import GlobalFooter from "@/components/layout/GlobalFooter";
import GlobalHeader from "@/components/layout/GlobalHeader";
import {
  Icon,
  primaryButton,
  secondaryButton,
  textLink,
} from "@/components/ui/marketing";
import { ProjectMediaDisplay } from "@/components/ui/ProjectMediaDisplay";
import { displayHost } from "@/lib/projects";

// Renders the plain-text case study stored on a project. Blank lines separate
// blocks, "- " lines become lists, "Label: text" lines get a bold label and a
// line ending in ":" becomes a subheading.
function CaseStudy({ content }: { content: string }) {
  const blocks = content
    .split(/\n\s*\n/)
    .map((block) => block.split("\n").map((line) => line.trim()))
    .map((lines) => lines.filter(Boolean))
    .filter((lines) => lines.length > 0);

  const nodes: ReactNode[] = [];
  blocks.forEach((lines, b) => {
    let list: string[] = [];
    const flushList = (key: string) => {
      if (list.length === 0) return;
      nodes.push(
        <ul key={key} className="space-y-3 mb-8">
          {list.map((item) => (
            <li key={item} className="flex gap-3">
              <span
                className="mt-2.5 size-1.5 rounded-full bg-primary shrink-0"
                aria-hidden="true"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>,
      );
      list = [];
    };

    lines.forEach((line, l) => {
      const key = `${b}-${l}`;
      if (line.startsWith("- ")) {
        list.push(line.slice(2));
        return;
      }
      flushList(`list-${key}`);
      if (line.endsWith(":")) {
        nodes.push(
          <h3
            key={key}
            className="font-display text-xl font-bold text-foreground mt-10 mb-4"
          >
            {line.slice(0, -1)}
          </h3>,
        );
        return;
      }
      const labelled = line.match(/^([A-Z][A-Za-z ]{1,28}):\s+(.+)$/);
      if (labelled) {
        nodes.push(
          <p key={key} className="mb-5">
            <strong className="font-display font-bold text-foreground">
              {labelled[1]}:
            </strong>{" "}
            {labelled[2]}
          </p>,
        );
        return;
      }
      nodes.push(
        <p key={key} className="mb-5">
          {line}
        </p>,
      );
    });
    flushList(`list-${b}-end`);
  });

  return (
    <div className="text-lg text-foreground/75 leading-relaxed">{nodes}</div>
  );
}

export default function ProjectDetail({
  project,
}: {
  project: ProjectDetailData;
}) {
  const statusLabel =
    project.status === "active" ? "In development" : "Completed project";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col overflow-x-hidden">
      <GlobalHeader />

      <main className="grow px-4 sm:px-6 pt-32 sm:pt-40 pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto">
          <Link href="/projects" className={`${textLink} mb-10 text-sm`}>
            <Icon name="arrow_back" className="text-lg" />
            All projects
          </Link>

          <header className="grid lg:grid-cols-12 gap-8 lg:gap-12 lg:items-end mb-12">
            <div className="lg:col-span-7">
              <p className="font-display text-base sm:text-lg font-semibold text-primary mb-4">
                {statusLabel}
              </p>
              <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight leading-[1.04] text-balance mb-6">
                {project.title}
              </h1>
              <p className="text-lg sm:text-xl text-foreground/75 leading-relaxed max-w-2xl">
                {project.desc}
              </p>
            </div>
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:justify-end gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={primaryButton}
                >
                  Visit {displayHost(project.liveUrl)}
                  <Icon name="open_in_new" className="text-lg" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
              {project.videoUrl && (
                <a
                  href={project.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={secondaryButton}
                >
                  Watch demo video
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
            </div>
          </header>

          <ProjectMediaDisplay
            media={project.media}
            liveUrl={project.liveUrl}
            title={project.title}
            aspectRatio="aspect-video"
            className="shadow-2xl mb-16 sm:mb-20"
          />

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            <article className="lg:col-span-8 max-w-3xl">
              <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight mb-8">
                Project overview
              </h2>
              {project.outcome && (
                <p className="text-lg sm:text-xl text-foreground leading-relaxed border-l-2 border-primary pl-5 mb-10">
                  {project.outcome}
                </p>
              )}
              {project.content ? (
                <CaseStudy content={project.content} />
              ) : (
                <p className="text-lg text-foreground/75 leading-relaxed">
                  {project.desc}
                </p>
              )}
            </article>

            <aside className="lg:col-span-4 flex flex-col gap-10">
              {project.tags.length > 0 && (
                <section aria-labelledby="tech-heading">
                  <h2
                    id="tech-heading"
                    className="font-display text-lg font-bold mb-4"
                  >
                    Technology
                  </h2>
                  <ul className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <li
                        key={tag}
                        className="px-3 py-1.5 rounded-lg border border-foreground/10 bg-foreground/5 text-sm font-semibold text-foreground/80"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {project.members.length > 0 && (
                <section aria-labelledby="team-heading">
                  <h2
                    id="team-heading"
                    className="font-display text-lg font-bold mb-4"
                  >
                    Team
                  </h2>
                  <ul className="space-y-4">
                    {project.members.map((member) => (
                      <li key={member._id} className="flex items-center gap-4">
                        <div className="size-12 rounded-full bg-foreground/10 relative overflow-hidden border border-foreground/10 shrink-0 flex items-center justify-center">
                          {member.image ? (
                            <Image
                              src={member.image}
                              alt=""
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="font-display font-bold text-foreground/50 uppercase">
                              {member.name.substring(0, 2)}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">
                            {member.name}
                          </p>
                          {member.designation && (
                            <p className="text-sm text-foreground/60">
                              {member.designation}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {(project.liveUrl || project.githubUrl) && (
                <section aria-labelledby="links-heading">
                  <h2
                    id="links-heading"
                    className="font-display text-lg font-bold mb-4"
                  >
                    Links
                  </h2>
                  <ul className="space-y-3">
                    {project.liveUrl && (
                      <li>
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={textLink}
                        >
                          Live site: {displayHost(project.liveUrl)}
                          <Icon name="open_in_new" className="text-base" />
                        </a>
                      </li>
                    )}
                    {project.githubUrl && (
                      <li>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={textLink}
                        >
                          Source code on GitHub
                          <Icon name="open_in_new" className="text-base" />
                        </a>
                      </li>
                    )}
                  </ul>
                </section>
              )}

              <section className="rounded-3xl border border-primary/25 bg-primary/5 p-7">
                <h2 className="font-display text-xl font-bold mb-3">
                  Planning something similar?
                </h2>
                <p className="text-foreground/70 leading-relaxed mb-6">
                  Tell us about your project and we will get back to you to
                  discuss it.
                </p>
                <Link href="/contact" className={primaryButton}>
                  Discuss Your Project
                </Link>
              </section>
            </aside>
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}
