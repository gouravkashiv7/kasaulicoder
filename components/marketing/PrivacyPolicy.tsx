"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";

const PrivacyPolicy = () => {
  return (
    <div className="bg-background text-foreground min-h-screen font-display selection:bg-primary selection:text-primary-content overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_50%,var(--primary)_0.05,transparent_50%)] opacity-20"></div>

      <GlobalHeader />

      <main className="relative z-10 flex-1 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">
              Privacy <span className="text-primary italic">Policy</span>
            </h1>
            <p className="text-foreground opacity-70 text-lg">
              Your data is yours. We just protect it.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-12 text-foreground opacity-80"
          >
            <section className="grid md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-1">
                <h2 className="text-xl font-bold">Data Collection</h2>
              </div>
              <div className="md:col-span-2 space-y-4">
                <p>
                  We collect information you provide directly to us when you
                  register for a cohort, subscribe to our newsletter, or contact
                  us. This may include your name, email, professional interests,
                  and payment information.
                </p>
                <div className="glass-card p-6 rounded-xl">
                  <p className="text-sm font-bold text-primary mb-2 uppercase tracking-widest">
                    Why we collect it
                  </p>
                  <ul className="text-sm space-y-2 list-disc list-inside opacity-70">
                    <li>To personalize your learning path</li>
                    <li>To facilitate secure payments</li>
                    <li>To send critical system updates</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="grid md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-1">
                <h2 className="text-xl font-bold">Data Security</h2>
              </div>
              <div className="md:col-span-2">
                <p>
                  We implement enterprise-grade encryption for all sensitive
                  data. Your source code, project submissions, and personal
                  details are protected by advanced security protocols and
                  restricted access controls.
                </p>
              </div>
            </section>

            <section className="grid md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-1">
                <h2 className="text-xl font-bold">Third-Party Sharing</h2>
              </div>
              <div className="md:col-span-2">
                <p>
                  We do not sell your personal data. We only share information
                  with trusted partners (like payment processors or cloud
                  providers) necessary to deliver our services, and only under
                  strict confidentiality agreements.
                </p>
              </div>
            </section>

            <section className="p-8 glass-panel border-glass-border rounded-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <h2 className="text-2xl font-black mb-4 italic relative z-10">
                Your Rights
              </h2>
              <p className="mb-6 relative z-10">
                You have the right to access, correct, or delete your personal
                information at any time. If you wish to exercise these rights,
                please contact our data protection officer.
              </p>
              <Link
                href="/contact"
                className="text-primary font-bold hover:underline inline-flex items-center gap-2 relative z-10 group/link"
              >
                Contact Data Protection Officer
                <span className="material-symbols-outlined text-sm group-hover/link:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
            </section>
          </motion.div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default PrivacyPolicy;
