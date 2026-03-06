"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";

const TermsOfService = () => {
  return (
    <div className="bg-background text-foreground min-h-screen font-display selection:bg-primary selection:text-primary-content overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--primary)_0.05,transparent_50%)] opacity-20"></div>

      <GlobalHeader />

      <main className="relative z-10 flex-1 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">
              Terms of <span className="text-primary italic">Service</span>
            </h1>
            <p className="text-foreground opacity-70">
              Last updated: October 2024
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8 max-w-none text-foreground opacity-80"
          >
            <section>
              <h2 className="text-2xl font-black mb-4 tracking-tight">
                1. Acceptance of Terms
              </h2>
              <p className="leading-relaxed">
                By accessing and using KasauliCoder's platform, cohort
                materials, and services, you agree to be bound by these Terms of
                Service. If you do not agree to these terms, please do not use
                our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-4 tracking-tight">
                2. Professional Development
              </h2>
              <p className="leading-relaxed">
                Our cohorts and training programs are intended for professional
                development. While we provide industry-leading knowledge and
                mentorship, KasauliCoder does not guarantee specific employment
                outcomes. Success depends on individual effort and market
                conditions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-4 tracking-tight">
                3. Intellectual Property
              </h2>
              <p className="leading-relaxed">
                All materials provided during our programs, including code
                snippets, architecture diagrams, and educational content, are
                owned by KasauliCoder or its licensors. You are granted a
                personal, non-exclusive license to use these materials for your
                own professional growth.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-4 tracking-tight">
                4. Payment and Refunds
              </h2>
              <p className="leading-relaxed">
                Fees for our premium cohorts are non-refundable unless otherwise
                specified in the registration documentation. We provide
                high-value, limited-seat opportunities and expect a commitment
                from all participants.
              </p>
            </section>

            <section className="glass-panel border-glass-border p-8 rounded-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <h2 className="text-2xl font-black text-primary mb-4 tracking-tight relative z-10">
                5. Code of Conduct
              </h2>
              <p className="leading-relaxed relative z-10">
                KasauliCoder is a high-performance community. We expect all
                members to maintain professional standards, contribute
                positively to group dynamics, and respect the privacy and
                intellectual property of fellow developers.
              </p>
            </section>
          </motion.div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default TermsOfService;
