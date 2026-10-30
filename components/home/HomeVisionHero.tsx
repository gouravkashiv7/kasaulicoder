"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import HomeTeamWorkTestimonials from "@/components/home/HomeTeamWorkTestimonials";
import GlobalFooter from "@/components/layout/GlobalFooter";
import GlobalHeader from "@/components/layout/GlobalHeader";

const AnoAI = dynamic(
  () => import("@/components/ui/animated-shader-background"),
  { ssr: false },
);

export interface ProjectType {
  _id: string;
  title: string;
  slug: string;
  outcome: string;
  desc: string;
  media: { type: "image" | "video"; url: string }[];
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

const services = [
  {
    icon: "code",
    title: "SaaS Product Development",
    desc: "We design and build SaaS products and custom software from architecture to deployment, for businesses turning an idea or an internal process into software their customers can use.",
  },
  {
    icon: "account_tree",
    title: "Business Automation",
    desc: "Custom workflows and integrations that connect the tools your team already uses, reducing repetitive manual work and re-entered data.",
  },
  {
    icon: "search",
    title: "SEO Services",
    desc: "Search engine optimization that makes your website easier for customers to find, supporting steady organic traffic over time.",
  },
  {
    icon: "web",
    title: "UI/UX and Web Development",
    desc: "Modern, responsive websites and web applications with clear interfaces, so visitors can understand your offering and take action.",
  },
  {
    icon: "cloud",
    title: "Cloud Infrastructure",
    desc: "Cloud hosting and deployment set up for your applications, with the monitoring needed to keep them running reliably as usage grows.",
  },
  {
    icon: "support_agent",
    title: "Ongoing Technical Support",
    desc: "Maintenance, updates and technical support after launch, so your software stays current and issues are dealt with.",
  },
];

const businessHelp = [
  {
    icon: "deployed_code",
    title: "Build software",
    desc: "From SaaS products to custom web applications, built around how your business works.",
  },
  {
    icon: "language",
    title: "Improve your digital presence",
    desc: "Better web experiences and SEO, so customers can find you and use your site with ease.",
  },
  {
    icon: "sync_alt",
    title: "Automate workflows",
    desc: "Integrations and automation that take repetitive tasks off your team.",
  },
  {
    icon: "dns",
    title: "Keep it running",
    desc: "Cloud infrastructure and technical support once your software is live.",
  },
];

const strengths = [
  {
    icon: "target",
    title: "Business-focused development",
    desc: "We start from what your business needs to achieve, then choose the technology to fit.",
  },
  {
    icon: "memory",
    title: "Modern technology",
    desc: "Software built with current tools such as Next.js, React and TypeScript.",
  },
  {
    icon: "palette",
    title: "Thoughtful design",
    desc: "Interfaces that are clear and easy to use on desktop, tablet and mobile.",
  },
  {
    icon: "stacks",
    title: "Scalable architecture",
    desc: "Software structured so it can grow with your users and requirements.",
  },
  {
    icon: "build",
    title: "Long-term technical support",
    desc: "Continued maintenance and support after your product goes live.",
  },
  {
    icon: "forum",
    title: "Transparent communication",
    desc: "Regular updates, so you know where your project stands.",
  },
];

const primaryButton =
  "inline-flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-primary to-secondary text-background font-black rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
const secondaryButton =
  "inline-flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/20 text-foreground font-bold rounded-xl hover:bg-white/10 hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const HomeVisionHero = () => {
  const [projects, setProjects] = useState<ProjectType[]>([]);

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
      }
    };
    fetchProjects();
  }, []);

  const featuredProjects = projects.filter((p) => p.featured);

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
    <div className="font-display text-foreground antialiased overflow-x-hidden relative">
      <Suspense fallback={null}>
        <AnoAI />
      </Suspense>
      <GlobalHeader />

      <main className="pt-28">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center justify-center px-6 overflow-hidden bg-transparent">
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
                SaaS Product Development & Digital Solutions
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
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-foreground/70 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              KasauliCoder designs and develops SaaS products, modern web
              applications, and business solutions. From software development
              and automation to SEO and cloud infrastructure, we help businesses
              build and improve their digital presence.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/contact" className={primaryButton}>
                Discuss a Project
                <span
                  className="material-symbols-outlined text-xl"
                  aria-hidden="true"
                >
                  arrow_forward
                </span>
              </Link>
              <Link href="/#services" className={secondaryButton}>
                Explore Services
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Services */}
        <section
          id="services"
          className="py-24 px-6 bg-transparent relative z-10 scroll-mt-24"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-14 text-center"
            >
              <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4">
                Services
              </h2>
              <h3 className="text-3xl md:text-5xl font-black text-foreground mb-6 leading-tight">
                What We Build for Businesses
              </h3>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed">
                Software development, automation, search visibility and
                infrastructure, all from one team.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, i) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 * i, duration: 0.5 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group flex flex-col gap-5 p-7 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/40 transition-colors duration-300"
                >
                  <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 shrink-0 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <span
                      className="material-symbols-outlined text-primary text-2xl"
                      aria-hidden="true"
                    >
                      {service.icon}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                      {service.title}
                    </h4>
                    <p className="text-foreground/70 text-sm leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How We Help Businesses */}
        <section className="py-24 px-6 bg-transparent relative z-10">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4">
                How We Help
              </h2>
              <h3 className="text-3xl md:text-5xl font-black text-foreground mb-6 leading-tight">
                Software and a digital presence that work for your business
              </h3>
              <p className="text-lg text-foreground/70 mb-10 leading-relaxed">
                Whether you need a new product, a better website or fewer manual
                tasks, our services cover the software side of running and
                growing a business.
              </p>
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
                {businessHelp.map((item) => (
                  <li key={item.title} className="flex gap-4">
                    <div className="size-10 rounded-lg bg-primary/10 border border-primary/20 shrink-0 flex items-center justify-center">
                      <span
                        className="material-symbols-outlined text-primary text-xl"
                        aria-hidden="true"
                      >
                        {item.icon}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-foreground/70 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -inset-2 bg-linear-to-r from-primary/20 to-secondary/20 blur-3xl rounded-3xl opacity-50"></div>
              <div className="relative glass-morphism rounded-3xl p-3 border border-white/10">
                <div className="aspect-video rounded-2xl overflow-hidden relative border border-white/5 group/video">
                  <video
                    ref={videoRef}
                    src="/kasaulicoder.mp4"
                    autoPlay
                    muted={isMuted}
                    loop
                    playsInline
                    aria-label="KasauliCoder brand video"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-100 md:opacity-0 md:group-hover/video:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="size-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 transition-all shadow-lg"
                      aria-label={isPlaying ? "Pause video" : "Play video"}
                    >
                      <span
                        className="material-symbols-outlined text-white text-xl leading-none"
                        aria-hidden="true"
                      >
                        {isPlaying ? "pause" : "play_arrow"}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="size-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 transition-all shadow-lg"
                      aria-label={isMuted ? "Unmute video" : "Mute video"}
                    >
                      <span
                        className="material-symbols-outlined text-white text-xl leading-none"
                        aria-hidden="true"
                      >
                        {isMuted ? "volume_off" : "volume_up"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Projects — shown only when genuine featured projects exist */}
        {featuredProjects.length > 0 && (
          <section className="py-24 px-6 relative overflow-hidden bg-transparent">
            <div className="max-w-7xl mx-auto relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-14"
              >
                <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4">
                  Projects
                </h2>
                <h3 className="text-3xl md:text-5xl font-black text-foreground mb-6 leading-tight">
                  Featured Projects
                </h3>
                <p className="text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed">
                  A selection of software and digital solutions we have built.
                </p>
              </motion.div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProjects.map((project, i) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 * i }}
                    whileHover={{ y: -5 }}
                    className="group relative flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-colors shadow-lg"
                  >
                    <div className="aspect-video overflow-hidden relative border-b border-white/5 bg-foreground/5">
                      <div className="w-full h-full relative">
                        {project.media &&
                        project.media.length > 0 &&
                        project.media[0].type === "image" ? (
                          <Image
                            src={project.media[0].url}
                            alt={project.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full relative overflow-hidden">
                            <div className="absolute inset-0 opacity-40 bg-linear-to-br from-primary/30 to-secondary/30"></div>
                            <div className="relative size-20 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl">
                              <span className="text-3xl font-black text-foreground/40 tracking-tighter uppercase">
                                {project.title.substring(0, 2)}
                              </span>
                            </div>
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
                            {project.status === "active"
                              ? "In Development"
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
                      {project.outcome && (
                        <p className="text-primary text-sm font-bold mb-3 line-clamp-2">
                          {project.outcome}
                        </p>
                      )}
                      <p className="text-foreground/70 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">
                        {project.desc}
                      </p>
                      <Link
                        href={`/projects/${
                          project.status === "active"
                            ? "active-projects"
                            : "recent-projects"
                        }/${project.slug}`}
                        className="text-primary text-sm font-bold flex items-center justify-between group/link pt-4 border-t border-white/5 mt-auto"
                      >
                        View Project
                        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center group-hover/link:bg-primary group-hover/link:text-background transition-colors duration-300">
                          <span
                            className="material-symbols-outlined text-[16px] group-hover/link:translate-x-0.5 transition-transform"
                            aria-hidden="true"
                          >
                            arrow_forward
                          </span>
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-12 text-center">
                <Link href="/projects" className={secondaryButton}>
                  View All Projects
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Why KasauliCoder */}
        <section className="py-24 px-6 bg-transparent relative z-10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4">
                Why KasauliCoder
              </h2>
              <h3 className="text-3xl md:text-5xl font-black text-foreground leading-tight">
                How We Work
              </h3>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {strengths.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 * i, duration: 0.5 }}
                  className="group flex gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/40 transition-colors duration-300"
                >
                  <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 shrink-0 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <span
                      className="material-symbols-outlined text-primary text-2xl"
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-foreground font-bold mb-1">
                      {item.title}
                    </h4>
                    <p className="text-foreground/70 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section className="py-24 px-6 bg-transparent relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4">
              About KasauliCoder
            </h2>
            <h3 className="text-3xl md:text-5xl font-black text-foreground mb-6 leading-tight">
              A software company named after the hills of Kasauli
            </h3>
            <p className="text-lg text-foreground/70 leading-relaxed mb-8">
              KasauliCoder builds software products and digital solutions for
              businesses. Our work spans SaaS product development, web
              applications, business automation, SEO, UI/UX and cloud
              infrastructure.
            </p>
            <Link href="/about" className={secondaryButton}>
              Learn More About Us
            </Link>
          </motion.div>
        </section>

        <HomeTeamWorkTestimonials />

        {/* Contact CTA */}
        <section className="py-24 px-6 bg-transparent">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto glass-morphism border border-primary/20 rounded-3xl p-10 md:p-14 text-center neon-glow"
          >
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-5 leading-tight">
              Have a Digital Product or Business Solution in Mind?
            </h2>
            <p className="text-foreground/70 mb-10 text-lg max-w-2xl mx-auto leading-relaxed">
              Tell us about your requirements and what you would like built or
              improved. We will get back to you to discuss the next steps.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact" className={primaryButton}>
                Discuss a Project
                <span
                  className="material-symbols-outlined text-xl"
                  aria-hidden="true"
                >
                  arrow_forward
                </span>
              </Link>
              <Link href="/#services" className={secondaryButton}>
                Explore Services
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default HomeVisionHero;
