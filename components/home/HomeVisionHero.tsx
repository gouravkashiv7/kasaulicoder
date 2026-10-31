"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import HomeTeamWorkTestimonials from "@/components/home/HomeTeamWorkTestimonials";
import GlobalFooter from "@/components/layout/GlobalFooter";
import GlobalHeader from "@/components/layout/GlobalHeader";
import ProjectShowcaseCard from "@/components/projects/ProjectShowcaseCard";
import {
  Icon,
  primaryButton,
  SectionIntro,
  secondaryButton,
  textLink,
} from "@/components/ui/marketing";
import type { ShowcaseProject } from "@/lib/projects";
import { serviceGroups } from "@/lib/services";

const AnoAI = dynamic(
  () => import("@/components/ui/animated-shader-background"),
  { ssr: false },
);

// Heavy decoration (WebGL background, brand video) waits until the page has
// loaded and the browser is idle, so it never competes with first paint.
const useAfterLoad = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;
    const start = () => {
      const run = () => {
        if (!cancelled) setReady(true);
      };
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(run, { timeout: 2000 });
      } else {
        setTimeout(run, 200);
      }
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", start);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
    };
  }, []);
  return ready;
};

const businessHelp = [
  {
    need: "A product or internal system built",
    answer:
      "SaaS products, custom web applications and platforms, designed around how your business and customers work.",
    service: "product-engineering",
  },
  {
    need: "Less manual, repetitive work",
    answer:
      "Automations and integrations so data is entered once and routine steps run without someone chasing them.",
    service: "business-automation",
  },
  {
    need: "To be found and chosen online",
    answer:
      "A faster, clearer website that search engines can read properly and visitors can act on.",
    service: "seo-digital-growth",
  },
  {
    need: "Software that keeps running",
    answer:
      "Hosting, deployment and technical support once your software is live.",
    service: "cloud-support",
  },
];

const strengths = [
  {
    title: "Business-focused development",
    desc: "We start from what the software has to do for your business, then choose the technology that fits it.",
  },
  {
    title: "Modern technology",
    desc: "Our projects are built with current, well-supported tools such as Next.js, React, Node.js, TypeScript and MongoDB.",
  },
  {
    title: "Thoughtful product design",
    desc: "Interfaces planned around the people who use them, and built to work on desktop, tablet and mobile.",
  },
  {
    title: "Scalable architecture",
    desc: "Code and data structured so the software can take on more users, locations and features later.",
  },
  {
    title: "Transparent communication",
    desc: "We keep you informed about progress and about any decision that affects scope, cost or timing.",
  },
  {
    title: "Technical support",
    desc: "We can stay on after launch to maintain, update and support the software we build.",
  },
];

// Hero copy stays visible before hydration (it is the LCP); only the slide-in animates.
const heroContainer = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const heroItem = {
  hidden: { opacity: 1, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const HomeVisionHero = ({
  projects = [],
}: {
  projects?: ShowcaseProject[];
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const afterLoad = useAfterLoad();
  // The full-screen shader is too costly for phones, so only larger screens get it.
  const [showBackground, setShowBackground] = useState(false);
  useEffect(() => {
    if (afterLoad) {
      setShowBackground(window.matchMedia("(min-width: 768px)").matches);
    }
  }, [afterLoad]);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const [leadProject, ...otherProjects] = projects;

  return (
    <div className="font-sans text-foreground antialiased overflow-x-hidden relative">
      {showBackground && (
        <Suspense fallback={null}>
          <AnoAI />
        </Suspense>
      )}
      <GlobalHeader />

      <main className="relative z-10">
        {/* Hero */}
        <section className="relative min-h-svh flex items-center px-4 sm:px-6 pt-32 pb-20">
          {/* Localized scrim keeps the copy readable over the aurora */}
          <div
            className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_55%_at_50%_50%,color-mix(in_oklab,var(--background)_78%,transparent)_0%,transparent_100%)]"
            aria-hidden="true"
          />
          <motion.div
            variants={heroContainer}
            initial="hidden"
            animate="visible"
            className="relative max-w-5xl mx-auto text-center"
          >
            <motion.p
              variants={heroItem}
              className="font-display text-base sm:text-lg font-semibold text-primary mb-6"
            >
              SaaS &amp; software product development
            </motion.p>
            <motion.h1
              variants={heroItem}
              className="font-display text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.98] text-balance text-foreground mb-8"
            >
              SaaS Solutions that{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                Drive Growth
              </span>
            </motion.h1>
            <motion.p
              variants={heroItem}
              className="text-lg sm:text-xl text-foreground/80 leading-relaxed max-w-2xl mx-auto mb-10 text-pretty"
            >
              We design and develop SaaS products, custom software, and modern
              digital solutions. From business automation and SEO to cloud
              infrastructure, we help businesses build and improve their digital
              presence.
            </motion.p>
            <motion.div
              variants={heroItem}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-sm sm:max-w-none mx-auto"
            >
              <Link href="/contact" className={primaryButton}>
                Discuss a Project
              </Link>
              <Link href="/services" className={secondaryButton}>
                Explore Our Services
              </Link>
            </motion.div>
            <motion.div variants={heroItem} className="mt-7">
              <Link href="/projects" className={textLink}>
                View Our Projects
                <Icon name="arrow_forward" className="text-lg" />
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Services */}
        <section
          id="services"
          aria-labelledby="services-heading"
          className="px-4 sm:px-6 py-20 sm:py-28 scroll-mt-24"
        >
          <div className="max-w-7xl mx-auto">
            <SectionIntro
              id="services-heading"
              title="Four ways we help businesses build with software"
              lead="Each engagement draws on one or more of these capabilities, delivered by the same team so design, development and infrastructure fit together."
            />

            <div className="grid md:grid-cols-2 gap-px rounded-3xl overflow-hidden border border-foreground/10 bg-foreground/10">
              {serviceGroups.map((group) => (
                <div
                  key={group.id}
                  className="flex flex-col p-7 sm:p-10 bg-background/85 backdrop-blur-md"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <span className="size-12 shrink-0 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center">
                      <Icon
                        name={group.icon}
                        className="text-primary text-2xl"
                      />
                    </span>
                    <h3 className="font-display text-2xl font-bold tracking-tight text-foreground">
                      {group.title}
                    </h3>
                  </div>
                  <p className="text-foreground/75 leading-relaxed mb-6">
                    {group.summary}
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 mb-8 text-sm text-foreground/70">
                    {group.includes.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <Icon
                          name="check"
                          className="text-primary text-lg leading-5 shrink-0"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services#${group.id}`}
                    className={`${textLink} mt-auto text-sm`}
                  >
                    {group.title} in detail
                    <Icon name="arrow_forward" className="text-base" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How We Help Businesses */}
        <section
          aria-labelledby="help-heading"
          className="px-4 sm:px-6 py-20 sm:py-28"
        >
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6">
              <h2
                id="help-heading"
                className="font-display text-3xl sm:text-4xl lg:text-[3.25rem] font-black tracking-tight leading-[1.08] text-balance mb-6"
              >
                How we help businesses
              </h2>
              <p className="text-lg text-foreground/70 leading-relaxed mb-10 max-w-xl">
                Most requests start with a business problem rather than a
                technology. These are the ones we are asked to solve most often.
              </p>
              <dl className="divide-y divide-foreground/10 border-y border-foreground/10">
                {businessHelp.map((item) => (
                  <div
                    key={item.need}
                    className="grid sm:grid-cols-5 gap-2 sm:gap-6 py-5"
                  >
                    <dt className="sm:col-span-2 font-display font-bold text-foreground">
                      {item.need}
                    </dt>
                    <dd className="sm:col-span-3 text-sm text-foreground/70 leading-relaxed">
                      {item.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="rounded-3xl p-2 sm:p-3 border border-foreground/10 bg-background/70 backdrop-blur-md">
                <div className="aspect-video rounded-2xl overflow-hidden relative group/video">
                  <video
                    ref={videoRef}
                    src={afterLoad ? "/kasaulicoder.mp4" : undefined}
                    autoPlay
                    muted={isMuted}
                    loop
                    playsInline
                    preload="metadata"
                    aria-label="KasauliCoder brand video"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-100 md:opacity-0 md:group-hover/video:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="size-10 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center hover:bg-black/70 transition-colors focus-visible:outline-2 focus-visible:outline-primary"
                      aria-label={isPlaying ? "Pause video" : "Play video"}
                    >
                      <Icon
                        name={isPlaying ? "pause" : "play_arrow"}
                        className="text-white text-xl leading-none"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="size-10 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center hover:bg-black/70 transition-colors focus-visible:outline-2 focus-visible:outline-primary"
                      aria-label={isMuted ? "Unmute video" : "Mute video"}
                    >
                      <Icon
                        name={isMuted ? "volume_off" : "volume_up"}
                        className="text-white text-xl leading-none"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects — only genuine projects with screenshots */}
        {leadProject && (
          <section
            id="projects"
            aria-labelledby="projects-heading"
            className="px-4 sm:px-6 py-20 sm:py-28 scroll-mt-24"
          >
            <div className="max-w-7xl mx-auto">
              <SectionIntro
                id="projects-heading"
                title="Featured projects"
                lead="Software we have designed, built and deployed. The screenshots are taken from the applications themselves."
              />
              <div className="flex flex-col gap-6 lg:gap-8">
                <ProjectShowcaseCard project={leadProject} variant="large" />
                {otherProjects.length > 0 && (
                  <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                    {otherProjects.map((project) => (
                      <ProjectShowcaseCard
                        key={project._id}
                        project={project}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-12 flex justify-center">
                <Link href="/projects" className={secondaryButton}>
                  View All Projects
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Why KasauliCoder — on a darker band so text stays readable over the aurora */}
        <section
          aria-labelledby="why-heading"
          className="px-4 sm:px-6 py-20 sm:py-28 bg-background/80 border-y border-foreground/5"
        >
          <div className="max-w-7xl mx-auto">
            <SectionIntro
              id="why-heading"
              title="Why work with KasauliCoder"
              lead="What you can expect from us when we build or look after your software."
            />
            <dl className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 lg:gap-x-14">
              {strengths.map((item) => (
                <div
                  key={item.title}
                  className="border-t border-foreground/15 pt-6 pb-10"
                >
                  <dt className="font-display text-xl font-bold text-foreground mb-3">
                    {item.title}
                  </dt>
                  <dd className="text-foreground/70 leading-relaxed">
                    {item.desc}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* About */}
        <section
          aria-labelledby="about-heading"
          className="px-4 sm:px-6 py-20 sm:py-28"
        >
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            <h2
              id="about-heading"
              className="lg:col-span-5 font-display text-3xl sm:text-4xl lg:text-[3.25rem] font-black tracking-tight leading-[1.08] text-balance"
            >
              About KasauliCoder
            </h2>
            <div className="lg:col-span-7 text-lg text-foreground/75 leading-relaxed space-y-5 max-w-2xl">
              <p>
                KasauliCoder is a software product development company, named
                after the hill town of Kasauli in Himachal Pradesh. We design,
                build and support SaaS products, web applications and the
                digital systems businesses rely on every day.
              </p>
              <p>
                Our approach is practical: understand the business problem
                first, design an interface people can use without training, and
                build on an architecture that can be maintained and extended
                after launch.
              </p>
              <Link href="/about" className={`${textLink} text-base`}>
                More about our company
                <Icon name="arrow_forward" className="text-lg" />
              </Link>
            </div>
          </div>
        </section>

        <HomeTeamWorkTestimonials />

        {/* Final CTA */}
        <section
          aria-labelledby="cta-heading"
          className="px-4 sm:px-6 py-20 sm:py-28"
        >
          <div className="relative max-w-5xl mx-auto rounded-3xl border border-primary/25 bg-background/80 backdrop-blur-xl px-6 py-14 sm:p-16 text-center overflow-hidden">
            <div
              className="absolute inset-x-0 -top-px h-px bg-linear-to-r from-transparent via-primary to-transparent"
              aria-hidden="true"
            />
            <h2
              id="cta-heading"
              className="font-display text-3xl sm:text-5xl font-black tracking-tight leading-[1.08] text-balance mb-6"
            >
              Have a Digital Product or Business Solution in Mind?
            </h2>
            <p className="text-lg text-foreground/70 leading-relaxed max-w-2xl mx-auto mb-10">
              Tell us what you want to build or improve. We will read your
              requirements, get back to you to discuss them, and suggest a
              sensible way to proceed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-sm sm:max-w-none mx-auto">
              <Link href="/contact" className={primaryButton}>
                Discuss Your Project
              </Link>
              <Link href="/pricing" className={secondaryButton}>
                Request a Proposal
              </Link>
            </div>
          </div>
        </section>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default HomeVisionHero;
