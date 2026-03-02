"use client";

import React, { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";
import HomeUpcomingEventsStats from "@/components/home/HomeUpcomingEventsStats";
import HomeTeamWorkTestimonials from "@/components/home/HomeTeamWorkTestimonials";

const HomeVisionHero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="font-display text-foreground antialiased overflow-x-hidden">
      <GlobalHeader />

      <main className="pt-28">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center px-6 overflow-hidden bg-transparent">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10 max-w-4xl text-center"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                SaaS Solutions & Digital Growth
              </span>
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight text-foreground"
            >
              SaaS Solutions that <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                Drive Growth
              </span>
              <div className="text-xl md:text-2xl font-bold text-foreground/40 mt-2">
                Built with Next.js, SEO & Automation
              </div>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-foreground/60 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              We build high-performance SaaS platforms, SEO strategies,
              automated workflows, and modern web experiences — backed by 24/7
              business support.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap"
            >
              <Link href="/programs">
                <button className="w-full sm:w-auto px-8 py-4 bg-primary text-background font-black rounded-xl neon-glow hover:scale-105 transition-all flex items-center justify-center gap-2">
                  🚀 See Solutions
                </button>
              </Link>
              <Link href="/programs">
                <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-foreground font-bold rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm flex items-center justify-center gap-2">
                  🔍 Boost Your SEO
                </button>
              </Link>
              <Link href="/contact">
                <button className="w-full sm:w-auto px-8 py-4 bg-transparent border border-primary/30 text-primary font-bold rounded-xl hover:bg-primary/10 transition-all backdrop-blur-sm flex items-center justify-center gap-2">
                  📞 Talk to Our Team
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Highlights Section */}
        <section className="py-20 px-6 bg-transparent border-t border-b border-white/5 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                {
                  title: "Custom SaaS",
                  desc: "Tailored enterprise solutions",
                  icon: "architecture",
                },
                {
                  title: "Fast Delivery",
                  desc: "Launch in weeks, not months",
                  icon: "speed",
                },
                {
                  title: "24/7 Support",
                  desc: "Reliable business continuity",
                  icon: "support_agent",
                },
                {
                  title: "Scalable Tech",
                  desc: "Built to grow with your needs",
                  icon: "hub",
                },
              ].map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 glass-morphism hover:border-primary/50 transition-colors group cursor-default"
                >
                  <div className="size-16 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                    <span className="material-symbols-outlined text-3xl text-primary">
                      {highlight.icon}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {highlight.title}
                  </h3>
                  <p className="text-sm text-foreground/60">{highlight.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-24 px-6 bg-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4">
                  Services
                </h2>
                <h3 className="text-4xl md:text-5xl font-black text-foreground mb-6 leading-tight">
                  Everything Your Business Needs <br />
                  <span className="text-primary">— From Website to Growth</span>
                </h3>
                <p className="text-lg text-foreground/60 mb-8 leading-relaxed">
                  We don't just build websites; we build engines for business
                  success. Our team specializes in delivering high-performance
                  solutions that scale with your growth.
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    {
                      icon: "developer_mode",
                      title: "SaaS Development",
                      desc: "Built with Next.js, TypeScript, and modern stacks for maximum performance and scalability.",
                    },
                    {
                      icon: "trending_up",
                      title: "Full SEO Services",
                      desc: "Strategic SEO implementations that boost organic traffic and improve search engine rankings.",
                    },
                    {
                      icon: "robot_2",
                      title: "Business Automations",
                      desc: "Custom workflows and AI integrations that save time, reduce errors, and cut operational costs.",
                    },
                    {
                      icon: "auto_awesome",
                      title: "Futuristic UI/UX",
                      desc: "Stunning, interactive designs that provide premium user experiences and drive conversions.",
                    },
                    {
                      icon: "support_agent",
                      title: "Ongoing Support",
                      desc: "24/7 business support and continuous growth guidance to ensure your platform stays ahead.",
                    },
                  ].map((service, i) => (
                    <motion.div
                      key={service.title}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * i }}
                      className="flex gap-4 p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
                    >
                      <div className="size-12 rounded-lg bg-primary/10 border border-primary/20 shrink-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">
                          {service.icon}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-foreground mb-1">
                          {service.title}
                        </h4>
                        <p className="text-foreground/60 text-xs">
                          {service.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="absolute -inset-1 bg-linear-to-r from-primary/30 to-secondary/30 blur-2xl rounded-3xl opacity-50"></div>
                <div className="relative glass-morphism rounded-3xl p-8 border border-white/10 flex flex-col gap-6">
                  <div className="aspect-video rounded-xl overflow-hidden relative border border-white/5">
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3tqacELC7IOG5O5GCGl4b1Pvu9Tcuvukohvh1-dCo-7cbB_23Y0k_b8Z6n6VODn_Qza4M1Sw1DKmIDcoCZY_XjsdQV_gjaEsJ9Rn9qby8jd5NkJAvtDisbTCN3EMfqD4fZq2NstWFQpiO_arauxtl3i6V4ATdpsaA7HzqwxbjpO4rEGf_w0b-dd9p9tM55Ar1D1ydB2EZG0r20ymuIxBQsLk7i0hXf7EMSOUcSyxi76YmGt6TWxjsZ_BoHecN0WXvuMAFs518bK0"
                      alt="Modern Dashboard Interface"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-background/20"></div>
                    <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur-md p-4 rounded-lg border border-white/10 flex items-center justify-between">
                      <div>
                        <p className="text-foreground font-bold text-sm">
                          Hotelier Pro ERP
                        </p>
                        <p className="text-primary text-[10px] tracking-widest uppercase mt-1">
                          Live Dashboard
                        </p>
                      </div>
                      <button className="bg-primary text-background text-xs font-bold px-3 py-1.5 rounded">
                        View
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl border border-white/10 p-4 relative overflow-hidden group">
                      <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNnjilOXJ2vNg1jhZIkl3rk7kWphobcBmiIDBuiHotGtlU3DsWvUK6HMkjU088hyStkEA2ODgHUM64dREkN5DPhc9vJNSB58Afe9Qc7kUl29l3FB5kS9yEsd4RZFLAueeC9P6vvt2hc0h0Ab1Ry9JFQI5FbFy6dIDd63jDfOuxsrutcyTNE77V8GQ-L_at8DN7wj_CPy5Ay0yG2SVtsNKZtmSMtyBSL48qcu_Hu3WXwS-deVMbgs-qFJ-SXcSbelHDLiQFc_B-BVA"
                        fill
                        className="object-cover opacity-50 group-hover:scale-110 transition-transform duration-700"
                        alt="edu"
                      />
                      <p className="relative z-10 text-foreground font-bold text-sm drop-shadow-lg">
                        EduConnect System
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-xl border border-white/10 p-4 relative overflow-hidden group">
                      <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtWew6lCblRoK84au8NTbJXud-LUukQH11GxXo9mQ2cdgB2EipW8sxGeAShmaRBTjIyHMZLC1PKU65A-f8UJQTVMfKajPUE1ovBcQVv7CY7pDr7O10Cw-_fSNKRcRgtfojWpuskNGQUSN0v4JBRcdJ-JcT_oXHV1vnBCeT5V3wJfim2NZONV2gGshMvHVx-C8uVUzANJJfjpUj1V78Kvj6qRBxtlH6Q-na2TL2V9_xmsXG68kCV5o21l4c4zhkReBLD6384OS53So"
                        fill
                        className="object-cover opacity-50 group-hover:scale-110 transition-transform duration-700"
                        alt="retail"
                      />
                      <p className="relative z-10 text-foreground font-bold text-sm drop-shadow-lg">
                        Retail Analytics
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Portfolio Showcase */}
        <section className="py-24 px-6 relative overflow-hidden bg-transparent">
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">
                Featured Projects
              </h2>
              <p className="text-foreground/60 max-w-2xl mx-auto">
                These aren't just student projects. These are fully functional
                SaaS tools and AI engines built by our members.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "AI SaaS Boilerplate",
                  outcome: "Launch a fully integrated SaaS in weeks",
                  desc: "Built with Next.js, Tailwind, Stripe — Scalable, Fast & SEO-ready.",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkqmd6cJ7Wo_yDBHW_RPBs0jEDLP_5yGUKaiymSgG9DStDhLLyv_MfNRr64wdHehQ_-AwP-GTQdjknMP2n3hMsUIW3mz9UkP4WS1QM0g7HE3oit1cCuvGt4Km1c4AWMVcAQI2d-HD7RJQhwNLgwcim0tAd1CBGVP4fxw8A8vK9XbJZigKLZmoGIw8kjn7yLvGOtWWqXOLKtqB02IBEQkr6lQxNWgfFc3X9zO1Q_snOR_QKXqb5c-6kFil2mVoev1HNdDDkzWILZcg",
                  tags: ["NEXT.JS", "TAILWIND", "STRIPE"],
                },
                {
                  title: "Workflow Orchestrator",
                  outcome: "Automation that cut admin time by 45%",
                  desc: "Enterprise-grade automation tool using agentic workflows to handle complex business tasks.",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLrZzBC1qPl3IPuDIaSy-GKLLHwvLxkZsxxvbbOSzEatZWcj4t8qWNQWHrHHZFbGDLt4kQFHeCOqYmO3pxpaZpoj-59M5O0oVelGvhHBtpSxmKmBAIIosXU2g0zurUXwkPBBk4FAkV0QYeONeiRphAm6YV9DOPVmFsRDip7Hw06auAffUB73YjV7E6S4IIHqEZs5tmJUmUc7BJss2vUnOj4t-HhEiHP5rHxe1aWRMpQmyJn4yQbi5mPOOrNusRk6sn_Zd_kpPalNc",
                  tags: ["PYTHON", "LANGCHAIN", "ZAPIER"],
                },
                {
                  title: "AI Content Analytics",
                  outcome: "Real-time insights dashboards with Next.js",
                  desc: "Full-stack dashboard with real-time visualizations of LLM outputs and performance metrics.",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtWew6lCblRoK84au8NTbJXud-LUukQH11GxXo9mQ2cdgB2EipW8sxGeAShmaRBTjIyHMZLC1PKU65A-f8UJQTVMfKajPUE1ovBcQVv7CY7pDr7O10Cw-_fSNKRcRgtfojWpuskNGQUSN0v4JBRcdJ-JcT_oXHV1vnBCeT5V3wJfim2NZONV2gGshMvHVx-C8uVUzANJJfjpUj1V78Kvj6qRBxtlH6Q-na2TL2V9_xmsXG68kCV5o21l4c4zhkReBLD6384OS53So",
                  tags: ["NEXT.JS", "OPENAI", "THREE.JS"],
                },
              ].map((project, i) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 * i }}
                  whileHover={{ y: -5 }}
                  className="group relative flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all"
                >
                  <div className="aspect-video overflow-hidden relative">
                    <div className="w-full h-full relative">
                      <Image
                        src={project.img}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex gap-2 mb-4">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-primary/10 text-[10px] font-bold text-primary rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h4 className="text-xl font-black text-foreground mb-1">
                      {project.title}
                    </h4>
                    <p className="text-primary text-sm font-bold mb-3 italic">
                      {project.outcome}
                    </p>
                    <p className="text-foreground/60 text-xs mb-6 flex-1">
                      {project.desc}
                    </p>

                    <a
                      className="text-primary text-sm font-bold flex items-center gap-2 group/link"
                      href="#"
                    >
                      View Case Study{" "}
                      <span className="material-symbols-outlined text-sm group-hover/link:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          {/* Background Decoration */}
          <div className="absolute bottom-0 left-0 w-full h-64 bg-linear-to-t from-primary/5 to-transparent pointer-events-none"></div>
        </section>

        <HomeUpcomingEventsStats />

        <HomeTeamWorkTestimonials />

        {/* Final CTA Section */}
        <section className="py-24 px-6 bg-transparent">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto glass-morphism border border-primary/20 rounded-3xl p-12 text-center neon-glow"
          >
            <h2 className="text-4xl font-black text-foreground mb-6">
              Ready to build the future?
            </h2>
            <p className="text-foreground/60 mb-10 text-lg max-w-xl mx-auto">
              Stop watching tutorials. Join a cohort of creators and start
              building production-ready AI applications today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-10 py-4 bg-primary text-background font-black rounded-xl hover:scale-105 transition-all">
                Secure Your Spot
              </button>
              <button className="px-10 py-4 bg-white/5 border border-white/10 text-foreground font-bold rounded-xl hover:bg-white/10 transition-all">
                Download Curriculum
              </button>
            </div>
            <div className="mt-8 text-xs font-bold text-foreground/40 uppercase tracking-widest">
              Next Cohort Starts in 5 Days
            </div>
          </motion.div>
        </section>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default HomeVisionHero;
