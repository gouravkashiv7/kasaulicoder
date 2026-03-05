"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { SparklesCore } from "@/components/ui/sparkles";
import TechStack from "./TechStack";

const GeneratedScreen = () => {
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

        <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-12">
          {/* Hero Section */}
          <header className="mb-12 sm:mb-20 text-center lg:text-left grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-[0.2em] uppercase mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Active Ecosystem
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-4 leading-tight sm:leading-none text-foreground">
                KasauliCoder <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary animate-gradient">
                  Active Labs
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-foreground/60 mb-6 sm:mb-8 max-w-xl font-medium">
                Explore our portfolio of cutting-edge solutions. Discover what
                we are currently engineering in our active labs, or browse
                through past success stories of high-performance digital
                architectures.
              </p>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative group h-64 sm:hidden w-full mb-8"
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

              <div className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link
                  href="/projects/active-projects"
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-content text-sm sm:text-base font-black rounded-lg hover:scale-105 transition-all neon-glow flex items-center gap-2"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-content opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-content"></span>
                  </span>
                  View Active Projects
                </Link>
                <Link
                  href="/projects/recent-projects"
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-foreground/5 border border-foreground/10 text-sm sm:text-base font-bold rounded-lg hover:bg-foreground/10 transition-colors text-foreground"
                >
                  Recent Projects
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative group h-72 sm:h-100 lg:h-125 hidden sm:block"
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

          {/* Tech Stack Section */}
          <TechStack />
        </main>

        <GlobalFooter />
      </div>
    </div>
  );
};

export default GeneratedScreen;
