"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import GlobalHeader from "./GlobalHeader";
import GlobalFooter from "./GlobalFooter";

const WhoWeArePricing = () => {
  return (
    <div className="bg-background-dark text-slate-100 min-h-screen selection:bg-primary/30 font-display">
      <div className="relative overflow-x-hidden">
        {/* Background Accents */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"
        ></motion.div>

        <div className="layout-container flex h-full grow flex-col relative z-10">
          <GlobalHeader />

          <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-32 pb-12 md:pb-24">
            {/* Section 1: Who We Are */}
            <section className="mb-32">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="space-y-6"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                    <span className="material-symbols-outlined text-[14px]">
                      rocket_launch
                    </span>
                    Our Mission
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
                    Empowering the{" "}
                    <span className="text-primary italic">Next Generation</span>{" "}
                    of AI Engineers.
                  </h1>
                  <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
                    KasauliCoder is a tech-driven ecosystem designed for
                    students, job seekers, and professionals. We believe the
                    best way to master production-level AI is through hands-on
                    collaboration on real industry systems.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                      <span className="material-symbols-outlined text-primary">
                        groups
                      </span>
                      1000+ Collaborators
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                      <span className="material-symbols-outlined text-primary">
                        bolt
                      </span>
                      Real-world Stack
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-linear-to-r from-primary to-purple-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-[#1b2728] rounded-xl overflow-hidden aspect-video border border-primary/20 shadow-2xl">
                    <div className="absolute inset-0 bg-glow-radial"></div>
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCB5pdU3o0g4wJ8ccZNW-lrr8ac9VaDMdHTwyizbABNIz1tVXg72HPH-4262HcxPqsI9n3-b6d07yGUkwejgVfrRpfylghkeidYj7QcHR7kfDpQUWSbqj_P_h-lvrHphzBgYJ9AXrsBYPdHID2vrE5IBP9oJ0ADMVS9GWy-fsKm1a5jNdTtnkagwWyN5d377vjckuvgI9BMw1DTxDZIxZTcLl6L13R9swQlfqMbUedIfufP5QcX_0RWA8aywUnJBSoiHTcTP5S-Wko"
                      alt="High-tech server room with neon blue lights"
                      fill
                      className="object-cover opacity-80 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="p-4 rounded-lg bg-background-dark/80 backdrop-blur-md border border-primary/30 text-primary font-mono text-sm"
                      >
                        <p>&gt; Initializing AI_Project_Alpha...</p>
                        <p className="text-purple-500">
                          &gt; Connecting to production node...
                        </p>
                        <p className="text-green-400">&gt; System Ready.</p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Section 2: What We Do */}
            <section className="mb-32">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16 space-y-4"
              >
                <h2 className="text-3xl md:text-5xl font-black text-white">
                  Bridge the gap between{" "}
                  <span className="text-primary">Learning</span> and{" "}
                  <span className="text-purple-500">Industry</span>.
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                  Receive rigorous peer feedback and work on high-impact AI
                  systems used in actual production environments.
                </p>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: "terminal",
                    title: "Production AI Projects",
                    border: "border-t-primary",
                    bgHover: "hover:bg-primary/5",
                    iconColor: "text-primary",
                    iconBg: "bg-primary/20",
                    desc: "Forget toy datasets. Work on task-based, high-impact AI systems deployed in real-world infrastructure.",
                  },
                  {
                    icon: "rate_review",
                    title: "Expert Code Reviews",
                    border: "border-t-purple-500",
                    bgHover: "hover:bg-purple-500/5",
                    iconColor: "text-purple-500",
                    iconBg: "bg-purple-500/20",
                    desc: "Receive feedback from senior mentors and peers to sharpen your coding standards and architectural thinking.",
                  },
                  {
                    icon: "diversity_3",
                    title: "Team Collaboration",
                    border: "border-t-primary",
                    bgHover: "hover:bg-primary/5",
                    iconColor: "text-primary",
                    iconBg: "bg-primary/20",
                    desc: "Master industry-standard tools (Git, Docker, Kubernetes) and agile workflows in a professional team setting.",
                  },
                ].map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 * i }}
                    whileHover={{ y: -5 }}
                    className={`glass-card p-8 rounded-xl border-t-2 ${feature.border} group ${feature.bgHover} transition-all duration-300`}
                  >
                    <div
                      className={`size-12 rounded-lg ${feature.iconBg} flex items-center justify-center ${feature.iconColor} mb-6 group-hover:scale-110 transition-transform`}
                    >
                      <span className="material-symbols-outlined text-3xl">
                        {feature.icon}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {feature.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Section 3: Pricing Plans */}
            <section className="relative" id="pricing">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                  Choose Your{" "}
                  <span className="text-primary italic">Career Path</span>
                </h2>
                <p className="text-slate-400">
                  Flexible plans designed for every stage of your development
                  journey.
                </p>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                {[
                  {
                    name: "Basic",
                    price: "₹1,000",
                    color: "text-slate-400",
                    features: [
                      "Beginner-friendly AI projects",
                      "Limited community chat access",
                      "Standard documentation",
                    ],
                    buttonBorder:
                      "border-primary text-primary hover:bg-primary hover:text-background-dark",
                  },
                  {
                    name: "Pro",
                    price: "₹2,500",
                    featured: true,
                    color: "text-primary",
                    features: [
                      "Advanced production AI projects",
                      "Full 24/7 community chat access",
                      "Priority mentor guidance",
                      "Bi-weekly career workshops",
                    ],
                    buttonBg:
                      "bg-primary text-background-dark shadow-primary/20 hover:shadow-primary/40",
                  },
                  {
                    name: "Premium",
                    price: "₹5,000",
                    color: "text-purple-500",
                    features: [
                      "Complex distributed AI systems",
                      "Full 1-on-1 mentorship sessions",
                      "Direct Admin & Architect interaction",
                      "Custom portfolio development",
                    ],
                    buttonBorder:
                      "border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white",
                  },
                ].map((plan, i) => (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{
                      opacity: 1,
                      scale: plan.featured ? 1.05 : 1,
                    }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i, duration: 0.5 }}
                    whileHover={{ y: -10 }}
                    className={`flex flex-col glass-card rounded-xl p-8 border ${plan.featured ? "border-2 border-primary z-20 scale-105 bg-primary/5" : "border-slate-800"} transition-all duration-500 group relative`}
                  >
                    {plan.featured && (
                      <div className="absolute top-0 right-0 bg-primary text-background-dark text-[10px] font-black px-4 py-1 rounded-bl-lg uppercase tracking-widest">
                        Most Popular
                      </div>
                    )}
                    <div className="mb-8">
                      <h3
                        className={`text-lg font-bold ${plan.color} uppercase tracking-widest mb-4`}
                      >
                        {plan.name}
                      </h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-black text-white">
                          {plan.price}
                        </span>
                        <span className="text-slate-400 font-medium">/mo</span>
                      </div>
                    </div>
                    <ul className="space-y-4 mb-10 flex-1">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-sm text-slate-300"
                        >
                          <span
                            className={`material-symbols-outlined ${plan.featured || plan.name === "Basic" ? "text-primary" : "text-purple-500"} text-lg`}
                          >
                            check_circle
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/register"
                      className={`w-full py-3 px-6 rounded-lg font-bold text-center transition-all ${plan.buttonBg || `border-2 ${plan.buttonBorder}`} ${plan.featured ? "uppercase tracking-wider shadow-xl" : ""}`}
                    >
                      Register Now
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          </main>

          <GlobalFooter />
        </div>
      </div>
    </div>
  );
};

export default WhoWeArePricing;
