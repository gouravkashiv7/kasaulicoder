"use client";

import React, { useState, useEffect, useRef } from "react";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";
import HomeUpcomingEventsStats from "@/components/home/HomeUpcomingEventsStats";
import HomeTeamWorkTestimonials from "@/components/home/HomeTeamWorkTestimonials";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

export interface ProjectType {
  _id: string;
  title: string;
  slug: string;
  outcome: string;
  desc: string;
  images: string[];
  tags: string[];
  status: "active" | "past";
  featured: boolean;
  members: Array<{
    _id: string;
    name: string;
    image?: string;
    designation?: string;
  }>;
}

const coreFeaturesRow1 = [
  {
    icon: "🏗️",
    title: "Custom SaaS",
    desc: "Tailored enterprise solutions built for your specific business needs",
  },
  {
    icon: "⚡",
    title: "Fast Delivery",
    desc: "Launch in weeks, not months with our accelerated development process",
  },
  {
    icon: "🛡️",
    title: "24/7 Support",
    desc: "Reliable business continuity with round-the-clock technical assistance",
  },
  {
    icon: "📈",
    title: "Scalable Tech",
    desc: "Built to grow with your needs, from startup to enterprise",
  },
  {
    icon: "🎯",
    title: "SEO Engine",
    desc: "Built-in optimization that drives organic traffic and rankings",
  },
  {
    icon: "🔄",
    title: "Smart Automation",
    desc: "Streamline operations with AI-powered workflows and integrations",
  },
  {
    icon: "📱",
    title: "Responsive Design",
    desc: "Flawless experience across all devices and screen sizes",
  },
  {
    icon: "🔒",
    title: "Enterprise Security",
    desc: "Bank-level encryption and data protection protocols",
  },
  {
    icon: "📊",
    title: "Analytics Dashboard",
    desc: "Real-time insights into your business performance",
  },
  {
    icon: "🌐",
    title: "Global CDN",
    desc: "Lightning-fast loading speeds anywhere in the world",
  },
  {
    icon: "🤖",
    title: "AI Integration",
    desc: "Smart features that learn and adapt to user behavior",
  },
  {
    icon: "🔌",
    title: "API First",
    desc: "Seamless connections with your favorite tools and services",
  },
  {
    icon: "🧪",
    title: "A/B Testing",
    desc: "Data-driven optimization for maximum conversions",
  },
  {
    icon: "📝",
    title: "Content Management",
    desc: "Easy updates without touching a single line of code",
  },
  {
    icon: "💬",
    title: "Customer Portal",
    desc: "Self-service dashboards for your end-users",
  },
];

const coreFeaturesRow2 = [
  {
    icon: "🔔",
    title: "Smart Notifications",
    desc: "Real-time alerts via email, SMS, and push",
  },
  {
    icon: "💳",
    title: "Billing Integration",
    desc: "Automated subscription management and payments",
  },
  {
    icon: "📋",
    title: "Audit Logs",
    desc: "Complete transparency with detailed activity tracking",
  },
  {
    icon: "🎨",
    title: "White Label Ready",
    desc: "Perfect for agencies and resellers",
  },
  {
    icon: "🔍",
    title: "Site Search",
    desc: "Intelligent search with filters and suggestions",
  },
  {
    icon: "📄",
    title: "Documentation Hub",
    desc: "Auto-generated API docs and user guides",
  },
  {
    icon: "🧩",
    title: "No-Code Builder",
    desc: "Empower your team with visual customization tools",
  },
  {
    icon: "🚦",
    title: "Feature Flags",
    desc: "Gradual rollouts and instant feature toggles",
  },
  {
    icon: "🔐",
    title: "SSO Integration",
    desc: "Single sign-on with major identity providers",
  },
  {
    icon: "📎",
    title: "File Management",
    desc: "Secure uploads, storage, and sharing",
  },
  {
    icon: "⏱️",
    title: "Uptime Monitoring",
    desc: "99.9% guaranteed availability with instant alerts",
  },
  {
    icon: "🌍",
    title: "Multi-language",
    desc: "Reach global audiences with localization ready",
  },
  {
    icon: "📧",
    title: "Email Automation",
    desc: "Targeted campaigns and triggered sequences",
  },
  {
    icon: "💾",
    title: "Auto Backup",
    desc: "Daily backups with point-in-time recovery",
  },
  {
    icon: "🔄",
    title: "Migration Tools",
    desc: "Seamless transition from your existing platform",
  },
];

const HomeVisionHero = () => {
  const [cohortEmail, setCohortEmail] = useState("");
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [cohortStatus, setCohortStatus] = useState<
    "idle" | "loading" | "success" | "error" | "duplicate"
  >("idle");
  const [cohortMsg, setCohortMsg] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (err) {
        console.error("Error fetching projects", err);
      } finally {
        setIsLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  const featuredProjects = projects.filter((p) => p.featured);

  const handleCohortSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = cohortEmail.trim();

    if (!EMAIL_REGEX.test(trimmed)) {
      setCohortStatus("error");
      setCohortMsg("Please enter a valid email address.");
      return;
    }

    setCohortStatus("loading");
    try {
      const res = await fetch("/api/public/cohort-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json();

      if (res.status === 201) {
        setCohortStatus("success");
        setCohortMsg(data.message);
        setCohortEmail("");
      } else if (res.status === 200) {
        setCohortStatus("duplicate");
        setCohortMsg(data.message);
      } else {
        setCohortStatus("error");
        setCohortMsg(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setCohortStatus("error");
      setCohortMsg("Network error. Please try again.");
    }
  };

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
              SaaS Solutions that{" "}
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
              <Link href="/projects">
                <button className="w-full sm:w-auto px-8 py-4 bg-linear-to-r from-primary to-secondary text-background font-black rounded-xl shadow-[0_0_30px_rgba(var(--primary-rgb),0.4)] hover:shadow-[0_0_45px_rgba(var(--primary-rgb),0.6)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group">
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                  <span className="relative z-10 flex items-center gap-2">
                    🚀 Explore Our Work
                  </span>
                </button>
              </Link>
              <Link href="/register">
                <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/20 text-foreground font-bold rounded-xl hover:bg-white/10 hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-2 shadow-lg">
                  💡 Let's Build Your Solution
                </button>
              </Link>
              <Link href="/contact">
                <button className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-primary/30 text-primary font-bold rounded-xl hover:bg-primary hover:text-background hover:scale-105 transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2">
                  📞 Talk to Our Team
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        <style>{`
          @keyframes marquee-rtl {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes marquee-ltr {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .animate-marquee-rtl {
            animation: marquee-rtl 40s linear infinite;
          }
          .animate-marquee-ltr {
            animation: marquee-ltr 40s linear infinite;
          }
          .marquee-row:hover > div {
            animation-play-state: paused;
          }
        `}</style>
        {/* Core Features Marquee Section */}
        <section className="py-12 px-6 bg-transparent border-t border-b border-white/5 relative z-10 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-6 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
              Core Features
            </h2>
            <p className="text-foreground/60 max-w-2xl mx-auto text-sm">
              Everything you need to launch, scale, and manage your digital
              platforms effortlessly.
            </p>
          </div>

          <div className="flex flex-col gap-3 relative w-full">
            {/* Overlay gradients for smoother edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-linear-to-r from-background to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-linear-to-l from-background to-transparent z-10 pointer-events-none"></div>

            {/* Row 1: Left to Right — stops on hover */}
            <div className="marquee-row flex overflow-hidden w-full cursor-default">
              <div className="flex animate-marquee-ltr text-left w-max">
                {[...coreFeaturesRow1, ...coreFeaturesRow1].map(
                  (feature, idx) => (
                    <div
                      key={idx}
                      className="flex shrink-0 items-center gap-3 py-3 px-4 mx-1.5 w-72 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors"
                    >
                      <div className="text-2xl shrink-0">{feature.icon}</div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground leading-tight">
                          {feature.title}
                        </h3>
                        <p className="text-xs text-foreground/50 leading-snug mt-0.5">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Row 2: Right to Left — stops on hover */}
            <div className="marquee-row flex overflow-hidden w-full cursor-default">
              <div className="flex animate-marquee-rtl text-left w-max">
                {[...coreFeaturesRow2, ...coreFeaturesRow2].map(
                  (feature, idx) => (
                    <div
                      key={idx}
                      className="flex shrink-0 items-center gap-3 py-3 px-4 mx-1.5 w-72 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors"
                    >
                      <div className="text-2xl shrink-0">{feature.icon}</div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground leading-tight">
                          {feature.title}
                        </h3>
                        <p className="text-xs text-foreground/50 leading-snug mt-0.5">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-24 px-6 bg-transparent">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4">
                Services
              </h2>
              <h3 className="text-4xl md:text-5xl font-black text-foreground mb-6 leading-tight">
                Everything Your Business Needs <br />
                <span className="text-primary">— From Website to Growth</span>
              </h3>
              <p className="text-lg text-foreground/60 max-w-2xl mx-auto leading-relaxed">
                We don&apos;t just build websites; we build engines for business
                success. Our team specializes in delivering high-performance
                solutions that scale with your growth.
              </p>
            </motion.div>

            {/* Video Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mb-16 max-w-4xl mx-auto"
            >
              <div className="absolute -inset-2 bg-linear-to-r from-primary/20 to-secondary/20 blur-3xl rounded-3xl opacity-50"></div>
              <div className="relative glass-morphism rounded-3xl p-4 border border-white/10">
                <div className="aspect-video rounded-xl overflow-hidden relative border border-white/5 group/video">
                  <video
                    ref={videoRef}
                    src="/kasaulicoder.mp4"
                    autoPlay
                    muted={isMuted}
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {/* Video Controls Overlay */}
                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-100 md:opacity-0 md:group-hover/video:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={togglePlay}
                      className="size-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 transition-all shadow-lg"
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      <span className="material-symbols-outlined text-white text-xl leading-none">
                        {isPlaying ? "pause" : "play_arrow"}
                      </span>
                    </button>
                    <button
                      onClick={toggleMute}
                      className="size-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 transition-all shadow-lg"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      <span className="material-symbols-outlined text-white text-xl leading-none">
                        {isMuted ? "volume_off" : "volume_up"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Services Grid — full width, 3 columns */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                {
                  icon: "cloud",
                  title: "Cloud Infrastructure",
                  desc: "Scalable cloud architecture with CI/CD pipelines, monitoring, and auto-scaling for peak reliability.",
                },
              ].map((service, i) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group flex gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/40 transition-all duration-300 cursor-default"
                >
                  <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 shrink-0 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                    <span className="material-symbols-outlined text-primary text-xl">
                      {service.icon}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                      {service.title}
                    </h4>
                    <p className="text-foreground/60 text-sm leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose KasauliCoder Section */}
        <section className="py-20 px-6 bg-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <motion.h4
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-black text-foreground mb-3"
              >
                Why Choose{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                  KasauliCoder?
                </span>
              </motion.h4>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-foreground/50 text-base max-w-xl mx-auto"
              >
                What sets us apart from the rest
              </motion.p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {[
                {
                  title: "Results-Driven",
                  desc: "We don't just build; we optimize for growth",
                  icon: "trending_up",
                  gradient: "from-emerald-500/20 to-teal-500/20",
                  iconColor: "text-emerald-400",
                },
                {
                  title: "Future-Proof",
                  desc: "Modern tech stack that evolves with your business",
                  icon: "rocket_launch",
                  gradient: "from-violet-500/20 to-purple-500/20",
                  iconColor: "text-violet-400",
                },
                {
                  title: "Partner Approach",
                  desc: "We're invested in your long-term success",
                  icon: "handshake",
                  gradient: "from-blue-500/20 to-cyan-500/20",
                  iconColor: "text-blue-400",
                },
                {
                  title: "Transparent Process",
                  desc: "Regular updates and complete visibility",
                  icon: "visibility",
                  gradient: "from-amber-500/20 to-orange-500/20",
                  iconColor: "text-amber-400",
                },
                {
                  title: "Cost-Effective",
                  desc: "Premium solutions at competitive prices",
                  icon: "savings",
                  gradient: "from-rose-500/20 to-pink-500/20",
                  iconColor: "text-rose-400",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/40 transition-all duration-300 cursor-default overflow-hidden text-center"
                >
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}
                  ></div>
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="size-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <span
                        className={`material-symbols-outlined text-2xl ${item.iconColor}`}
                      >
                        {item.icon}
                      </span>
                    </div>
                    <div>
                      <h5 className="text-foreground font-bold text-sm mb-1 group-hover:text-primary transition-colors duration-300">
                        {item.title}
                      </h5>
                      <p className="text-foreground/50 text-xs leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
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
                {featuredProjects.length > 0
                  ? "These aren't just student projects. These are fully functional SaaS tools and AI engines built by our members."
                  : "We're currently scaling our latest batch of innovation. Our next set of featured projects will be showcased here shortly."}
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoadingProjects ? (
                <div className="col-span-1 border border-white/10 p-6 rounded-2xl animate-pulse bg-white/5 h-96"></div>
              ) : featuredProjects.length > 0 ? (
                featuredProjects.map((project, i) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 * i }}
                    whileHover={{ y: -5 }}
                    className="group relative flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all shadow-lg"
                  >
                    <div className="aspect-video overflow-hidden relative border-b border-white/5">
                      <div className="w-full h-full relative">
                        {project.images && project.images.length > 0 ? (
                          <Image
                            src={project.images[0]}
                            alt={project.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-foreground/5 relative overflow-hidden">
                            <span className="material-symbols-outlined text-4xl text-foreground/20">
                              image
                            </span>
                          </div>
                        )}
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span
                            className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded shadow-sm flex items-center gap-1 backdrop-blur-md ${
                              project.status === "active"
                                ? "bg-primary/90 text-background border border-primary/20"
                                : "bg-background/80 text-foreground border border-white/10"
                            }`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${
                                project.status === "active"
                                  ? "bg-background animate-pulse"
                                  : "bg-foreground/50"
                              }`}
                            ></span>
                            {project.status === "active"
                              ? "In Progress"
                              : "Completed"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags?.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-white/5 border border-white/10 text-[10px] font-bold text-foreground/70 uppercase tracking-widest rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h4 className="text-xl font-black text-foreground mb-1 line-clamp-1">
                        {project.title}
                      </h4>
                      <p className="text-primary text-sm font-bold mb-3 italic line-clamp-2">
                        {project.outcome}
                      </p>
                      <p className="text-foreground/60 text-xs mb-6 flex-1 line-clamp-3 leading-relaxed">
                        {project.desc}
                      </p>

                      {project.members && project.members.length > 0 && (
                        <div className="mb-6 pt-4 border-t border-white/5">
                          <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider mb-2">
                            {project.status === "active"
                              ? "Working on it"
                              : "Worked on by"}
                          </p>
                          <div className="flex -space-x-2 overflow-hidden">
                            {project.members.map((member) => (
                              <div
                                key={member._id}
                                className="size-8 rounded-full border-2 border-background bg-foreground/10 relative overflow-hidden"
                                title={`${member.name} - ${member.designation || "Member"}`}
                              >
                                {member.image ? (
                                  <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-foreground/40 uppercase">
                                    {member.name.substring(0, 2)}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <Link
                        href={`/projects/${
                          project.status === "active"
                            ? "active-projects"
                            : "recent-projects"
                        }/${project.slug}`}
                        className="text-primary text-sm font-bold flex items-center justify-between group/link pt-4 border-t border-white/5 mt-auto"
                      >
                        Read Case Study
                        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center group-hover/link:bg-primary group-hover/link:text-background transition-colors duration-300">
                          <span className="material-symbols-outlined text-[16px] group-hover/link:translate-x-0.5 transition-transform">
                            arrow_forward
                          </span>
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                ))
              ) : null}
            </div>
          </div>
          {/* Background Decoration */}
          <div className="absolute bottom-0 left-0 w-full h-64 bg-linear-to-t from-primary/5 to-transparent pointer-events-none"></div>
        </section>

        {/* Student Special Section */}
        <section className="py-20 px-6 relative overflow-hidden bg-transparent border-t border-white/5">
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12 glass-morphism p-8 md:p-12 rounded-3xl border border-primary/20 shadow-2xl">
              <div className="flex-1 text-left">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-widest uppercase mb-6 inline-block">
                    Student Programs
                  </span>
                  <h3 className="text-3xl md:text-4xl font-black text-foreground mb-6 leading-tight">
                    Gain Hands-on Experience with <br />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                      Live Industry Projects
                    </span>
                  </h3>
                  <p className="text-lg text-foreground/60 mb-8 leading-relaxed">
                    We plan live internships and projects specifically for
                    students who want to bridge the gap between academia and
                    industry. Get hands-on experience with what&apos;s actually
                    happening in the tech world and work on real-world industry
                    projects.
                  </p>
                  <Link href="/programs">
                    <button className="px-8 py-4 bg-primary text-background font-black rounded-xl hover:scale-105 transition-all shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)] flex items-center gap-2 group">
                      🚀 Explore Student Programs
                      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </button>
                  </Link>
                </motion.div>
              </div>

              <div className="flex-1 relative hidden md:block">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="relative h-[300px] w-full"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-secondary/20 blur-3xl opacity-30 rounded-full animate-pulse"></div>
                  <div className="relative grid grid-cols-2 gap-4">
                    {[
                      { icon: "school", label: "Live Mentorship" },
                      { icon: "work", label: "Real Internships" },
                      { icon: "terminal", label: "Industry Stack" },
                      { icon: "groups", label: "Peer Learning" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center gap-3 backdrop-blur-md hover:border-primary/40 transition-colors"
                      >
                        <span className="material-symbols-outlined text-primary text-3xl">
                          {item.icon}
                        </span>
                        <span className="text-xs font-bold text-foreground/80">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
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
            {/* Coming Soon Block */}
            <div className="flex flex-col items-center gap-6 mt-2">
              {/* Animated pulse badge */}
              <div className="relative flex items-center justify-center">
                <span className="absolute inline-flex h-16 w-16 rounded-full bg-primary/20 animate-ping opacity-60" />
                <span className="absolute inline-flex h-12 w-12 rounded-full bg-primary/30 animate-ping animation-delay-300 opacity-40" />
                <div className="relative z-10 flex items-center justify-center size-14 rounded-full bg-primary/10 border-2 border-primary/40 shadow-[0_0_24px_rgba(var(--primary-rgb),0.3)]">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    schedule
                  </span>
                </div>
              </div>

              {/* Main label */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/30 shadow-inner">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="text-sm font-black uppercase tracking-[0.2em] text-primary">
                    Next Cohort Coming Soon
                  </span>
                </div>
                <p className="text-foreground/40 text-sm font-medium">
                  We&apos;re finalising the dates — be the first to know when
                  enrollment opens.
                </p>
              </div>

              {/* Notify form */}
              {cohortStatus === "success" || cohortStatus === "duplicate" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`flex items-center gap-3 px-5 py-3 rounded-xl border text-sm font-bold ${
                    cohortStatus === "success"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {cohortStatus === "success" ? "check_circle" : "info"}
                  </span>
                  {cohortMsg}
                </motion.div>
              ) : (
                <form
                  onSubmit={handleCohortSubmit}
                  className="flex flex-col items-center gap-3 w-full max-w-sm mx-auto mt-1"
                >
                  <div className="flex items-center gap-2 w-full">
                    <div
                      className={`flex items-center gap-2 flex-1 px-4 py-2.5 rounded-xl bg-white/5 border backdrop-blur-sm transition-colors ${
                        cohortStatus === "error"
                          ? "border-rose-500/50"
                          : "border-white/10 focus-within:border-primary/50"
                      }`}
                    >
                      <span className="material-symbols-outlined text-base text-foreground/30 shrink-0">
                        mail
                      </span>
                      <input
                        type="email"
                        value={cohortEmail}
                        onChange={(e) => {
                          setCohortEmail(e.target.value);
                          if (cohortStatus !== "idle") setCohortStatus("idle");
                        }}
                        placeholder="your@email.com"
                        className="bg-transparent text-sm font-medium text-foreground placeholder:text-foreground/30 focus:outline-none w-full"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={cohortStatus === "loading"}
                      className="px-5 py-2.5 bg-primary/90 text-background text-sm font-black rounded-xl hover:bg-primary hover:scale-105 transition-all shadow-[0_0_16px_rgba(var(--primary-rgb),0.3)] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 shrink-0 flex items-center gap-1.5"
                    >
                      {cohortStatus === "loading" ? (
                        <>
                          <span className="material-symbols-outlined text-sm animate-spin">
                            progress_activity
                          </span>
                          <span>Saving...</span>
                        </>
                      ) : (
                        "Notify Me"
                      )}
                    </button>
                  </div>
                  {cohortStatus === "error" && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-rose-400 font-bold self-start pl-1"
                    >
                      {cohortMsg}
                    </motion.p>
                  )}
                </form>
              )}

              {/* Three dots separator */}
              <div className="flex items-center gap-2 mt-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="block h-1.5 w-1.5 rounded-full bg-primary/30"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default HomeVisionHero;
