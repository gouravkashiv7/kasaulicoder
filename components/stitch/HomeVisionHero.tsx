"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

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
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden">
      {/* Header / Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link
              href="/"
              className="flex items-center gap-3 group cursor-pointer"
            >
              <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/30 group-hover:border-primary transition-colors">
                <span className="material-symbols-outlined text-primary text-2xl">
                  terminal
                </span>
              </div>
              <h2 className="text-xl font-black tracking-tighter text-slate-100">
                Kasauli<span className="text-primary">Coder</span>
              </h2>
            </Link>
          </motion.div>
          <nav className="hidden md:flex items-center gap-10">
            {["Vision", "About", "Projects", "Curriculum", "Pricing"].map(
              (item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <Link
                    className="text-sm font-medium hover:text-primary transition-colors"
                    href={item === "Vision" ? "/" : `/${item.toLowerCase()}`}
                  >
                    {item}
                  </Link>
                </motion.div>
              ),
            )}
          </nav>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Link
              href="/login"
              className="hidden sm:block text-sm font-bold text-slate-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-primary text-background-dark text-sm font-bold px-6 py-2.5 rounded-lg neon-glow hover:brightness-110 transition-all"
            >
              Join Now
            </Link>
          </motion.div>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center px-6 overflow-hidden hero-gradient">
          {/* Background Decorative Element */}
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.2, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsusT6goUDVPEYtFUtcweoh9GTj1LRmXHZE5N9XQJlm7ICHBiNfmsrhqsit-DuWpPKH_9VjcA2aJpZv58Lft6WMoV1Py5S_hgboLo9bG0XXyWxvbiYHeTFj4QEkWn_zENaKAezWroB8XfE228G-SGnhcuRfbT3g7sP3zw81FeWUDzEGYi51LHtbYLo4gxxrly2cRUGVOGXySZhyozxEWjEJOM1Ys0WmHhlj_eksiZTpKKSJrul5HF_9Q8Q_A8ECUdWmM6A4lsjrS8"
                alt="Futuristic 3D AI neural network visual representation"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
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
                Live Cohort Enrollment Open
              </span>
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight text-white"
            >
              Learn AI by Building <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-cyan-400">
                Real-World Projects
              </span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Work on live AI & full-stack projects, guided by industry-level
              workflows. Move beyond tutorials and start shipping production
              code.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button className="w-full sm:w-auto px-8 py-4 bg-primary text-background-dark font-black rounded-xl neon-glow hover:scale-105 transition-all flex items-center justify-2">
                Join Live Projects
                <span className="material-symbols-outlined">rocket_launch</span>
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm">
                View Plans
              </button>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="mt-16 flex items-center justify-center gap-8 grayscale opacity-50"
            >
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                Industry workflows used at
              </div>
              <div className="flex gap-6 items-center">
                <span className="material-symbols-outlined text-3xl">
                  terminal
                </span>
                <span className="material-symbols-outlined text-3xl">
                  developer_board
                </span>
                <span className="material-symbols-outlined text-3xl">
                  data_object
                </span>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Vision Section */}
        <section className="py-24 px-6 bg-[#0a1515]">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4">
                  Our Vision
                </h2>
                <h3 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                  Bridging the Gap: <br />
                  Theory to Industry
                </h3>
                <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                  Traditional education stops at syntax. We start at execution.
                  Our platform is designed to immerse you in the actual
                  environment of a high-growth tech startup.
                </p>
                <div className="space-y-6">
                  {[
                    {
                      icon: "schema",
                      title: "Real-world Workflows",
                      desc: "Master CI/CD, code reviews, and architectural patterns used by the top 1% of engineering teams.",
                    },
                    {
                      icon: "groups",
                      title: "Industry Mentorship",
                      desc: "Direct access to engineers building AI products in Silicon Valley and global tech hubs.",
                    },
                    {
                      icon: "auto_awesome_motion",
                      title: "Portfolio-first Approach",
                      desc: "Don't just get a certificate. Get a high-end portfolio of live, deployed AI applications.",
                    },
                  ].map((feature, i) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * i }}
                      className="flex gap-4"
                    >
                      <div className="size-12 rounded-lg bg-primary/10 border border-primary/20 shrink-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">
                          {feature.icon}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-slate-400 text-sm">{feature.desc}</p>
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
                <div className="absolute -inset-1 bg-linear-to-r from-primary/30 to-cyan-500/30 blur-2xl rounded-3xl opacity-50"></div>
                <div className="relative glass-morphism rounded-3xl p-8 border border-white/10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
                      system_architecture.v2
                    </div>
                  </div>
                  <div className="aspect-video rounded-xl bg-background-dark border border-white/5 p-4 overflow-hidden relative">
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7t_JfxjYDOw_7E7k4trNP12HO4iWzl6GBNMAtwTmw7VrZdfTy7LWYm99_wvo4fEAF-_nsBKhKzkWdtJBWW9lc7U21eUzNr7XOtXht9lZOFC2c7v7Nhv4FrZjNAFyizBHKy-zGi2cOuwsuwvjpTCfnQkUwvHoP1MTPc4OQpQHICBXKUwFINFMznC4TRCCz9eIvAov5z4hwWj6KHXBij0VrX-6XWFbLGf_peSzTpz7R0m4t0RBEhJZo2szsdXfxylz52knDjzj_1q0"
                      alt="Technical architecture diagram showing AI data flow"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                      <div className="text-primary font-black text-2xl mb-1">
                        92%
                      </div>
                      <div className="text-xs text-slate-400 uppercase font-bold tracking-tighter">
                        Placement Rate
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-white font-black text-2xl mb-1">
                        15+
                      </div>
                      <div className="text-xs text-slate-400 uppercase font-bold tracking-tighter">
                        Live Projects
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Portfolio Showcase */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Built in our Cohorts
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                These aren't just student projects. These are fully functional
                SaaS tools and AI engines built by our members.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "AI Content Analytics",
                  desc: "Full-stack dashboard with real-time 3D data visualizations of LLM outputs and performance metrics.",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtWew6lCblRoK84au8NTbJXud-LUukQH11GxXo9mQ2cdgB2EipW8sxGeAShmaRBTjIyHMZLC1PKU65A-f8UJQTVMfKajPUE1ovBcQVv7CY7pDr7O10Cw-_fSNKRcRgtfojWpuskNGQUSN0v4JBRcdJ-JcT_oXHV1vnBCeT5V3wJfim2NZONV2gGshMvHVx-C8uVUzANJJfjpUj1V78Kvj6qRBxtlH6Q-na2TL2V9_xmsXG68kCV5o21l4c4zhkReBLD6384OS53So",
                  tags: ["NEXT.JS", "OPENAI", "THREE.JS"],
                },
                {
                  title: "Workflow Orchestrator",
                  desc: "Enterprise-grade automation tool using agentic workflows to handle complex multi-step business tasks.",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLrZzBC1qPl3IPuDIaSy-GKLLHwvLxkZsxxvbbOSzEatZWcj4t8qWNQWHrHHZFbGDLt4kQFHeCOqYmO3pxpaZpoj-59M5O0oVelGvhHBtpSxmKmBAIIosXU2g0zurUXwkPBBk4FAkV0QYeONeiRphAm6YV9DOPVmFsRDip7Hw06auAffUB73YjV7E6S4IIHqEZs5tmJUmUc7BJss2vUnOj4t-HhEiHP5rHxe1aWRMpQmyJn4yQbi5mPOOrNusRk6sn_Zd_kpPalNc",
                  tags: ["PYTHON", "LANGCHAIN", "ZAPIER"],
                },
                {
                  title: "AI SaaS Boilerplate",
                  desc: "A production-ready starter kit for launching AI-powered SaaS products with pre-built auth and billing.",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkqmd6cJ7Wo_yDBHW_RPBs0jEDLP_5yGUKaiymSgG9DStDhLLyv_MfNRr64wdHehQ_-AwP-GTQdjknMP2n3hMsUIW3mz9UkP4WS1QM0g7HE3oit1cCuvGt4Km1c4AWMVcAQI2d-HD7RJQhwNLgwcim0tAd1CBGVP4fxw8A8vK9XbJZigKLZmoGIw8kjn7yLvGOtWWqXOLKtqB02IBEQkr6lQxNWgfFc3X9zO1Q_snOR_QKXqb5c-6kFil2mVoev1HNdDDkzWILZcg",
                  tags: ["NEXT.JS", "TAILWIND", "STRIPE"],
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
                    <h4 className="text-xl font-bold text-white mb-2">
                      {project.title}
                    </h4>
                    <p className="text-slate-400 text-sm mb-6 flex-1">
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

        {/* Final CTA Section */}
        <section className="py-24 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto glass-morphism border border-primary/20 rounded-3xl p-12 text-center neon-glow"
          >
            <h2 className="text-4xl font-black text-white mb-6">
              Ready to build the future?
            </h2>
            <p className="text-slate-400 mb-10 text-lg max-w-xl mx-auto">
              Stop watching tutorials. Join a cohort of creators and start
              building production-ready AI applications today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-10 py-4 bg-primary text-background-dark font-black rounded-xl hover:scale-105 transition-all">
                Secure Your Spot
              </button>
              <button className="px-10 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all">
                Download Curriculum
              </button>
            </div>
            <div className="mt-8 text-xs font-bold text-slate-500 uppercase tracking-widest">
              Next Cohort Starts in 5 Days
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="py-12 px-6 border-t border-white/5 bg-background-dark">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/30">
              <span className="material-symbols-outlined text-primary text-xl">
                terminal
              </span>
            </div>
            <h2 className="text-lg font-black tracking-tighter text-slate-100">
              Kasauli<span className="text-primary">Coder</span>
            </h2>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <Link
              className="hover:text-primary transition-colors"
              href="/privacy"
            >
              Privacy Policy
            </Link>
            <Link
              className="hover:text-primary transition-colors"
              href="/terms"
            >
              Terms of Service
            </Link>
            <Link
              className="hover:text-primary transition-colors"
              href="/contact"
            >
              Contact
            </Link>
          </div>
          <div className="text-sm text-slate-500">
            © {new Date().getFullYear()} KasauliCoder. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeVisionHero;
