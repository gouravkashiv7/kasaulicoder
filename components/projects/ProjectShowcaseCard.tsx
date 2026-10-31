import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/marketing";
import { displayHost, projectPath, type ShowcaseProject } from "@/lib/projects";

interface Props {
  project: ShowcaseProject;
  // "large" puts the screenshot beside the text on wide screens.
  variant?: "large" | "default";
  headingLevel?: "h2" | "h3";
  priority?: boolean;
}

// A project shown with its real application screenshot inside a browser frame.
export default function ProjectShowcaseCard({
  project,
  variant = "default",
  headingLevel: Heading = "h3",
  priority = false,
}: Props) {
  const large = variant === "large";
  const href = projectPath(project);
  const host = project.liveUrl ? displayHost(project.liveUrl) : undefined;

  return (
    <article
      className={`group relative min-w-0 rounded-3xl border border-foreground/10 bg-background/70 backdrop-blur-md p-3 sm:p-4 transition-colors duration-300 hover:border-primary/40 ${
        large
          ? "lg:grid lg:grid-cols-12 lg:gap-10 lg:items-center"
          : "flex flex-col"
      }`}
    >
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className={`block overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5 ${
          large ? "lg:col-span-7" : ""
        }`}
      >
        <div className="flex items-center gap-3 px-4 h-9 border-b border-foreground/10 bg-background/80">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-foreground/20" />
            <span className="size-2.5 rounded-full bg-foreground/20" />
            <span className="size-2.5 rounded-full bg-foreground/20" />
          </span>
          <span className="flex-1 min-w-0 truncate text-center text-xs text-foreground/50 font-medium pr-10">
            {host ?? project.title}
          </span>
        </div>
        <div className="relative aspect-16/10 overflow-hidden">
          <Image
            src={project.image}
            alt={`Screenshot of ${project.title}`}
            fill
            priority={priority}
            sizes={
              large
                ? "(min-width: 1280px) 720px, (min-width: 1024px) 58vw, 100vw"
                : "(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw"
            }
            className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        </div>
      </Link>

      <div
        className={`flex flex-col px-2 sm:px-3 pt-6 pb-3 ${
          large ? "lg:col-span-5 lg:pt-0 lg:pr-6" : "flex-1"
        }`}
      >
        <p className="text-sm font-semibold text-foreground/50 mb-2">
          {project.status === "active" ? "In development" : "Completed project"}
        </p>
        <Heading
          className={`font-display font-black tracking-tight text-foreground leading-tight mb-3 ${
            large ? "text-2xl sm:text-3xl lg:text-4xl" : "text-2xl"
          }`}
        >
          <Link
            href={href}
            className="hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary rounded"
          >
            {project.title}
          </Link>
        </Heading>
        <p
          className={`text-foreground/70 leading-relaxed mb-5 ${
            large ? "text-base sm:text-lg" : ""
          }`}
        >
          {project.desc}
        </p>
        {project.tags.length > 0 && (
          <ul className="flex flex-wrap gap-2 mb-6" aria-label="Technologies">
            {project.tags.slice(0, large ? 7 : 5).map((tag) => (
              <li
                key={tag}
                className="px-2.5 py-1 rounded-md border border-foreground/10 bg-foreground/5 text-xs font-semibold text-foreground/70"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-5 border-t border-foreground/10">
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded"
          >
            Project details
            <span className="sr-only">: {project.title}</span>
          </Link>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded"
            >
              {host}
              <Icon name="open_in_new" className="text-base" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
