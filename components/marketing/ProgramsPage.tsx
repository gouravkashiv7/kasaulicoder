"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";

const ProgramsPage = () => {
  const programs = [
    {
      title: "Impact Hackathons",
      tagline: "24 Hours of Pure Innovation",
      desc: "Solve real-world problems for local industries and win mentorship grants, hardware, or project funding.",
      features: [
        "Real Industry Challenges",
        "Live Mentorship",
        "Peer-to-Peer Learning",
      ],
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBUjIZwuLqWl6dh4eOlGFo0ycE-j-7Skh1aS9OeZFXr-W0GtoUD5Bi9RdAfpUeqGwyTFhhKNOHk1mTyTUeVvQYPyUT4cFClDQJAzzjppbduoa6b7Sk1OB5lGuNM7-Td33UMuriw6PR83vvmXhl-BsZFohNPTGXTDu_a0Sazv0PiGzVo85ljuxki-fF8Fl9-jJhcsq09WgOAeArUw8M3i9tuSg4ctWNYBJNn_h--ln5NoixTpJ3GBRovIpfGbLI76H9tFjopuiWdhEM",
      cta: "Register for Next Hack",
    },
    {
      title: "Live Industry Projects",
      tagline: "Build for the Real World",
      desc: "Collaborate on production-grade applications for our partners in Hospitality, Education, and Retail.",
      features: [
        "Agile Workflow",
        "Production Deployment",
        "Stack Versatility",
      ],
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD3tqacELC7IOG5O5GCGl4b1Pvu9Tcuvukohvh1-dCo-7cbB_23Y0k_b8Z6n6VODn_Qza4M1Sw1DKmIDcoCZY_XjsdQV_gjaEsJ9Rn9qby8jd5NkJAvtDisbTCN3EMfqD4fZq2NstWFQpiO_arauxtl3i6V4ATdpsaA7HzqwxbjpO4rEGf_w0b-dd9p9tM55Ar1D1ydB2EZG0r20ymuIxBQsLk7i0hXf7EMSOUcSyxi76YmGt6TWxjsZ_BoHecN0WXvuMAFs518bK0",
      cta: "Explore Live Projects",
    },
    {
      title: "Placement Accelerator",
      tagline: "From the Hills to the Hub",
      desc: "Our elite cohort designed for final-year students and professionals looking to transition to top-tier tech roles.",
      features: [
        "Mock Interviews",
        "Resume Optimization",
        "100% Placement Support",
      ],
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBNnjilOXJ2vNg1jhZIkl3rk7kWphobcBmiIDBuiHotGtlU3DsWvUK6HMkjU088hyStkEA2ODgHUM64dREkN5DPhc9vJNSB58Afe9Qc7kUl29l3FB5kS9yEsd4RZFLAueeC9P6vvt2hc0h0Ab1Ry9JFQI5FbFy6dIDd63jDfOuxsrutcyTNE77V8GQ-L_at8DN7wj_CPy5Ay0yG2SVtsNKZtmSMtyBSL48qcu_Hu3WXwS-deVMbgs-qFJ-SXcSbelHDLiQFc_B-BVA",
      cta: "Apply for Cohort",
    },
  ];

  return (
    <div className="bg-background-dark text-slate-100 min-h-screen font-display selection:bg-primary selection:text-background-dark">
      <GlobalHeader />

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="max-w-3xl mb-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
                Accelerate Your{" "}
                <span className="text-primary italic">Career Path.</span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl leading-relaxed">
                Whether you're looking to compete, contribute, or get placed,
                our programs are designed to push your boundaries and deliver
                tangible results.
              </p>
            </motion.div>
          </div>

          {/* Program Cards */}
          <div className="space-y-40">
            {programs.map((program, i) => (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className={`flex flex-col ${i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} gap-16 items-center`}
              >
                <div className="flex-1 space-y-8">
                  <div>
                    <span className="text-primary font-bold tracking-widest text-xs uppercase mb-3 inline-block">
                      {program.tagline}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
                      {program.title}
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed">
                      {program.desc}
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {program.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-3 bg-white/5 border border-white/5 p-4 rounded-xl"
                      >
                        <span className="material-symbols-outlined text-primary text-sm">
                          rocket_launch
                        </span>
                        <span className="text-sm font-semibold text-slate-200">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 bg-primary text-background-dark font-bold px-8 py-4 rounded-xl hover:shadow-[0_0_25px_rgba(0,242,255,0.4)] transition-all hover:scale-105"
                  >
                    {program.cta}
                    <span className="material-symbols-outlined text-sm font-black">
                      arrow_forward
                    </span>
                  </Link>
                </div>

                <div className="flex-1 relative aspect-square lg:aspect-video w-full">
                  <div className="absolute -inset-2 bg-linear-to-tr from-primary/20 via-transparent to-purple-500/20 rounded-3xl blur-2xl"></div>
                  <div className="relative h-full w-full rounded-3xl overflow-hidden border border-white/10 glass-card">
                    <Image
                      src={program.image}
                      alt={program.title}
                      fill
                      className="object-cover opacity-80 hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-background-dark/80 via-transparent to-transparent"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Placement Stats / Partnership */}
          <div className="mt-40 pt-24 border-t border-white/5">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-8">
                  Trusted by Local & Global Partners
                </h2>
                <p className="text-slate-400 text-lg mb-10">
                  Our students have gone on to build solutions for businesses in
                  Kasauli and secure roles in the world's most innovative tech
                  hubs.
                </p>
                <div className="flex flex-wrap gap-8 opacity-40 grayscale items-center">
                  {/* Placeholder logos or brand names */}
                  <span className="text-2xl font-black tracking-tighter">
                    CLOUDWARE
                  </span>
                  <span className="text-2xl font-black tracking-tighter">
                    NEXUS.IO
                  </span>
                  <span className="text-2xl font-black tracking-tighter">
                    SKYNET
                  </span>
                  <span className="text-2xl font-black tracking-tighter">
                    APEXLABS
                  </span>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 p-10 rounded-3xl relative overflow-hidden text-center lg:text-left">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full"></div>
                <h3 className="text-2xl font-bold mb-4">
                  Want to partner with us?
                </h3>
                <p className="text-slate-400 mb-8">
                  Collaborate on live projects, sponsor a hackathon, or hire
                  from our elite pool of talent.
                </p>
                <Link
                  href="/contact"
                  className="inline-block text-primary font-bold hover:underline"
                >
                  Contact Partnership Team →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default ProgramsPage;
