"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";

const CareersPage = () => {
  const values = [
    {
      title: "Impact First",
      desc: "We build for small businesses and local communities, ensuring our tech makes a real-world difference.",
      icon: "center_focus_strong",
    },
    {
      title: "Continuous Learning",
      desc: "From the Himalayas to the global tech hub, we stay at the edge of AI and modern web architecture.",
      icon: "school",
    },
    {
      title: "Absolute Freedom",
      desc: "Remote-first culture with high accountability and the tools you need to do your best work.",
      icon: "auto_awesome",
    },
  ];

  return (
    <div className="bg-background-dark text-slate-100 min-h-screen font-display selection:bg-primary selection:text-background-dark">
      <GlobalHeader />

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 inline-block">
                Join the Mission
              </span>
              <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
                From the <span className="text-primary italic">Hills</span> to
                the <span className="text-primary italic">Hub</span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                We're a collective of passionate developers, designers, and
                visionaries building the future of tech from the heart of the
                Himalayas.
              </p>
            </motion.div>
          </div>

          {/* Core Values */}
          <div className="grid md:grid-cols-3 gap-8 mb-32">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-primary/30 transition-all group"
              >
                <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary">
                    {v.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3">{v.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Current Opportunities */}
          <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-12 relative overflow-hidden mb-32">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="max-w-xl text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Building Something Extraordinary?
                </h2>
                <p className="text-slate-400 mb-8">
                  We are always looking for talented partners, mentors, and
                  developers who share our vision of decentralized excellence.
                  Whether you're a seasoned architect or a rising star, let's
                  talk.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-primary text-background-dark font-bold px-8 py-4 rounded-xl hover:shadow-[0_0_25px_rgba(0,242,255,0.4)] transition-all hover:scale-105"
                >
                  Apply as Partner / Mentor
                  <span className="material-symbols-outlined text-sm font-black">
                    arrow_forward
                  </span>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background-dark/80 p-6 border border-white/5 rounded-2xl flex flex-col items-center">
                  <span className="text-3xl font-black text-primary mb-1">
                    100%
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Remote
                  </span>
                </div>
                <div className="bg-background-dark/80 p-6 border border-white/5 rounded-2xl flex flex-col items-center">
                  <span className="text-3xl font-black text-primary mb-1">
                    Flex
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Hours
                  </span>
                </div>
                <div className="bg-background-dark/80 p-6 border border-white/5 rounded-2xl flex flex-col items-center">
                  <span className="text-3xl font-black text-primary mb-1">
                    Top
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Stack
                  </span>
                </div>
                <div className="bg-background-dark/80 p-6 border border-white/5 rounded-2xl flex flex-col items-center">
                  <span className="text-3xl font-black text-primary mb-1">
                    Global
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Reach
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Culture Section */}
          <div className="grid lg:grid-cols-2 gap-20 items-center mb-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Our Culture</h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                At KasauliCoder, we believe that great tech doesn't require a
                cubicle in a skyscraper. It requires passion, curiosity, and a
                supportive environment. Our culture is built on transparency,
                peer-to-peer mentorship, and a relentless pursuit of engineering
                excellence.
              </p>
              <ul className="space-y-4">
                {[
                  "Weekly Tech Showcases",
                  "Open-Source Contributions",
                  "Collaborative Problem Solving",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-slate-200 font-medium"
                  >
                    <span className="material-symbols-outlined text-primary text-sm">
                      verified
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-3xl overflow-hidden glass-card border border-white/10"
            >
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRESHDUxWcudqKjmVHldyzV41VeMrM35fkW3hekI1t8Wn2Biln-deaaV8aHtCMxcZxHNsgJ1RFeMNfVplgyNQrGMAPQUW6FmGmePz2Lg2MJnMAS360vfmJx6yvQ448GTyhou0-0BR3nVJ7aysyvnnKhAMLmBs9OaHmexCJZgGORHl4eycKmG7qbdOItaWsqdu5Wiikhq5FeyqOImMyibGVwubf2bkC-yi1eFKI9V2iIhbjg4oWCYDlDO6m9HFai9ro_s2Gu4Aalws"
                alt="Culture at KasauliCoder"
                fill
                className="object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-linear-to-t from-background-dark via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                <p className="text-sm italic text-slate-300">
                  "The best part is the community. We're not just coworkers;
                  we're a team building the future together."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default CareersPage;
