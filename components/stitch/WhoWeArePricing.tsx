"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const WhoWeArePricing = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen selection:bg-primary/30 font-display">
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
          {/* Top Navigation Bar */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-6 md:px-20 py-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link href="/" className="flex items-center gap-4">
                <div className="size-8 text-primary">
                  <svg
                    fill="none"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z"
                      fill="currentColor"
                    ></path>
                    <path
                      clipRule="evenodd"
                      d="M39.998 35.764C39.9944 35.7463 39.9875 35.7155 39.9748 35.6706C39.9436 35.5601 39.8949 35.4259 39.8346 35.2825C39.8168 35.2403 39.7989 35.1993 39.7813 35.1602C38.5103 34.2887 35.9788 33.0607 33.7095 32.5189C30.9875 31.8691 27.6413 31.4783 24 31.4783C20.3587 31.4783 17.0125 31.8691 14.2905 32.5189C12.0012 33.0654 9.44505 34.3104 8.18538 35.1832C8.17384 35.2075 8.16216 35.233 8.15052 35.2592C8.09919 35.3751 8.05721 35.4886 8.02977 35.589C8.00356 35.6848 8.00039 35.7333 8.00004 35.7388C8.00004 35.739 8 35.7393 8.00004 35.7388C8.00004 35.7641 8.0104 36.0767 8.68485 36.6314C9.34546 37.1746 10.4222 37.7531 11.9291 38.2772C14.9242 39.319 19.1919 40 24 40C28.8081 40 33.0758 39.319 36.0709 38.2772C37.5778 37.7531 38.6545 37.1746 39.3151 36.6314C39.9006 36.1499 39.9857 35.8511 39.998 35.764ZM4.95178 32.7688L21.4543 6.30267C22.6288 4.4191 25.3712 4.41909 26.5457 6.30267L43.0534 32.777C43.0709 32.8052 43.0878 32.8338 43.104 32.8629L41.3563 33.8352C43.104 32.8629 43.1038 32.8626 43.104 32.8629L43.1051 32.865L43.1065 32.8675L43.1101 32.8739L43.1199 32.8918C43.1276 32.906 43.1377 32.9246 43.1497 32.9473C43.1738 32.9925 43.2062 33.0545 43.244 33.1299C43.319 33.2792 43.4196 33.489 43.5217 33.7317C43.6901 34.1321 44 34.9311 44 35.7391C44 37.4427 43.003 38.7775 41.8558 39.7209C40.6947 40.6757 39.1354 41.4464 37.385 42.0552C33.8654 43.2794 29.133 44 24 44C18.867 44 14.1346 43.2794 10.615 42.0552C8.86463 41.4464 7.30529 40.6757 6.14419 39.7209C4.99695 38.7775 3.99999 37.4427 3.99999 35.7391C3.99999 34.8725 4.29264 34.0922 4.49321 33.6393C4.60375 33.3898 4.71348 33.1804 4.79687 33.0311C4.83898 32.9556 4.87547 32.8935 4.9035 32.8471C4.91754 32.8238 4.92954 32.8043 4.93916 32.7889L4.94662 32.777L4.95178 32.7688ZM35.9868 29.004L24 9.77997L12.0131 29.004C12.4661 28.8609 12.9179 28.7342 13.3617 28.6282C16.4281 27.8961 20.0901 27.4783 24 27.4783C27.9099 27.4783 31.5719 27.8961 34.6383 28.6282C35.082 28.7342 35.5339 28.8609 35.9868 29.004Z"
                      fill="currentColor"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <h2 className="text-slate-900 dark:text-white text-xl font-black leading-tight tracking-tight">
                  KasauliCoder
                </h2>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-1 justify-end gap-8 items-center"
            >
              <nav className="hidden md:flex items-center gap-8">
                {["Home", "About", "Who We Are", "Pricing", "Projects"].map(
                  (item, i) => (
                    <Link
                      key={item}
                      className={`${item === "Who We Are" ? "text-primary border-b-2 border-primary pb-1" : "text-slate-600 dark:text-slate-300 hover:text-primary"} transition-colors text-sm font-medium`}
                      href={
                        item === "Home"
                          ? "/"
                          : item === "Who We Are"
                            ? "/pricing"
                            : `/${item.toLowerCase().replace(" ", "")}`
                      }
                    >
                      {item}
                    </Link>
                  ),
                )}
              </nav>
              <Link
                href="/register"
                className="flex min-w-25 cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-primary text-background-dark text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
              >
                Register
              </Link>
            </motion.div>
          </header>

          <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:py-24">
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
                  <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                    Empowering the{" "}
                    <span className="text-primary italic">Next Generation</span>{" "}
                    of AI Engineers.
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                    KasauliCoder is a tech-driven ecosystem designed for
                    students, job seekers, and professionals. We believe the
                    best way to master production-level AI is through hands-on
                    collaboration on real industry systems.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                      <span className="material-symbols-outlined text-primary">
                        groups
                      </span>
                      1000+ Collaborators
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
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
                  <div className="relative bg-background-light dark:bg-[#1b2728] rounded-xl overflow-hidden aspect-video border border-slate-200 dark:border-primary/20 shadow-2xl">
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
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">
                  Bridge the gap between{" "}
                  <span className="text-primary">Learning</span> and{" "}
                  <span className="text-purple-500">Industry</span>.
                </h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
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
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
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
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
                  Choose Your{" "}
                  <span className="text-primary italic">Career Path</span>
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Flexible plans designed for every stage of your development
                  journey.
                </p>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                {[
                  {
                    name: "Basic",
                    price: "₹1,000",
                    color: "text-slate-600 dark:text-slate-400",
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
                    className={`flex flex-col glass-card rounded-xl p-8 border ${plan.featured ? "border-2 border-primary z-20 scale-105 bg-primary/5" : "border-slate-200 dark:border-slate-800"} transition-all duration-500 group relative`}
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
                        <span className="text-5xl font-black text-slate-900 dark:text-white">
                          {plan.price}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 font-medium">
                          /mo
                        </span>
                      </div>
                    </div>
                    <ul className="space-y-4 mb-10 flex-1">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300"
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

          {/* Simple Footer */}
          <footer className="border-t border-slate-200 dark:border-slate-800 py-12 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-3">
                <span className="text-primary material-symbols-outlined">
                  terminal
                </span>
                <span className="text-slate-900 dark:text-white font-black">
                  KasauliCoder © {new Date().getFullYear()}
                </span>
              </div>
              <div className="flex gap-8">
                <Link
                  className="text-slate-500 hover:text-primary transition-colors text-sm"
                  href="/terms"
                >
                  Terms
                </Link>
                <Link
                  className="text-slate-500 hover:text-primary transition-colors text-sm"
                  href="/privacy"
                >
                  Privacy
                </Link>
                <Link
                  className="text-slate-500 hover:text-primary transition-colors text-sm"
                  href="/contact"
                >
                  Community
                </Link>
              </div>
              <div className="flex gap-4">
                <button className="p-2 rounded-full border border-slate-700 hover:text-primary hover:border-primary transition-all">
                  <span className="material-symbols-outlined text-sm">
                    language
                  </span>
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default WhoWeArePricing;
