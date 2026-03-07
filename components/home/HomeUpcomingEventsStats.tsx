"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const HomeUpcomingEventsStats = () => {
  return (
    <section className="py-24 px-6 bg-transparent border-t border-foreground/5 relative z-10">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col h-full"
        >
          <div className="mb-8">
            <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4">
              Join The Action
            </h2>
            <h3 className="text-4xl font-black text-foreground leading-tight">
              Upcoming Events
            </h3>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="glass-morphism p-8 sm:p-12 rounded-3xl border border-foreground/10 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Coming Soon
                </div>
                <h4 className="text-2xl font-bold text-foreground mb-4">
                  New Events are being curated
                </h4>
                <p className="text-foreground/60 max-w-sm mx-auto mb-8">
                  We're preparing new high-impact hackathons and project
                  cohorts.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {["Next.js", "Stripe", "AI", "Web3"].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-lg bg-foreground/5 border border-foreground/10 text-[10px] font-bold uppercase tracking-wider text-foreground/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Success Stats */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col"
        >
          <div className="mb-8">
            <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4">
              Our Impact
            </h2>
            <h3 className="text-4xl font-black text-foreground leading-tight">
              Success Stats
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {[
              { value: "100%", label: "Placement Support", icon: "verified" },
              {
                value: "15+",
                label: "Industry Blueprints",
                icon: "rocket_launch",
              },
              { value: "25+", label: "Modern Frameworks", icon: "terminal" },
              { value: "50+", label: "Latest Stacks", icon: "layers" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-card border border-foreground/10 rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center justify-center relative overflow-hidden group shadow-lg backdrop-blur-sm aspect-square sm:aspect-auto sm:min-h-48"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-6xl text-primary">
                    {stat.icon}
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-linear-to-br from-foreground to-foreground/40 mb-2 drop-shadow-lg relative z-10">
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-primary tracking-widest uppercase relative z-10 px-2">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeUpcomingEventsStats;
