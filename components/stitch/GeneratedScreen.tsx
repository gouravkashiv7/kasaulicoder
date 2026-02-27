"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import GlobalHeader from "./GlobalHeader";
import GlobalFooter from "./GlobalFooter";

const GeneratedScreen = () => {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      document.body.style.setProperty("--move-x", `${x * 20}px`);
      document.body.style.setProperty("--move-y", `${y * 20}px`);
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.body.style.removeProperty("--move-x");
      document.body.style.removeProperty("--move-y");
    };
  }, []);

  return (
    <div className="bg-[#050505] text-gray-100 font-sans selection:bg-primary selection:text-black overflow-x-hidden min-h-screen">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#9d00ff]/10 rounded-full blur-[120px] animate-pulse-slow"
        ></motion.div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      </div>

      <div className="relative z-10">
        <GlobalHeader />

        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* Hero Section */}
          <header className="mb-20 text-center lg:text-left grid lg:grid-cols-2 gap-12 items-center">
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
                Project Active
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-4 leading-none text-white">
                Neural-Link{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-[#9d00ff] animate-gradient">
                  Dashboard
                </span>
              </h1>
              <p className="text-xl text-gray-400 mb-8 max-w-xl">
                Advanced AI visualization systems bridging the gap between
                high-dimensional neural computations and intuitive human
                interfaces.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link
                  href="/register"
                  className="px-8 py-4 bg-primary text-black font-bold rounded-lg hover:scale-105 transition-transform neon-glow"
                >
                  Explore Interface
                </Link>
                <Link
                  href="/projects"
                  className="px-8 py-4 bg-white/5 border border-white/10 font-bold rounded-lg hover:bg-white/10 transition-colors"
                >
                  View Source
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-linear-to-r from-primary to-[#9d00ff] rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative aspect-video rounded-lg overflow-hidden glass-card flex items-center justify-center">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRESHDUxWcudqKjmVHldyzV41VeMrM35fkW3hekI1t8Wn2Biln-deaaV8aHtCMxcZxHNsgJ1RFeMNfVplgyNQrGMAPQUW6FmGmePz2Lg2MJnMAS360vfmJx6yvQ448GTyhou0-0BR3nVJ7aysyvnnKhAMLmBs9OaHmexCJZgGORHl4eycKmG7qbdOItaWsqdu5Wiikhq5FeyqOImMyibGVwubf2bkC-yi1eFKI9V2iIhbjg4oWCYDlDO6m9HFai9ro_s2Gu4Aalws"
                  alt="Visualization Preview"
                  fill
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-transparent to-transparent"></div>
              </div>
            </motion.div>
          </header>

          {/* Overview Section */}
          <section className="mb-24">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Real-time Processing",
                  desc: "Latency-free data streaming through optimized WebSockets and edge-side inference nodes.",
                  icon: "M13 10V3L4 14h7v7l9-11h-7z",
                  color: "primary",
                },
                {
                  title: "Neural Mapping",
                  desc: "Dynamic 3D representation of thought-pattern vectors using proprietary spatial algorithms.",
                  icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                  color: "[#9d00ff]",
                },
                {
                  title: "Quantum Encryption",
                  desc: "End-to-end security protocols ensuring neural data integrity and absolute user privacy.",
                  icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                  color: "primary",
                },
              ].map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                  className={`glass-card p-8 rounded-lg hover:border-${card.color}/50 transition-colors cursor-default`}
                >
                  <div
                    className={`w-12 h-12 rounded-lg bg-${card.color}/10 flex items-center justify-center mb-6`}
                  >
                    <svg
                      className={`w-6 h-6 text-${card.color}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d={card.icon}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {card.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Tech Stack Section */}
          <section className="mb-24 py-16 border-y border-white/10">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/3">
                <h2 className="text-3xl font-bold mb-4">The Stack</h2>
                <p className="text-gray-400">
                  Our engine room utilizes bleeding-edge technologies to handle
                  massive neural datasets with graceful performance.
                </p>
              </div>
              <div className="md:w-2/3 grid grid-cols-2 sm:grid-cols-3 gap-6">
                <div className="flex flex-col items-center justify-center p-6 glass-card rounded-lg grayscale hover:grayscale-0 transition-all">
                  <Image
                    height={40}
                    width={40}
                    alt="Next.js"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBD1ayaGroTDwoP8M0SQc756fjYIxqa1Vre7PbEFXcqVuKyprBstK1N4gzIE3FWUQLdGypV8avTReTZvdDanP6KfcUyEjFJIZTADlFbV5Zx7z5J5GTY7tiFwKtFz8hnbo2UfUwh_DoBobY7PsTXurm6fQ5doFCNM5OpC3qolbRpkGyT7VHf9CIg77WZe7ygMSPJSoj0Ldo-uc1c_MTjoqN5yotG6telnhf49VJVTQ2d1crnQM9fuR3k3YpBbeoOQ7g9VESq1Z9BW1o"
                    className="mb-3"
                  />
                  <span className="text-xs font-bold tracking-widest uppercase">
                    Next.js 14
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-6 glass-card rounded-lg grayscale hover:grayscale-0 transition-all">
                  <Image
                    height={40}
                    width={40}
                    alt="OpenAI"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8dZi0P2NHY07K2GJU_wwwzGoYXXHBPWTVFsttB2lEZn9kBRg1BGJbrlwcRHnbfgYX053yyDyLk4ujiZtZuJ4UKPl0r4XsI1l30wcKLF-o9JNzHmd1x7khPAQWljqOdBG63o_ElioPWignsCePIlB9S25Sbk5rfo_kukdG06Xeh9_CTrpj0Kvc9kNA4XPDe8ATI-dObOaTI-F-WDnnyAyEERDoZiUYe4Nv7mt9uWlsBnWbBZwaKbnBqNlJ7fLJQ2ffJAKbCH6ertA"
                    className="mb-3"
                  />
                  <span className="text-xs font-bold tracking-widest uppercase">
                    GPT-4 Turbo
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-6 glass-card rounded-lg grayscale hover:grayscale-0 transition-all">
                  <Image
                    height={40}
                    width={40}
                    alt="Three.js"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBv9oXk6SSWxc5SjwtsGeB6uz8pUM70X71zivbK60VlTD0YO54iTXYgeD6fRX7G2al9GglBLUbL0F5-Da7THsfQTZdHbDCwBlnICiFXcyf9QYSc8-wdih3s9c-JNm3Ebj5RtUsrHpAt9cIYMBlwsGe_J2SxYtwedkdql88sz8ErOHZivREwumPfEY1K50O6XQPK1rJjRZNvRbp5e-T9dTgisW_CtRGVG-ZhXQ"
                    className="mb-3"
                  />
                  <span className="text-xs font-bold tracking-widest uppercase">
                    Three.js R3F
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-6 glass-card rounded-lg grayscale hover:grayscale-0 transition-all">
                  <Image
                    height={40}
                    width={40}
                    alt="Tailwind"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuALQVKsDu6B4IuXLgv7a3foNRzCIdFwv1cwRVBgKvZkZipuJEVU77g-gH_Sm_GJ4TL541_1TVtZaCcRK5fpVLUb6Fj_noY5sedP1hqQ-_b0GCmVhgJv2KjnYt9DKk8LDfNn0UgSrU-T9MJZjsf8zq6Sr0NQZXnsnzZBrPROfzthJ036OFi3MgVJdqmVgBsz-7AOk84rO9Q1zBHUb85m0MawAf157CLyp6EFxQeafuzsltAk5Y9pjM5Dxnl0UIkzu_XS_-5iBJtZ0d0"
                    className="mb-3"
                  />
                  <span className="text-xs font-bold tracking-widest uppercase">
                    Tailwind v3
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-6 glass-card rounded-lg grayscale hover:grayscale-0 transition-all">
                  <Image
                    height={40}
                    width={40}
                    alt="Redis"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9tbcF-bEk87PqRMWWyoiDEmVdDIrj2Y-XKf6Peog8Y7t9iqwD_mlQRv4Box0Ykfj0jHUNfXGxdm4mqUW8pY57Na6EE6t2cBbsYn0H7nFzEl6Sv0ugC2yDtAfUyHAOngDAPYWl83DHyz4JOXzG20XO9aqm7Ps33y8Tho29TXnLe1QX71_BNnAbQ-8_P-x4sicJAUUnU6XgI6UjXuCjk_Y4wxbjGt7M6IPZg0eWICOw2BSzW04RUypZnZTRFlEiW_CtRGVG-ZhXQ"
                    className="mb-3"
                  />
                  <span className="text-xs font-bold tracking-widest uppercase">
                    Upstash Redis
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-6 glass-card rounded-lg grayscale hover:grayscale-0 transition-all">
                  <Image
                    height={40}
                    width={40}
                    alt="TypeScript"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiqSIvoc6FUz7SiEbVmj5gn1n_T3gSJi_FXmXyuV4UT3UlHZ-tcK3b5x6efHTTY4Pg65qVVlh4T1-YL-yp93tgA3aXChPxbYXww0smO5qV_QGrVF-xZm3zZXjrORgQypRczcioPS4zcuHZKWGQY4Wkh4AeRs2KR96K3dtYrL7B2FT0FisE3FtDIPItkhnnRSytpetYscjvdTRmrrfUiP5XXFsExcLpGDizplIHRsflTc6jQrD7SPB7ycgN561cNkEsz49voN_BW9Q"
                    className="mb-3"
                  />
                  <span className="text-xs font-bold tracking-widest uppercase">
                    TypeScript
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Milestones Section */}
          <section className="mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <h2 className="text-3xl font-bold mb-2">Development Roadmap</h2>
              <p className="text-gray-400">
                Tracking the evolution of Neural-Link
              </p>
            </motion.div>
            <div className="space-y-6 max-w-4xl mx-auto">
              {[
                {
                  period: "Q1 2024 • Completed",
                  title: "Alpha Simulation Engine",
                  desc: "Initial launch of the 3D neural pathing algorithm and core dashboard architecture.",
                  active: false,
                },
                {
                  period: "Q2 2024 • In Progress",
                  title: "Bilateral Logic Synthesis",
                  desc: "Integrating real-time AI logic feedback loops and multi-user visualization synchronization.",
                  active: true,
                },
                {
                  period: "Q4 2024 • Planned",
                  title: "Mainnet Neural Node Mesh",
                  desc: "Public deployment of the decentralized processing network and community node API.",
                  active: false,
                },
              ].map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-6 group"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full border-2 ${step.active ? "border-primary bg-primary/20" : "border-gray-700 bg-gray-800"} flex items-center justify-center z-10`}
                    >
                      <div
                        className={`w-3 h-3 ${step.active ? "bg-primary animate-pulse" : "bg-gray-600"} rounded-full`}
                      ></div>
                    </div>
                    {i < 2 && (
                      <div className="w-px h-full bg-linear-to-b from-primary/50 to-transparent -mt-1"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-10">
                    <div
                      className={`glass-card p-6 rounded-lg group-hover:bg-white/5 transition-colors ${step.active ? "border-l-4 border-l-primary" : ""}`}
                    >
                      <span
                        className={`${step.active ? "text-primary" : "text-gray-500"} text-xs font-bold uppercase tracking-widest`}
                      >
                        {step.period}
                      </span>
                      <h4 className="text-xl font-bold mt-1 mb-2">
                        {step.title}
                      </h4>
                      <p className="text-gray-400 text-sm">{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-4xl overflow-hidden p-12 text-center bg-[#0a0a0a] border border-white/10"
          >
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-[#9d00ff]/5"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl font-black mb-4">Join the Collective</h2>
              <p className="text-gray-400 mb-10 text-lg leading-relaxed">
                Be part of the pioneer group building the future of AI
                interfaces. Get early access to beta builds and contribute to
                the neural framework.
              </p>
              <form
                className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-6 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-600"
                  placeholder="Enter cyber-mail..."
                  type="email"
                />
                <button className="bg-primary text-black font-bold px-8 py-4 rounded-lg hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all">
                  Subscribe
                </button>
              </form>
              <p className="mt-6 text-[10px] text-gray-500 uppercase tracking-widest font-medium">
                No SPAM • SECURE LINK • PROTOCOL 1.0
              </p>
            </div>
          </motion.section>
        </main>

        <GlobalFooter />
      </div>
    </div>
  );
};

export default GeneratedScreen;
