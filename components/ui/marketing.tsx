import type { ReactNode } from "react";

// Shared building blocks for the public marketing pages.

export const primaryButton =
  "inline-flex w-full sm:w-auto items-center justify-center gap-2 px-7 py-3.5 bg-primary text-primary-content font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/35 hover:brightness-110 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export const secondaryButton =
  "inline-flex w-full sm:w-auto items-center justify-center gap-2 px-7 py-3.5 bg-background/60 border border-foreground/20 text-foreground font-bold rounded-xl backdrop-blur-md hover:border-primary/60 hover:bg-foreground/5 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export const textLink =
  "inline-flex items-center gap-1.5 font-semibold text-primary underline-offset-4 decoration-primary/40 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded";

export function Icon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

// Left-aligned section heading with an optional lead paragraph beside it.
export function SectionIntro({
  title,
  lead,
  id,
  children,
}: {
  title: ReactNode;
  lead?: ReactNode;
  id?: string;
  children?: ReactNode;
}) {
  return (
    <div className="grid lg:grid-cols-12 gap-5 lg:gap-12 lg:items-end mb-12 lg:mb-16">
      <h2
        id={id}
        className="lg:col-span-7 font-display text-3xl sm:text-4xl lg:text-[3.25rem] font-black tracking-tight leading-[1.08] text-balance text-foreground"
      >
        {title}
      </h2>
      {(lead || children) && (
        <div className="lg:col-span-5 text-base sm:text-lg text-foreground/70 leading-relaxed max-w-xl">
          {lead && <p>{lead}</p>}
          {children}
        </div>
      )}
    </div>
  );
}
