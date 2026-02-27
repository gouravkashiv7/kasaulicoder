"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import GlobalHeader from "./GlobalHeader";
import GlobalFooter from "./GlobalFooter";

const InsightsArticles = () => {
  const articles = [
    {
      category: "AI Development",
      title: "The LLM Revolution: Beyond Simple Prompts",
      desc: "How we are integrating autonomous agents into enterprise-grade web applications...",
      readTime: "5 min read",
      date: "Aug 24, 2023",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBUjIZwuLqWl6dh4eOlGFo0ycE-j-7Skh1aS9OeZFXr-W0GtoUD5Bi9RdAfpUeqGwyTFhhKNOHk1mTyTUeVvQYPyUT4cFClDQJAzzjppbduoa6b7Sk1OB5lGuNM7-Td33UMuriw6PR83vvmXhl-BsZFohNPTGXTDu_a0Sazv0PiGzVo85ljuxki-fF8Fl9-jJhcsq09WgOAeArUw8M3i9tuSg4ctWNYBJNn_h--ln5NoixTpJ3GBRovIpfGbLI76H9tFjopuiWdhEM",
    },
    {
      category: "Case Studies",
      title: "Scaling to 1M Users with Edge Functions",
      desc: "A post-mortem on our latest architectural shift and the 40% performance gain we achieved...",
      readTime: "8 min read",
      date: "Aug 12, 2023",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD3tqacELC7IOG5O5GCGl4b1Pvu9Tcuvukohvh1-dCo-7cbB_23Y0k_b8Z6n6VODn_Qza4M1Sw1DKmIDcoCZY_XjsdQV_gjaEsJ9Rn9qby8jd5NkJAvtDisbTCN3EMfqD4fZq2NstWFQpiO_arauxtl3i6V4ATdpsaA7HzqwxbjpO4rEGf_w0b-dd9p9tM55Ar1D1ydB2EZG0r20ymuIxBQsLk7i0hXf7EMSOUcSyxi76YmGt6TWxjsZ_BoHecN0WXvuMAFs518bK0",
    },
    {
      category: "Architecture",
      title: "Modern Web: The End of Multi-Page Apps?",
      desc: "Exploring the convergence of server-side rendering and client-side interactivity in 2024...",
      readTime: "6 min read",
      date: "Jul 28, 2023",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBNnjilOXJ2vNg1jhZIkl3rk7kWphobcBmiIDBuiHotGtlU3DsWvUK6HMkjU088hyStkEA2ODgHUM64dREkN5DPhc9vJNSB58Afe9Qc7kUl29l3FB5kS9yEsd4RZFLAueeC9P6vvt2hc0h0Ab1Ry9JFQI5FbFy6dIDd63jDfOuxsrutcyTNE77V8GQ-L_at8DN7wj_CPy5Ay0yG2SVtsNKZtmSMtyBSL48qcu_Hu3WXwS-deVMbgs-qFJ-SXcSbelHDLiQFc_B-BVA",
    },
  ];

  return (
    <div className="font-display bg-background-dark text-slate-100 min-h-screen selection:bg-primary selection:text-background-dark">
      <GlobalHeader />

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              Insights from the{" "}
              <span className="text-primary italic">Edge</span>
            </h1>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto">
              Deep dives into engineering, AI integration, and the future of web
              architecture.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {articles.map((article, i) => (
              <motion.div
                key={article.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 border border-white/5 shadow-2xl">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-background-dark/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase border border-primary/30 tracking-widest">
                    {article.category}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
                  {article.title}
                </h3>
                <p className="text-slate-400 text-base leading-relaxed mb-6">
                  {article.desc}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-widest">
                  <span>{article.readTime}</span>
                  <span>{article.date}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Newsletter Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-32 p-12 rounded-3xl bg-primary/5 border border-primary/20 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-glow-radial opacity-30"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-4 underline decoration-primary/30 underline-offset-8">
                Stay Ahead of the Curve
              </h2>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                Get monthly deep dives on AI workflows and production-level
                engineering strategies delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-background-dark border border-slate-700 rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary outline-none"
                />
                <button className="bg-primary text-background-dark font-black px-8 py-4 rounded-xl hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all">
                  SUBSCRIBE
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <div className="mt-24">
        <GlobalFooter />
      </div>
    </div>
  );
};

export default InsightsArticles;
