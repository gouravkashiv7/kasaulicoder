"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";

const AboutUs = () => {
  return (
    <div className="bg-background text-foreground min-h-screen font-display selection:bg-primary selection:text-primary-content overflow-hidden relative">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,var(--primary)_0.03,transparent_50%)] opacity-20"></div>

      <GlobalHeader />

      <main className="relative z-10 pt-28">
        {/* Hero Section */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="max-w-7xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-xs font-bold uppercase tracking-widest mb-6"
            >
              Our Mission
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black leading-tight mb-8 tracking-tighter"
            >
              Engineering the{" "}
              <span className="text-primary italic">Next Decade</span> <br /> of
              Digital Excellence.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-foreground opacity-70 text-xl max-w-3xl mx-auto mb-12"
            >
              KasauliCoder is a premier technical collective dedicated to
              bridging the gap between raw potential and industry-leading
              expertise. We build the tools, the talent, and the future.
            </motion.p>
          </div>
        </section>

        {/* Values Grid */}
        <section className="py-20 px-6 bg-primary/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Radical Innovation",
                  desc: "We don't just follow trends; we set the standard for modern web architecture and AI integration.",
                  icon: "bolt",
                },
                {
                  title: "Relentless Quality",
                  desc: "Every line of code is a signature. We prioritize performance, security, and scalability in everything we build.",
                  icon: "verified",
                },
                {
                  title: "Empowered Community",
                  desc: "Our strength lies in our collective. We foster an environment of continuous learning and mutual growth.",
                  icon: "groups",
                },
              ].map((val, i) => (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 glass-card border-glass-border rounded-2xl hover:border-primary/30 transition-all group"
                >
                  <div className="size-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-primary text-3xl">
                      {val.icon}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black mb-4 tracking-tight">
                    {val.title}
                  </h3>
                  <p className="text-foreground opacity-70 leading-relaxed">
                    {val.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square bg-card rounded-3xl overflow-hidden border border-glass-border relative">
                <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[120px] text-primary/20">
                    settings_suggest
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 p-8 glass-panel border-glass-border rounded-2xl shadow-2xl">
                <p className="text-4xl font-black text-primary mb-1">100+</p>
                <p className="text-xs font-bold uppercase tracking-widest opacity-60">
                  Global Initiatives
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-black leading-tight tracking-tight">
                Born in the Mountains, <br /> Built for the{" "}
                <span className="text-primary italic">Global Stack.</span>
              </h2>
              <p className="text-foreground opacity-70 text-lg leading-relaxed">
                What started as a small cohort of developers in Kasauli has
                evolved into a global ecosystem. Our unique approach combines
                high-altitude focus with deep-level technical precision.
              </p>
              <p className="text-foreground opacity-70 text-lg leading-relaxed">
                We believe that the next generation of digital leaders isn't
                just born in Silicon Valley—they are built wherever there is a
                terminal, an internet connection, and the will to create.
              </p>
              <div className="pt-4 flex gap-6">
                <div>
                  <p className="text-2xl font-black">2023</p>
                  <p className="text-xs opacity-60 uppercase tracking-widest font-bold">
                    Founded
                  </p>
                </div>
                <div className="w-px h-10 bg-glass-border"></div>
                <div>
                  <p className="text-2xl font-black text-secondary">24/7</p>
                  <p className="text-xs opacity-60 uppercase tracking-widest font-bold">
                    Support
                  </p>
                </div>
                <div className="w-px h-10 bg-glass-border"></div>
                <div>
                  <p className="text-2xl font-black text-primary">4.0</p>
                  <p className="text-xs opacity-60 uppercase tracking-widest font-bold">
                    Current Cohort
                  </p>
                </div>
              </div>
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
            <h2 className="text-4xl font-black mb-6 italic tracking-tighter relative z-10">
              Ready to redefine your trajectory?
            </h2>
            <p className="text-foreground opacity-70 text-lg mb-10 max-w-2xl mx-auto relative z-10">
              Whether you're looking to hire our precision engineering team or
              join our next development cohort, the future starts with a single
              click.
            </p>
            <div className="flex flex-wrap justify-center gap-4 relative z-10">
              <Link
                href="/register"
                className="bg-primary text-primary-content font-bold px-8 py-4 rounded-xl hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] hover:scale-105 transition-all uppercase tracking-widest text-sm"
              >
                JOIN THE COHORT
              </Link>
              <Link
                href="/contact"
                className="glass-panel border-glass-border font-bold px-8 py-4 rounded-xl hover:bg-white/5 transition-all uppercase tracking-widest text-sm"
              >
                CONTACT US
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
