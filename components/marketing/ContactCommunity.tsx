"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";

const ContactCommunity = () => {
  return (
    <div className="font-display bg-background-dark text-slate-100 min-h-screen selection:bg-primary selection:text-background-dark">
      <GlobalHeader />

      <main className="pt-28">
        {/* Section 1: Registration Form */}
        <section className="relative py-20 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,242,255,0.05)_0%,transparent_50%)]"></div>
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-xs font-bold uppercase tracking-widest mb-4">
                Cohort 4.0
              </span>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                Secure Your Spot in the{" "}
                <span className="text-primary italic">Digital Frontier.</span>
              </h1>
              <p className="text-slate-400 text-lg mb-8 max-w-lg">
                Our intensive development program is designed for those looking
                to master high-level AI integration and modern web architecture.
              </p>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 p-4 bg-primary/5 border border-primary/20 rounded-lg max-w-sm"
              >
                <span className="material-symbols-outlined text-primary animate-pulse">
                  error_outline
                </span>
                <div>
                  <p className="font-bold text-primary">
                    Limited Seats Remaining
                  </p>
                  <p className="text-sm text-slate-400">
                    Only 4 slots left for the September intake!
                  </p>
                </div>
              </motion.div>
              <p className="mt-6 text-xs text-slate-500 italic">
                * Note: This is a premium, paid professional development
                opportunity.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-xl shadow-2xl"
            >
              <form action="#" className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">
                    Full Name
                  </label>
                  <input
                    className="w-full bg-background-dark/50 border border-slate-700 rounded-lg focus:ring-primary focus:border-primary text-slate-100 px-4 py-3 outline-none"
                    placeholder="John Doe"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">
                    Email Address
                  </label>
                  <input
                    className="w-full bg-background-dark/50 border border-slate-700 rounded-lg focus:ring-primary focus:border-primary text-slate-100 px-4 py-3 outline-none"
                    placeholder="john@example.com"
                    type="email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">
                    Select Plan
                  </label>
                  <select className="w-full bg-background-dark/50 border border-slate-700 rounded-lg focus:ring-primary focus:border-primary text-slate-100 px-4 py-3 appearance-none outline-none">
                    <option>Basic Access - $499</option>
                    <option>Pro Developer - $999</option>
                    <option>Elite Mentorship - $1,499</option>
                  </select>
                </div>
                <button
                  className="w-full bg-primary text-background-dark font-bold py-4 rounded-lg hover:shadow-[0_0_30px_rgba(0,242,255,0.3)] transition-all uppercase tracking-widest"
                  type="submit"
                >
                  Initialize Registration
                </button>
              </form>
            </motion.div>
          </div>
        </section>

        {/* Section 2: Blog/Articles */}
        <section className="py-24 px-6 bg-slate-950/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex justify-between items-end mb-12"
            >
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  Insights from the{" "}
                  <span className="text-primary italic">Edge</span>
                </h2>
                <p className="text-slate-400">
                  Deep dives into engineering and market trends.
                </p>
              </div>
              <Link
                className="text-primary text-sm font-bold flex items-center gap-2 hover:underline"
                href="/insights"
              >
                VIEW ALL ARTICLES{" "}
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </Link>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "The LLM Revolution: Beyond Simple Prompts",
                  desc: "How we are integrating autonomous agents into enterprise-grade web applications...",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUjIZwuLqWl6dh4eOlGFo0ycE-j-7Skh1aS9OeZFXr-W0GtoUD5Bi9RdAfpUeqGwyTFhhKNOHk1mTyTUeVvQYPyUT4cFClDQJAzzjppbduoa6b7Sk1OB5lGuNM7-Td33UMuriw6PR83vvmXhl-BsZFohNPTGXTDu_a0Sazv0PiGzVo85ljuxki-fF8Fl9-jJhcsq09WgOAeArUw8M3i9tuSg4ctWNYBJNn_h--ln5NoixTpJ3GBRovIpfGbLI76H9tFjopuiWdhEM",
                  cat: "AI Development",
                },
                {
                  title: "Scaling to 1M Users with Edge Functions",
                  desc: "A post-mortem on our latest architectural shift and the 40% performance gain we achieved...",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3tqacELC7IOG5O5GCGl4b1Pvu9Tcuvukohvh1-dCo-7cbB_23Y0k_b8Z6n6VODn_Qza4M1Sw1DKmIDcoCZY_XjsdQV_gjaEsJ9Rn9qby8jd5NkJAvtDisbTCN3EMfqD4fZq2NstWFQpiO_arauxtl3i6V4ATdpsaA7HzqwxbjpO4rEGf_w0b-dd9p9tM55Ar1D1ydB2EZG0r20ymuIxBQsLk7i0hXf7EMSOUcSyxi76YmGt6TWxjsZ_BoHecN0WXvuMAFs518bK0",
                  cat: "Case Studies",
                },
                {
                  title: "Modern Web: The End of Multi-Page Apps?",
                  desc: "Exploring the convergence of server-side rendering and client-side interactivity in 2024...",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNnjilOXJ2vNg1jhZIkl3rk7kWphobcBmiIDBuiHotGtlU3DsWvUK6HMkjU088hyStkEA2ODgHUM64dREkN5DPhc9vJNSB58Afe9Qc7kUl29l3FB5kS9yEsd4RZFLAueeC9P6vvt2hc0h0Ab1Ry9JFQI5FbFy6dIDd63jDfOuxsrutcyTNE77V8GQ-L_at8DN7wj_CPy5Ay0yG2SVtsNKZtmSMtyBSL48qcu_Hu3WXwS-deVMbgs-qFJ-SXcSbelHDLiQFc_B-BVA",
                  cat: "Architecture",
                },
              ].map((article, i) => (
                <motion.div
                  key={article.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-white/5">
                    <Image
                      src={article.img}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-background-dark/80 backdrop-blur px-3 py-1 rounded text-[10px] font-bold text-primary uppercase border border-primary/30">
                      {article.cat}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    {article.desc}
                  </p>
                  <span className="text-xs text-slate-500">
                    5 min read • Aug {24 - i * 6}, 2023
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Reviews/Testimonials */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold mb-4">
                Verified{" "}
                <span className="text-stroke text-transparent">Success</span>{" "}
                Stories
              </h2>
              <p className="text-slate-400">
                Join 500+ developers who leveled up their career with us.
              </p>
            </motion.div>
            <div className="flex flex-nowrap overflow-x-auto gap-8 pb-12 scrollbar-hide snap-x">
              {[
                {
                  name: "Alex Rivera",
                  role: "Lead Dev @ TechStream",
                  text: "The curriculum at KasauliCoder is intense but rewarding. I went from a junior dev to leading an AI-focused team in just 4 months. The mentorship is world-class.",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYX_GJGdVa2g53ZXo_gYvIyWUEOMbtekO9Pwf3eqiSIGYQkNjEgV4GH8Yzka5egS4_YO9FS9HQ6w7GywJfEEqpRvCWvH5qyxjURHB3Q8oGBCqXz1hw--o8OdAUG_smLp7LOOroojOfiS0ZMBJFj6x5hfokFhC2CIClPeSuawOZcZaPdEijAyS2p6xtjtpClWgdgCsKF-HVEFnXgIPLmjxAA6TinWNrEmIIXhehdtkr5e7XfjXInRpkQZSUwAm-Cd91blgvqRi7alk",
                },
                {
                  name: "Sarah Chen",
                  role: "Senior Architect @ CloudScale",
                  text: "The focus on architectural patterns rather than just syntax changed the way I think about code. It's not just a course; it's an engineering mindset upgrade.",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC8uhV46FrtfwSfk6jmFCi31HGf8a6gEI_3XJnWQr7loXgo96DZq0Td5zA66tRu_OhcQdADAC8B4cBJhmTpLzUTYeq6DMCdRRAuFE5c-cxl4Fvjdr1lrBjl3OHbG-yhGtpJSVyq6J7fyaq-exlgYHUbK5Z7YLSuRUuLz4dtUTm7j8EFDzAjCWzUTLiwV8muyLfL-uRNPc1DJxAsZ5DsKvVHwFZZyU5CPgCMvRNnJnun43rUK2Gx9B3uSjHjks4KzY55Ia8SaeqOw-8",
                },
                {
                  name: "Marcus Thorne",
                  role: "Fullstack Dev @ NeonLabs",
                  text: "Finally, a program that bridges the gap between 'Hello World' and professional enterprise systems. Worth every penny of the investment.",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBoUehh7Ba7_0RCwqxlTyWJUxC33htuRfgzpqbvJWncHUh_i2Ei4Cgei3ixbh_KjGAgnbL486YoC4lfqCWUzcVkzWGGJwBzBaHtPYbgLAIKE5cblHNAujZK8fLRRQFnPvRJmjSPEMkuoUPSIlLchsAjpX97bTVNP4_uZI-sDkTnbQWpY6c2XT9icI5QE8Hbq2_g-FUcJ8I2nHf9D9fj71tnD8RALfm4M7Nhv6Ui0c2oS15x624yXfgYMk3xdLVRHH9kmcK5BPqSPWc",
                },
              ].map((testi, i) => (
                <motion.div
                  key={testi.name}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="min-w-87.5 md:min-w-112.5 snap-center bg-background-dark border border-slate-800 p-8 rounded-xl relative group"
                >
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center border border-primary/40">
                    <span className="material-symbols-outlined text-primary">
                      format_quote
                    </span>
                  </div>
                  <div className="flex gap-1 text-primary mb-6">
                    {[...Array(5)].map((_, j) => (
                      <span
                        key={j}
                        className="material-symbols-outlined text-sm"
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <p className="text-slate-300 italic mb-8 leading-relaxed">
                    "{testi.text}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border border-primary/30 p-0.5 relative overflow-hidden">
                      <Image
                        src={testi.img}
                        alt={testi.name}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100">{testi.name}</h4>
                      <p className="text-xs text-slate-500">{testi.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-4">
              <div className="w-8 h-1 bg-primary rounded-full"></div>
              <div className="w-2 h-1 bg-slate-700 rounded-full"></div>
              <div className="w-2 h-1 bg-slate-700 rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Final CTA / Footer Note */}
        <section className="py-12 border-t border-white/5 bg-background-dark">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-xs uppercase">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                Next Batch: September 15th
              </div>
              <h2 className="text-2xl font-bold">Ready to build the future?</h2>
              <div className="flex gap-4">
                <Link
                  href="/register"
                  className="bg-primary text-background-dark px-8 py-3 rounded font-bold hover:scale-105 transition-transform"
                >
                  REGISTER NOW
                </Link>
                <Link
                  href="/contact"
                  className="border border-slate-700 px-8 py-3 rounded font-bold hover:bg-white/5 transition-colors"
                >
                  BOOK A CONSULTATION
                </Link>
              </div>
              <p className="text-slate-500 text-sm max-w-lg">
                Enrollment is subject to review. We ensure a high-quality cohort
                by matching students with similar skill levels. This is a paid
                professional training.
              </p>
            </div>
          </div>
        </section>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default ContactCommunity;
