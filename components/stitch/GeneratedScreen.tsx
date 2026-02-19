"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

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
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#9d00ff]/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#050505]/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-black text-black text-xs">
                KC
              </div>
              <span className="font-bold tracking-tighter text-xl text-white">
                Kasauli<span className="text-primary">Coder</span>
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-8 bg-white/5 backdrop-blur-md px-6 py-2 rounded-full border border-white/10">
              <Link
                className="text-xs font-semibold tracking-wider text-gray-300 hover:text-white uppercase transition-colors"
                href="/"
              >
                Vision
              </Link>
              <Link
                className="text-xs font-semibold tracking-wider text-primary uppercase transition-colors"
                href="/projects"
              >
                Projects
              </Link>
              <Link
                className="text-xs font-semibold tracking-wider text-gray-300 hover:text-white uppercase transition-colors"
                href="/insights"
              >
                Lab
              </Link>
            </nav>
            <button className="px-5 py-2 border border-primary/50 text-primary rounded-lg hover:bg-primary hover:text-black transition-all duration-300 text-sm font-bold">
              DASHBOARD
            </button>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* Hero Section */}
          <header className="mb-20 text-center lg:text-left grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-[0.2em] uppercase mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Project Active
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-4 leading-none">
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
                <button className="px-8 py-4 bg-primary text-black font-bold rounded-lg hover:scale-105 transition-transform neon-glow">
                  Explore Interface
                </button>
                <button className="px-8 py-4 bg-white/5 border border-white/10 font-bold rounded-lg hover:bg-white/10 transition-colors">
                  View Source
                </button>
              </div>
            </div>
            <div className="relative group">
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
            </div>
          </header>

          {/* Overview Section */}
          <section className="mb-24">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Overview Card 1 */}
              <div className="glass-card p-8 rounded-lg hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Real-time Processing</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Latency-free data streaming through optimized WebSockets and
                  edge-side inference nodes.
                </p>
              </div>
              {/* Overview Card 2 */}
              <div className="glass-card p-8 rounded-lg hover:border-[#9d00ff]/50 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-[#9d00ff]/10 flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-[#9d00ff]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Neural Mapping</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Dynamic 3D representation of thought-pattern vectors using
                  proprietary spatial algorithms.
                </p>
              </div>
              {/* Overview Card 3 */}
              <div className="glass-card p-8 rounded-lg hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Quantum Encryption</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  End-to-end security protocols ensuring neural data integrity
                  and absolute user privacy.
                </p>
              </div>
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
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold mb-2">Development Roadmap</h2>
              <p className="text-gray-400">
                Tracking the evolution of Neural-Link
              </p>
            </div>
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Milestone 1 */}
              <div className="flex items-start gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border-2 border-primary bg-primary/20 flex items-center justify-center z-10">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                  </div>
                  <div className="w-px h-full bg-linear-to-b from-primary to-transparent -mt-1"></div>
                </div>
                <div className="flex-1 pb-10">
                  <div className="glass-card p-6 rounded-lg group-hover:bg-white/5 transition-colors">
                    <span className="text-primary text-xs font-bold uppercase tracking-widest">
                      Q1 2024 • Completed
                    </span>
                    <h4 className="text-xl font-bold mt-1 mb-2">
                      Alpha Simulation Engine
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Initial launch of the 3D neural pathing algorithm and core
                      dashboard architecture.
                    </p>
                  </div>
                </div>
              </div>
              {/* Milestone 2 */}
              <div className="flex items-start gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center z-10">
                    <div className="w-3 h-3 bg-primary/40 rounded-full animate-pulse"></div>
                  </div>
                  <div className="w-px h-full bg-linear-to-b from-primary/50 to-[#9d00ff]/50 -mt-1"></div>
                </div>
                <div className="flex-1 pb-10">
                  <div className="glass-card p-6 rounded-lg border-l-4 border-l-primary">
                    <span className="text-primary text-xs font-bold uppercase tracking-widest">
                      Q2 2024 • In Progress
                    </span>
                    <h4 className="text-xl font-bold mt-1 mb-2">
                      Bilateral Logic Synthesis
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Integrating real-time AI logic feedback loops and
                      multi-user visualization synchronization.
                    </p>
                  </div>
                </div>
              </div>
              {/* Milestone 3 */}
              <div className="flex items-start gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border-2 border-gray-700 bg-gray-800 flex items-center justify-center z-10">
                    <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="glass-card p-6 rounded-lg">
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                      Q4 2024 • Planned
                    </span>
                    <h4 className="text-xl font-bold mt-1 mb-2">
                      Mainnet Neural Node Mesh
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Public deployment of the decentralized processing network
                      and community node API.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="relative rounded-4xl overflow-hidden p-12 text-center bg-[#0a0a0a] border border-white/10">
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
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 mt-24 py-12">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center font-bold text-[10px]">
                KC
              </div>
              <span className="text-sm font-semibold text-gray-400">
                © {new Date().getFullYear()} KasauliCoder Lab.
              </span>
            </div>
            <div className="flex gap-6 text-xs font-bold text-gray-500 uppercase tracking-widest">
              <Link
                className="hover:text-primary transition-colors"
                href="/privacy"
              >
                Privacy
              </Link>
              <Link
                className="hover:text-primary transition-colors"
                href="/terms"
              >
                Terms
              </Link>
              <Link
                className="hover:text-primary transition-colors"
                href="/contact"
              >
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default GeneratedScreen;
