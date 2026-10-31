"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import GlobalFooter from "@/components/layout/GlobalFooter";
import GlobalHeader from "@/components/layout/GlobalHeader";
import ProjectShowcaseCard from "@/components/projects/ProjectShowcaseCard";
import {
  primaryButton,
  SectionIntro,
  secondaryButton,
  textLink,
} from "@/components/ui/marketing";
import { SparklesCore } from "@/components/ui/sparkles";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import type { ShowcaseProject } from "@/lib/projects";
import TechStack from "./TechStack";

const GeneratedScreen = ({ projects }: { projects: ShowcaseProject[] }) => {
  const hasActive = projects.some((p) => p.status === "active");
  const [leadProject, ...otherProjects] = projects;

  const [particleColor, setParticleColor] = useState("#ffffff");

  useEffect(() => {
    const updateColor = () => {
      const html = document.documentElement;
      if (html.classList.contains("theme-light")) {
        setParticleColor("#1c1917"); // Dark warm color for light theme
      } else {
        setParticleColor("#ffffff"); // White for all dark themes
      }
    };

    updateColor();

    // Watch for theme class changes on <html>
    const observer = new MutationObserver(updateColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative bg-background text-foreground font-sans selection:bg-primary selection:text-primary-content overflow-x-hidden min-h-screen transition-colors duration-300">
      {/* Sparkles Background - scoped to this page */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.4}
          maxSize={1.2}
          particleDensity={50}
          className="w-full h-full"
          particleColor={particleColor}
          speed={0.4}
        />
      </div>

      {/* Other Background Elements */}
      <div className="absolute inset-0 z-1 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-20 dark:opacity-40">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
        <Spotlight
          className="from-primary/30 via-primary/10 to-transparent"
          size={1000}
        />
      </div>

      <div className="relative z-10">
        <GlobalHeader />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40 pb-12">
          {/* Hero Section */}
          <header className="mb-12 sm:mb-20 text-center lg:text-left grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="font-display text-base sm:text-lg font-semibold text-primary mb-5">
                Our work
              </p>
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.02] text-foreground">
                KasauliCoder{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary animate-gradient">
                  Projects
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-foreground/75 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                Software we have designed and built for businesses, shown with
                screenshots from the applications and links to the live
                products.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start max-w-sm sm:max-w-none mx-auto lg:mx-0">
                <a href="#portfolio" className={primaryButton}>
                  Browse Projects
                </a>
                <Link href="/contact" className={secondaryButton}>
                  Discuss a Project
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative group h-64 sm:h-100 lg:h-125"
            >
              <div className="absolute -inset-1 bg-linear-to-r from-primary to-secondary rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative h-full rounded-lg overflow-hidden glass-card flex items-center justify-center pointer-events-auto">
                <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background/40 via-transparent to-transparent pointer-events-none"></div>
              </div>
            </motion.div>
          </header>

          {/* Portfolio — genuine projects with screenshots */}
          {leadProject && (
            <section
              id="portfolio"
              aria-labelledby="portfolio-heading"
              className="scroll-mt-28 mb-20 sm:mb-28"
            >
              <SectionIntro
                id="portfolio-heading"
                title="Portfolio"
                lead="Each project links to a page with more detail on the problem, our role and the technology, and to the live application where one is public."
              >
                <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-base">
                  <Link href="/projects/recent-projects" className={textLink}>
                    Completed projects
                  </Link>
                  {hasActive && (
                    <Link href="/projects/active-projects" className={textLink}>
                      Projects in development
                    </Link>
                  )}
                </p>
              </SectionIntro>
              <div className="flex flex-col gap-6 lg:gap-8">
                <ProjectShowcaseCard
                  project={leadProject}
                  variant="large"
                  priority
                />
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
            </section>
          )}

          {/* Tech Stack Section */}
          <TechStack />
        </main>

        <GlobalFooter />
      </div>
    </div>
  );
};

export default GeneratedScreen;
