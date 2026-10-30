"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import GlobalFooter from "@/components/layout/GlobalFooter";
import GlobalHeader from "@/components/layout/GlobalHeader";
import ASMRStaticBackground from "@/components/ui/asmr-background";

const proposalNotes = [
  {
    icon: "flag",
    title: "Your goal",
    desc: "What you want to build or improve, and what it should achieve for your business.",
  },
  {
    icon: "checklist",
    title: "The services you need",
    desc: "Software development, automation, SEO, UI/UX and web, cloud infrastructure or ongoing support.",
  },
  {
    icon: "hub",
    title: "Your current setup",
    desc: "Any existing website, software or tools the new work needs to fit with.",
  },
];

const ProposalRequest = () => {
  return (
    <div className="bg-transparent text-foreground min-h-screen selection:bg-primary/30 font-display">
      <div className="relative overflow-x-hidden">
        <ASMRStaticBackground />

        <div className="layout-container flex h-full grow flex-col relative z-10">
          <GlobalHeader />

          <main className="flex-1 max-w-5xl mx-auto w-full px-6 pt-32 pb-12 md:pb-24">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h1 className="text-3xl md:text-5xl font-black text-foreground mb-5">
                Request a{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary italic">
                  Proposal
                </span>
              </h1>
              <p className="text-foreground/70 text-lg max-w-2xl mx-auto leading-relaxed">
                Every project is different, so we scope work to your
                requirements rather than selling fixed packages. Tell us about
                your project and request a proposal.
              </p>
            </motion.section>

            <section className="mb-16">
              <h2 className="text-center text-sm font-bold text-primary uppercase tracking-[0.3em] mb-8">
                What to tell us
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {proposalNotes.map((note, i) => (
                  <motion.div
                    key={note.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i }}
                    className="glass-card rounded-2xl p-7 border border-foreground/10"
                  >
                    <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                      <span
                        className="material-symbols-outlined text-primary text-2xl"
                        aria-hidden="true"
                      >
                        {note.icon}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{note.title}</h3>
                    <p className="text-sm text-foreground/70 leading-relaxed">
                      {note.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>

            <div className="text-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-primary to-secondary text-background font-black rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                Request a Proposal
                <span
                  className="material-symbols-outlined text-xl"
                  aria-hidden="true"
                >
                  arrow_forward
                </span>
              </Link>
            </div>
          </main>

          <GlobalFooter />
        </div>
      </div>
    </div>
  );
};

export default ProposalRequest;
