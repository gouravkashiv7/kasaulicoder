"use client";

import { motion } from "framer-motion";
import GlobalFooter from "@/components/layout/GlobalFooter";
import GlobalHeader from "@/components/layout/GlobalHeader";

const TermsOfService = () => {
  return (
    <div className="bg-background text-foreground min-h-screen font-display selection:bg-primary selection:text-primary-content overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--primary)_0.05,transparent_50%)] opacity-20"></div>

      <GlobalHeader />

      <main className="relative z-10 flex-1 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 1, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">
              Terms of <span className="text-primary italic">Service</span>
            </h1>
            <p className="text-foreground opacity-70">
              Last updated: October 2026
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 1, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8 max-w-none text-foreground opacity-80"
          >
            <section>
              <h2 className="text-2xl font-black mb-4 tracking-tight">
                1. Acceptance of Terms
              </h2>
              <p className="leading-relaxed">
                By accessing and using the KasauliCoder website and services,
                you agree to be bound by these Terms of Service. If you do not
                agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-4 tracking-tight">
                2. Services
              </h2>
              <p className="leading-relaxed">
                KasauliCoder provides software development and related digital
                services to businesses. The scope and terms of any project are
                agreed separately with the client.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-4 tracking-tight">
                3. Intellectual Property
              </h2>
              <p className="leading-relaxed">
                The content of this website, including text, graphics and code,
                is owned by KasauliCoder or its licensors. Ownership of work
                delivered to a client is governed by the agreement for that
                project.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-4 tracking-tight">
                4. Payment and Refunds
              </h2>
              <p className="leading-relaxed">
                Fees and payment terms for a project are set out in the
                agreement or proposal for that project.
              </p>
            </section>

            <section className="glass-panel border-glass-border p-8 rounded-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <h2 className="text-2xl font-black text-primary mb-4 tracking-tight relative z-10">
                5. Acceptable Use
              </h2>
              <p className="leading-relaxed relative z-10">
                We expect everyone using this website to use it lawfully and
                respectfully, and to respect the privacy and intellectual
                property of others.
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
