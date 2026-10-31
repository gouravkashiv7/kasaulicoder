import Link from "next/link";
import GlobalFooter from "@/components/layout/GlobalFooter";
import GlobalHeader from "@/components/layout/GlobalHeader";
import AuroraBackground from "@/components/ui/aurora-background";
import {
  Icon,
  primaryButton,
  SectionIntro,
  secondaryButton,
} from "@/components/ui/marketing";
import { serviceGroups } from "@/lib/services";

const enquirySteps = [
  {
    title: "Tell us what you need",
    desc: "Use the contact form to describe the product, website or process and choose the service it relates to.",
  },
  {
    title: "We discuss your requirements",
    desc: "We get back to you to ask questions, understand the constraints and talk through options.",
  },
  {
    title: "You receive a proposal",
    desc: "We scope the work to your requirements and send a proposal for you to review before anything starts.",
  },
];

export default function ServicesPage() {
  return (
    <div className="font-sans text-foreground antialiased overflow-x-hidden relative">
      <AuroraBackground />
      <GlobalHeader />

      <main className="relative z-10">
        {/* Intro */}
        <section className="relative px-4 sm:px-6 pt-36 sm:pt-44 pb-16 sm:pb-24">
          <div
            className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_60%_at_30%_50%,color-mix(in_oklab,var(--background)_75%,transparent)_0%,transparent_100%)]"
            aria-hidden="true"
          />
          <div className="relative max-w-7xl mx-auto">
            <p className="font-display text-base sm:text-lg font-semibold text-primary mb-5">
              Services
            </p>
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.02] text-balance max-w-4xl mb-8">
              Software, automation and infrastructure for your business
            </h1>
            <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed max-w-2xl mb-10">
              KasauliCoder designs, builds and supports software for businesses.
              Our work falls into four areas, and most projects combine more
              than one of them.
            </p>
            <nav aria-label="Service areas">
              <ul className="flex flex-wrap gap-3">
                {serviceGroups.map((group) => (
                  <li key={group.id}>
                    <a
                      href={`#${group.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-foreground/15 bg-background/60 backdrop-blur-md text-sm font-semibold text-foreground/85 hover:border-primary/60 hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      <Icon
                        name={group.icon}
                        className="text-primary text-lg"
                      />
                      {group.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>

        {/* Service groups */}
        <div className="px-4 sm:px-6 pb-12">
          <div className="max-w-7xl mx-auto flex flex-col gap-6 lg:gap-8">
            {serviceGroups.map((group) => (
              <section
                key={group.id}
                id={group.id}
                aria-labelledby={`${group.id}-heading`}
                className="scroll-mt-28 rounded-3xl border border-foreground/10 bg-background/85 backdrop-blur-md p-6 sm:p-10 lg:p-14"
              >
                <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
                  <div className="lg:col-span-5">
                    <span className="size-14 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center mb-6">
                      <Icon
                        name={group.icon}
                        className="text-primary text-3xl"
                      />
                    </span>
                    <h2
                      id={`${group.id}-heading`}
                      className="font-display text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-5"
                    >
                      {group.title}
                    </h2>
                    <p className="text-lg text-foreground/80 leading-relaxed mb-4">
                      {group.summary}
                    </p>
                    <p className="text-foreground/65 leading-relaxed mb-8">
                      {group.description}
                    </p>
                    <Link
                      href={`/contact?service=${group.id}`}
                      className={primaryButton}
                    >
                      Enquire about {group.title}
                    </Link>
                  </div>

                  <div className="lg:col-span-7 grid sm:grid-cols-2 gap-8 lg:gap-10">
                    <div>
                      <h3 className="font-display text-lg font-bold mb-4">
                        What we provide
                      </h3>
                      <ul className="space-y-3">
                        {group.includes.map((item) => (
                          <li
                            key={item}
                            className="flex gap-3 text-foreground/80 leading-relaxed"
                          >
                            <Icon
                              name="check"
                              className="text-primary text-xl leading-6 shrink-0"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold mb-4">
                        Useful when
                      </h3>
                      <ul className="space-y-3">
                        {group.needs.map((item) => (
                          <li
                            key={item}
                            className="border-l-2 border-primary/40 pl-4 text-foreground/70 leading-relaxed"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {group.note && (
                      <p className="sm:col-span-2 text-sm text-foreground/60 leading-relaxed border-t border-foreground/10 pt-6">
                        {group.note}
                      </p>
                    )}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* How to enquire */}
        <section
          aria-labelledby="enquire-heading"
          className="px-4 sm:px-6 py-20 sm:py-28"
        >
          <div className="max-w-7xl mx-auto">
            <SectionIntro
              id="enquire-heading"
              title="How to start a project with us"
              lead="There are no fixed packages. Every project is scoped to what you actually need."
            />
            <ol className="grid md:grid-cols-3 gap-x-10 gap-y-2 mb-14">
              {enquirySteps.map((step, i) => (
                <li
                  key={step.title}
                  className="border-t border-foreground/15 pt-6 pb-8"
                >
                  <span className="font-display text-sm font-bold text-primary">
                    Step {i + 1}
                  </span>
                  <h3 className="font-display text-xl font-bold mt-2 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-foreground/70 leading-relaxed">
                    {step.desc}
                  </p>
                </li>
              ))}
            </ol>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-sm sm:max-w-none">
              <Link href="/contact" className={primaryButton}>
                Discuss Your Project
              </Link>
              <Link href="/projects" className={secondaryButton}>
                View Our Projects
              </Link>
            </div>
          </div>
        </section>
      </main>

      <GlobalFooter />
    </div>
  );
}
