"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import GlobalHeader from "./GlobalHeader";
import GlobalFooter from "./GlobalFooter";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col font-display overflow-hidden relative">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,242,255,0.03)_0%,transparent_50%)]"></div>

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
              className="text-5xl md:text-7xl font-bold leading-tight mb-8"
            >
              Engineering the{" "}
              <span className="text-primary italic">Next Decade</span> <br /> of
              Digital Excellence.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-xl max-w-3xl mx-auto mb-12"
            >
              KasauliCoder is a premier technical collective dedicated to
              bridging the gap between raw potential and industry-leading
              expertise. We build the tools, the talent, and the future.
            </motion.p>
          </div>
        </section>

        {/* Values Grid */}
        <section className="py-20 px-6 bg-slate-900/20">
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
                  className="p-8 bg-slate-900/40 border border-white/5 rounded-2xl hover:border-primary/30 transition-all group"
                >
                  <div className="size-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-primary text-3xl">
                      {val.icon}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{val.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{val.desc}</p>
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
              <div className="aspect-square bg-slate-800 rounded-3xl overflow-hidden border border-white/10 relative">
                <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[120px] text-primary/20">
                    settings_suggest
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 p-8 bg-background-dark border border-primary/20 rounded-2xl shadow-2xl">
                <p className="text-4xl font-bold text-primary mb-1">100+</p>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
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
              <h2 className="text-4xl font-bold leading-tight">
                Born in the Mountains, <br /> Built for the{" "}
                <span className="text-primary italic">Global Stack.</span>
              </h2>
              <p className="text-slate-400 text-lg">
                What started as a small cohort of developers in Kasauli has
                evolved into a global ecosystem. Our unique approach combines
                high-altitude focus with deep-level technical precision.
              </p>
              <p className="text-slate-400 text-lg">
                We believe that the next generation of digital leaders isn't
                just born in Silicon Valley—they are built wherever there is a
                terminal, an internet connection, and the will to create.
              </p>
              <div className="pt-4 flex gap-6">
                <div>
                  <p className="text-2xl font-bold text-white">2023</p>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">
                    Founded
                  </p>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div>
                  <p className="text-2xl font-bold text-white">24/7</p>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">
                    Support
                  </p>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div>
                  <p className="text-2xl font-bold text-white">4.0</p>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">
                    Current Cohort
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 px-6 border-t border-white/5">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-primary/5 border border-primary/20 rounded-3xl p-12 text-center"
          >
            <h2 className="text-4xl font-bold mb-6 italic">
              Ready to redefine your trajectory?
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
              Whether you're looking to hire our precision engineering team or
              join our next development cohort, the future starts with a single
              click.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="bg-primary text-background-dark font-bold px-8 py-4 rounded-lg hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all uppercase tracking-widest text-sm"
              >
                JOIN THE COHORT
              </Link>
              <Link
                href="/contact"
                className="bg-white/5 border border-white/10 text-white font-bold px-8 py-4 rounded-lg hover:bg-white/10 transition-all uppercase tracking-widest text-sm"
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
