"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col font-display overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_50%,rgba(0,242,255,0.05)_0%,transparent_50%)]"></div>

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
          <Link
            href="/login"
            className="bg-primary/10 text-primary border border-primary/30 px-4 py-2 rounded font-bold text-sm hover:bg-primary hover:text-background-dark transition-all"
          >
            LOGIN
          </Link>
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
              Privacy <span className="text-primary italic">Policy</span>
            </h1>
            <p className="text-slate-400">
              Your data is yours. We just protect it.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-12 text-slate-300"
          >
            <section className="grid md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-1">
                <h2 className="text-xl font-bold text-white">
                  Data Collection
                </h2>
              </div>
              <div className="md:col-span-2 space-y-4">
                <p>
                  We collect information you provide directly to us when you
                  register for a cohort, subscribe to our newsletter, or contact
                  us. This may include your name, email, professional interests,
                  and payment information.
                </p>
                <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                  <p className="text-sm font-bold text-primary mb-2 uppercase tracking-widest">
                    Why we collect it
                  </p>
                  <ul className="text-sm space-y-2 list-disc list-inside text-slate-400">
                    <li>To personalize your learning path</li>
                    <li>To facilitate secure payments</li>
                    <li>To send critical system updates</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="grid md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-1">
                <h2 className="text-xl font-bold text-white">Data Security</h2>
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
                <h2 className="text-xl font-bold text-white">
                  Third-Party Sharing
                </h2>
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

            <section className="p-8 bg-linear-to-br from-primary/10 to-transparent border border-primary/20 rounded-2xl">
              <h2 className="text-2xl font-bold text-white mb-4 italic">
                Your Rights
              </h2>
              <p className="mb-6">
                You have the right to access, correct, or delete your personal
                information at any time. If you wish to exercise these rights,
                please contact our data protection officer.
              </p>
              <Link
                href="/contact"
                className="text-primary font-bold hover:underline inline-flex items-center gap-2"
              >
                Contact Data Protection Officer
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </Link>
            </section>
          </motion.div>
        </div>
      </main>

      <footer className="py-12 px-6 border-t border-white/5 bg-slate-900/30">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} KasauliCoder Privacy Lab</p>
          <div className="flex gap-6">
            <Link
              href="/terms"
              className="hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
