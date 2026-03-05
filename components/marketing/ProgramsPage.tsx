"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";
import NeuralBackground from "@/components/ui/flow-field-background";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Rocket } from "lucide-react";
import UniqueLoading from "@/components/ui/morph-loading";

interface Program {
  _id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  features: string[];
  isActive: boolean;
  sortOrder: number;
}

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
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const ProgramsPage = () => {
  const [programs, setPrograms] = React.useState<Program[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await fetch("/api/public/programs");
        const data = await res.json();
        if (data.success) {
          const sorted = data.data.sort(
            (a: Program, b: Program) => a.sortOrder - b.sortOrder,
          );
          setPrograms(sorted);
        }
      } catch (err) {
        console.error("Failed to fetch programs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="flex flex-col items-center gap-8 relative z-10">
          <UniqueLoading variant="morph" size="lg" />
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-center"
          >
            <p className="text-primary font-black text-lg tracking-[0.3em] uppercase">
              Initializing Programs
            </p>
            <p className="text-foreground/30 text-xs font-bold mt-2 tracking-widest uppercase">
              Loading curriculum modules...
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen font-display selection:bg-primary selection:text-white relative overflow-x-hidden">
      <div className="fixed inset-0 z-0">
        <NeuralBackground trailOpacity={0.08} particleCount={400} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <GlobalHeader />

        <main className="grow pt-32 pb-24 px-6 lg:px-10">
          <div className="max-w-7xl mx-auto">
            {/* Header section with staggered animations */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-3xl mb-16 md:mb-24 text-center md:text-left mx-auto md:mx-0"
            >
              <motion.h1
                variants={itemVariants}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter"
              >
                Accelerate Your{" "}
                <span className="text-primary italic inline-block">
                  Career Path.
                </span>
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-foreground/70 text-lg md:text-xl lg:text-2xl leading-relaxed max-w-2xl mx-auto md:mx-0"
              >
                Whether you're looking to compete, contribute, or get placed,
                our programs are designed to push your boundaries and deliver
                tangible results.
              </motion.p>
            </motion.div>

            {/* Program Cards */}
            <div className="space-y-32 md:space-y-40">
              {programs.map((program, i) => (
                <motion.div
                  key={program._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.8 }}
                  className={`flex flex-col ${i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} gap-10 md:gap-16 items-center relative ${!program.isActive ? "opacity-75" : ""}`}
                >
                  <div className="flex-1 space-y-6 md:space-y-8 w-full z-10">
                    <div className="relative">
                      {!program.isActive && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute -top-10 left-0"
                        >
                          <Badge
                            variant="outline"
                            className="border-primary text-primary px-3 py-1 font-bold tracking-widest uppercase text-[10px] md:text-xs bg-primary/10 backdrop-blur-md"
                          >
                            Coming Soon
                          </Badge>
                        </motion.div>
                      )}

                      <Badge
                        variant="secondary"
                        className="mb-4 text-[10px] md:text-xs tracking-widest uppercase text-primary bg-primary/10 border-none font-bold"
                      >
                        {program.tagline}
                      </Badge>

                      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 md:mb-6 text-foreground leading-tight tracking-tighter">
                        {program.name}
                      </h2>
                      <p className="text-foreground/70 text-base md:text-lg leading-relaxed">
                        {program.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      {program.features.map((feature, idx) => (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          viewport={{ once: true }}
                          key={feature}
                        >
                          <Card className="bg-foreground/5 border-foreground/10 hover:bg-foreground/10 transition-colors backdrop-blur-sm overflow-hidden group">
                            <CardContent className="p-4 flex items-center gap-3">
                              <Rocket className="text-primary size-5 group-hover:scale-110 transition-transform" />
                              <span className="text-sm font-semibold text-foreground/90 leading-tight">
                                {feature}
                              </span>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    <div className="pt-4">
                      {program.isActive ? (
                        <Button
                          asChild
                          size="lg"
                          className="w-full sm:w-auto text-base font-bold shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all hover:scale-105 h-14 px-8 rounded-xl"
                        >
                          <Link
                            href="/register"
                            className="flex items-center gap-2"
                          >
                            Join waitlist
                            <ArrowRight className="size-5" />
                          </Link>
                        </Button>
                      ) : (
                        <Button
                          disabled
                          size="lg"
                          variant="outline"
                          className="w-full sm:w-auto text-base font-bold bg-foreground/5 border-foreground/10 text-foreground/50 h-14 px-8 rounded-xl"
                        >
                          Registering Soon
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 relative aspect-4/3 lg:aspect-square xl:aspect-video w-full max-w-2xl mx-auto">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className="absolute -inset-1 sm:-inset-2 bg-linear-to-tr from-primary/30 via-transparent to-secondary/30 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="relative h-full w-full rounded-2xl md:rounded-3xl overflow-hidden border border-foreground/10 glass-card group">
                      <Image
                        src={program.image}
                        alt={program.name}
                        fill
                        className={`object-cover ${program.isActive ? "opacity-90 group-hover:scale-105" : "opacity-40 grayscale"} transition-transform duration-700`}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={i === 0}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent"></div>

                      {!program.isActive && (
                        <div className="absolute inset-0 flex items-center justify-center p-6">
                          <motion.div
                            initial={{ rotate: -10, opacity: 0 }}
                            whileInView={{ rotate: -15, opacity: 1 }}
                            className="text-3xl md:text-5xl font-black text-foreground/40 uppercase tracking-[0.3em] lg:tracking-[0.5em] text-center w-full"
                          >
                            Coming Soon
                          </motion.div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Placement Stats / Partnership */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mt-32 md:mt-40 pt-16 md:pt-24 border-t border-foreground/10"
            >
              <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
                <div className="text-center lg:text-left order-2 lg:order-1">
                  <h2 className="text-3xl md:text-4xl font-black mb-6 lg:mb-8 tracking-tighter">
                    Trusted by Local & Global Partners
                  </h2>
                  <p className="text-foreground/70 text-base md:text-lg mb-8 md:mb-10 max-w-xl mx-auto lg:mx-0">
                    Our students have gone on to build solutions for businesses
                    in Kasauli and secure roles in the world's most innovative
                    tech hubs.
                  </p>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-6 md:gap-8 opacity-40 grayscale items-center">
                    <span className="text-xl md:text-2xl font-black tracking-tighter">
                      CLOUDWARE
                    </span>
                    <span className="text-xl md:text-2xl font-black tracking-tighter">
                      NEXUS.IO
                    </span>
                    <span className="text-xl md:text-2xl font-black tracking-tighter">
                      SKYNET
                    </span>
                    <span className="text-xl md:text-2xl font-black tracking-tighter">
                      APEXLABS
                    </span>
                  </div>
                </div>

                <div className="order-1 lg:order-2">
                  <Card className="bg-primary/5 border-primary/20 overflow-hidden relative backdrop-blur-md hover:bg-primary/10 transition-colors duration-500">
                    <div className="absolute -top-20 -right-20 w-48 h-48 md:w-64 md:h-64 bg-primary/20 blur-3xl rounded-full"></div>
                    <CardContent className="p-8 md:p-12 text-center lg:text-left relative z-10 flex flex-col justify-center min-h-75">
                      <h3 className="text-2xl md:text-3xl font-black mb-4 tracking-tighter">
                        Want to partner with us?
                      </h3>
                      <p className="text-foreground/70 mb-8 text-sm md:text-base leading-relaxed">
                        Collaborate on live projects, sponsor a hackathon, or
                        hire from our elite pool of talent.
                      </p>

                      <Button
                        asChild
                        variant="default"
                        className="w-full sm:w-auto self-center lg:self-start group rounded-xl"
                      >
                        <Link
                          href="/contact"
                          className="flex items-center gap-2 font-bold px-6 py-6"
                        >
                          Contact Partnership Team
                          <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        <GlobalFooter />
      </div>
    </div>
  );
};

export default ProgramsPage;
