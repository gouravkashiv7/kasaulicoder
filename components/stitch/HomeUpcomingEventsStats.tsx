"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const HomeUpcomingEventsStats = () => {
  return (
    <section className="py-24 px-6 bg-background border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4">
            Join The Action
          </h2>
          <h3 className="text-4xl font-black text-foreground mb-8 leading-tight">
            Upcoming Events
          </h3>

          <div className="space-y-4">
            {[
              {
                title: "Himalayan Hackathon 2024",
                date: "Oct 15 - Oct 17",
                type: "Virtual & In-Person",
                tags: ["AI", "Web3"],
              },
              {
                title: "SaaS Builders Live Project",
                date: "Nov 1st Onwards",
                type: "Remote Cohort",
                tags: ["Next.js", "Stripe"],
              },
            ].map((event, i) => (
              <div
                key={i}
                className="group relative glass-morphism p-6 rounded-2xl border border-white/10 hover:border-primary/50 transition-all overflow-hidden cursor-pointer"
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-primary/50 group-hover:bg-primary transition-colors"></div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {event.title}
                  </h4>
                  <div className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
                    {event.date}
                  </div>
                </div>
                <p className="text-foreground/60 text-sm mb-4">{event.type}</p>
                <div className="flex gap-2">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 bg-foreground/5 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Success Stats */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-glow-radial -z-10"></div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { value: "100%", label: "Placement Rate", icon: "verified" },
              {
                value: "45+",
                label: "Projects Shipped",
                icon: "rocket_launch",
              },
              { value: "20+", label: "Hiring Partners", icon: "handshake" },
              { value: "10k+", label: "Community Members", icon: "groups" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center flex flex-col items-center justify-center relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-6xl text-primary">
                    {stat.icon}
                  </span>
                </div>
                <div className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-linear-to-br from-foreground to-foreground/40 mb-2 drop-shadow-lg relative z-10">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-primary tracking-widest uppercase relative z-10">
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
