"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import GlobalFooter from "@/components/layout/GlobalFooter";
import GlobalHeader from "@/components/layout/GlobalHeader";

const capabilities = [
  {
    title: "Software Products",
    desc: "SaaS product development and custom software and web applications, designed around the needs of the businesses that use them.",
    icon: "code",
  },
  {
    title: "Digital Presence",
    desc: "Modern UI/UX and web development together with search engine optimization, so your business is easy to find and easy to use online.",
    icon: "web",
  },
  {
    title: "Operations & Infrastructure",
    desc: "Business process automation and integrations, cloud infrastructure, and ongoing technical support to keep your software running.",
    icon: "dns",
  },
];

const principles = [
  "Business-focused development",
  "Clear, transparent communication",
  "Technical support after launch",
];

const AboutUs = () => {
  return (
    <div className="bg-background text-foreground min-h-screen font-display selection:bg-primary selection:text-primary-content overflow-hidden relative">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,var(--primary)_0.03,transparent_50%)] opacity-20"></div>

      <GlobalHeader />

      <main className="relative z-10 pt-28">
        {/* Hero Section */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-xs font-bold uppercase tracking-widest mb-6"
            >
              About KasauliCoder
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black leading-tight mb-8 tracking-tighter"
            >
              Software products and digital solutions{" "}
              <span className="text-primary italic">for businesses.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-foreground opacity-70 text-xl max-w-3xl mx-auto"
            >
              KasauliCoder designs and develops SaaS products, web applications
              and business solutions, and supports the businesses that rely on
              them.
            </motion.p>
          </div>
        </section>

        {/* Capabilities */}
        <section className="py-20 px-6 bg-primary/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4">
                What We Do
              </h2>
              <h3 className="text-3xl md:text-4xl font-black tracking-tight">
                Our areas of work
              </h3>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {capabilities.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 glass-card border-glass-border rounded-2xl hover:border-primary/30 transition-colors group"
                >
                  <div className="size-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                    <span
                      className="material-symbols-outlined text-primary text-3xl"
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black mb-4 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-foreground opacity-70 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Identity Section */}
        <section className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="aspect-square bg-card rounded-3xl overflow-hidden border border-glass-border relative max-w-md w-full mx-auto"
            >
              <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-[120px] text-primary/20"
                  aria-hidden="true"
                >
                  settings_suggest
                </span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
                A software company with its roots in{" "}
                <span className="text-primary italic">Kasauli.</span>
              </h2>
              <p className="text-foreground opacity-70 text-lg leading-relaxed">
                KasauliCoder takes its name from Kasauli, the hill town in
                Himachal Pradesh. That identity shapes the brand; the work
                itself is practical: building dependable software for the
                businesses we work with.
              </p>
              <ul className="space-y-3 pt-2">
                {principles.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 font-medium text-foreground opacity-90"
                  >
                    <span
                      className="material-symbols-outlined text-primary text-xl"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 px-6 border-t border-glass-border">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto glass-card border-glass-border rounded-3xl p-12 text-center relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight relative z-10">
              Have a project in mind?
            </h2>
            <p className="text-foreground opacity-70 text-lg mb-10 max-w-2xl mx-auto relative z-10">
              Tell us what you would like built or improved and we will get back
              to you to discuss it.
            </p>
            <div className="flex flex-wrap justify-center gap-4 relative z-10">
              <Link
                href="/contact"
                className="bg-primary text-primary-content font-bold px-8 py-4 rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 transition-all text-sm uppercase tracking-widest"
              >
                Discuss a Project
              </Link>
              <Link
                href="/projects"
                className="glass-panel border-glass-border font-bold px-8 py-4 rounded-xl hover:bg-white/5 transition-colors text-sm uppercase tracking-widest"
              >
                View Projects
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default AboutUs;
