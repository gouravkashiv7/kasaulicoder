"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col font-display overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,242,255,0.05)_0%,transparent_50%)]"></div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-8 border-b border-white/5 bg-background-dark/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/30 group-hover:border-primary transition-colors">
              <span className="material-symbols-outlined text-primary text-2xl">
                terminal
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tighter text-slate-100">
              Kasauli<span className="text-primary">Coder</span>
            </h2>
          </Link>
          <div className="hidden md:flex gap-8 text-sm font-medium">
            <Link
              href="/about"
              className="hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="/projects"
              className="hover:text-primary transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/contact"
              className="hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 flex-1 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Terms of <span className="text-primary italic">Service</span>
            </h1>
            <p className="text-slate-400">Last updated: October 2024</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8 prose prose-invert max-w-none text-slate-300"
          >
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using KasauliCoder's platform, cohort
                materials, and services, you agree to be bound by these Terms of
                Service. If you do not agree to these terms, please do not use
                our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">
                2. Professional Development
              </h2>
              <p>
                Our cohorts and training programs are intended for professional
                development. While we provide industry-leading knowledge and
                mentorship, KasauliCoder does not guarantee specific employment
                outcomes. Success depends on individual effort and market
                conditions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">
                3. Intellectual Property
              </h2>
              <p>
                All materials provided during our programs, including code
                snippets, architecture diagrams, and educational content, are
                owned by KasauliCoder or its licensors. You are granted a
                personal, non-exclusive license to use these materials for your
                own professional growth.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">
                4. Payment and Refunds
              </h2>
              <p>
                Fees for our premium cohorts are non-refundable unless otherwise
                specified in the registration documentation. We provide
                high-value, limited-seat opportunities and expect a commitment
                from all participants.
              </p>
            </section>

            <section className="bg-primary/5 border border-primary/20 p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-primary mb-4">
                5. Code of Conduct
              </h2>
              <p>
                KasauliCoder is a high-performance community. We expect all
                members to maintain professional standards, contribute
                positively to group dynamics, and respect the privacy and
                intellectual property of fellow developers.
              </p>
            </section>
          </motion.div>
        </div>
      </main>

      <footer className="py-12 px-6 border-t border-white/5 bg-slate-900/30">
        <div className="max-w-7xl mx-auto text-center text-sm text-slate-500">
          <p>
            Questions about our terms? Reach out at{" "}
            <Link href="/contact" className="text-primary hover:underline">
              legal@kasaulicoder.io
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TermsOfService;
