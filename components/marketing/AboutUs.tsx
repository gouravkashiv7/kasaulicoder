import Link from "next/link";
import HomeTeamWorkTestimonials from "@/components/home/HomeTeamWorkTestimonials";
import GlobalFooter from "@/components/layout/GlobalFooter";
import GlobalHeader from "@/components/layout/GlobalHeader";
import AuroraBackground from "@/components/ui/aurora-background";
import {
  Icon,
  primaryButton,
  SectionIntro,
  secondaryButton,
  textLink,
} from "@/components/ui/marketing";
import { serviceGroups } from "@/lib/services";

const approach = [
  {
    title: "Start with the business problem",
    desc: "Before choosing tools, we work out what the software has to achieve, who will use it and what it needs to connect to.",
  },
  {
    title: "Design for the people using it",
    desc: "Screens and flows are planned around real tasks, so customers and staff can use the product without a manual.",
  },
  {
    title: "Build to be maintained",
    desc: "Clear data models, typed code and sensible structure, so the software can be extended after the first release.",
  },
  {
    title: "Deploy and support",
    desc: "We set up hosting and deployment, and can stay on to maintain and support what we have built.",
  },
];

const AboutUs = ({ technologies }: { technologies: string[] }) => {
  return (
    <div className="font-sans text-foreground antialiased overflow-x-hidden relative">
      <AuroraBackground />
      <GlobalHeader />

      <main className="relative z-10">
        {/* Intro */}
        <section className="relative px-4 sm:px-6 pt-36 sm:pt-44 pb-20 sm:pb-28">
          <div
            className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_60%_at_30%_50%,color-mix(in_oklab,var(--background)_75%,transparent)_0%,transparent_100%)]"
            aria-hidden="true"
          />
          <div className="relative max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-16 items-end">
            <div className="lg:col-span-7">
              <p className="font-display text-base sm:text-lg font-semibold text-primary mb-5">
                About KasauliCoder
              </p>
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.02] text-balance">
                A SaaS and software product development company
              </h1>
            </div>
            <div className="lg:col-span-5 text-lg text-foreground/80 leading-relaxed space-y-5">
              <p>
                KasauliCoder designs, develops and supports software for
                businesses: SaaS products, custom web applications, business
                automation, SEO, and the cloud infrastructure they run on.
              </p>
              <p>
                The company takes its name from Kasauli, the hill town in
                Himachal Pradesh where it has its roots.
              </p>
            </div>
          </div>
        </section>

        {/* What we do */}
        <section
          aria-labelledby="capabilities-heading"
          className="px-4 sm:px-6 py-20 sm:py-28 bg-background/80 border-y border-foreground/5"
        >
          <div className="max-w-7xl mx-auto">
            <SectionIntro
              id="capabilities-heading"
              title="What we do"
              lead="Our software and digital capabilities, grouped the way businesses usually ask for them."
            />
            <ul className="grid sm:grid-cols-2 gap-x-10 lg:gap-x-14">
              {serviceGroups.map((group) => (
                <li
                  key={group.id}
                  className="flex gap-5 border-t border-foreground/15 pt-6 pb-10"
                >
                  <Icon
                    name={group.icon}
                    className="text-primary text-3xl shrink-0"
                  />
                  <div>
                    <h3 className="font-display text-xl font-bold mb-2">
                      {group.title}
                    </h3>
                    <p className="text-foreground/70 leading-relaxed mb-4">
                      {group.summary}
                    </p>
                    <Link
                      href={`/services#${group.id}`}
                      className={`${textLink} text-sm`}
                    >
                      Service details
                      <span className="sr-only">: {group.title}</span>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Approach */}
        <section
          aria-labelledby="approach-heading"
          className="px-4 sm:px-6 py-20 sm:py-28"
        >
          <div className="max-w-7xl mx-auto">
            <SectionIntro
              id="approach-heading"
              title="How we approach building products"
            />
            <ol className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {approach.map((item) => (
                <li
                  key={item.title}
                  className="rounded-3xl border border-foreground/10 bg-background/80 backdrop-blur-md p-7"
                >
                  <h3 className="font-display text-lg font-bold mb-3">
                    {item.title}
                  </h3>
                  <p className="text-foreground/70 leading-relaxed text-sm">
                    {item.desc}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Technology — derived from the tags on published projects */}
        {technologies.length > 0 && (
          <section
            aria-labelledby="technology-heading"
            className="px-4 sm:px-6 py-20 sm:py-28"
          >
            <div className="max-w-7xl mx-auto">
              <SectionIntro
                id="technology-heading"
                title="Technology we work with"
                lead="These are the frameworks, databases and platforms used in the projects in our portfolio."
              >
                <Link href="/projects" className={`${textLink} mt-4`}>
                  See the projects
                  <Icon name="arrow_forward" className="text-lg" />
                </Link>
              </SectionIntro>
              <ul className="flex flex-wrap gap-3">
                {technologies.map((tech) => (
                  <li
                    key={tech}
                    className="px-4 py-2 rounded-xl border border-foreground/15 bg-background/70 backdrop-blur-md text-sm font-semibold text-foreground/80"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <HomeTeamWorkTestimonials />

        {/* Working with us */}
        <section
          aria-labelledby="work-with-us-heading"
          className="px-4 sm:px-6 py-20 sm:py-28"
        >
          <div className="relative max-w-5xl mx-auto rounded-3xl border border-primary/25 bg-background/80 backdrop-blur-xl px-6 py-14 sm:p-16 text-center overflow-hidden">
            <div
              className="absolute inset-x-0 -top-px h-px bg-linear-to-r from-transparent via-primary to-transparent"
              aria-hidden="true"
            />
            <h2
              id="work-with-us-heading"
              className="font-display text-3xl sm:text-5xl font-black tracking-tight leading-[1.08] text-balance mb-6"
            >
              Working with KasauliCoder
            </h2>
            <p className="text-lg text-foreground/70 leading-relaxed max-w-2xl mx-auto mb-10">
              Send us your requirements through the contact form. We will
              discuss them with you and, if we are a good fit, send a proposal
              scoped to your project.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-sm sm:max-w-none mx-auto">
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
};

export default AboutUs;
