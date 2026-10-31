"use client";

import Link from "next/link";
import GlobalFooter from "@/components/layout/GlobalFooter";
import GlobalHeader from "@/components/layout/GlobalHeader";
import ASMRStaticBackground from "@/components/ui/asmr-background";
import {
  Icon,
  primaryButton,
  SectionIntro,
  secondaryButton,
} from "@/components/ui/marketing";
import { serviceGroups } from "@/lib/services";

const proposalNotes = [
  {
    icon: "flag",
    title: "Your goal",
    desc: "What you want to build or improve, and what it should achieve for your business.",
  },
  {
    icon: "group",
    title: "Who will use it",
    desc: "Your customers, your staff or both, and roughly how they will use it.",
  },
  {
    icon: "hub",
    title: "Your current setup",
    desc: "Any existing website, software or tools the new work needs to fit with.",
  },
  {
    icon: "event",
    title: "Budget and timing",
    desc: "An approximate budget and any dates that matter, if you have them. Both are optional.",
  },
];

const ProposalRequest = () => {
  return (
    <div className="bg-transparent text-foreground min-h-screen selection:bg-primary/30 font-sans overflow-x-hidden">
      <ASMRStaticBackground />
      <GlobalHeader />

      <main className="relative z-10 px-4 sm:px-6 pt-36 sm:pt-44 pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto">
          {/* Intro */}
          <section className="max-w-3xl mb-20 sm:mb-28">
            <p className="font-display text-base sm:text-lg font-semibold text-primary mb-5">
              Pricing
            </p>
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.02] mb-8">
              Request a Proposal
            </h1>
            <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed mb-10">
              We do not sell fixed packages. The cost and timeline of a project
              depend on what it needs to do, so we scope every project to your
              requirements and send you a proposal before any work begins.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-sm sm:max-w-none">
              <Link href="/contact" className={primaryButton}>
                Request a Proposal
              </Link>
              <Link href="/services" className={secondaryButton}>
                Explore Our Services
              </Link>
            </div>
          </section>

          {/* What to include */}
          <section aria-labelledby="include-heading" className="mb-20 sm:mb-28">
            <SectionIntro
              id="include-heading"
              title="What to include in your request"
              lead="The more we know at the start, the more useful our first reply and proposal will be."
            />
            <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {proposalNotes.map((note) => (
                <li
                  key={note.title}
                  className="rounded-3xl border border-foreground/10 bg-background/80 backdrop-blur-md p-7"
                >
                  <Icon
                    name={note.icon}
                    className="text-primary text-3xl mb-5 block"
                  />
                  <h3 className="font-display text-lg font-bold mb-2">
                    {note.title}
                  </h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    {note.desc}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* By service */}
          <section aria-labelledby="by-service-heading">
            <SectionIntro
              id="by-service-heading"
              title="Request a proposal for a specific service"
            />
            <ul className="grid md:grid-cols-2 gap-px rounded-3xl overflow-hidden border border-foreground/10 bg-foreground/10">
              {serviceGroups.map((group) => (
                <li key={group.id} className="bg-background/90">
                  <Link
                    href={`/contact?service=${group.id}`}
                    className="group flex items-start gap-5 p-7 sm:p-8 h-full hover:bg-foreground/5 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
                  >
                    <Icon
                      name={group.icon}
                      className="text-primary text-3xl shrink-0"
                    />
                    <span className="flex-1">
                      <span className="block font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {group.title}
                      </span>
                      <span className="block text-foreground/70 leading-relaxed">
                        {group.summary}
                      </span>
                    </span>
                    <Icon
                      name="arrow_forward"
                      className="text-foreground/40 group-hover:text-primary transition-colors mt-1"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      <div className="relative z-10">
        <GlobalFooter />
      </div>
    </div>
  );
};

export default ProposalRequest;
