"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const HomeTeamWorkTestimonials = () => {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch("/api/public/team");
        if (res.ok) {
          const data = await res.json();
          setTeamMembers(data);
        }
      } catch (error) {
        console.error("Failed to fetch team members");
      } finally {
        setLoadingTeam(false);
      }
    };
    fetchTeam();
  }, []);

  return (
    <>
      {/* Meet the Team & Work With Us */}
      <section className="py-24 px-6 relative overflow-hidden bg-transparent">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-3xl pointer-events-none transform translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4">
              The Brains Behind the Code
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-foreground mb-6">
              Meet the Team
            </h3>
          </motion.div>

          {loadingTeam ? (
            <div className="flex justify-center items-center py-20">
              <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center text-foreground/50 py-10 italic">
              Our core team is currently being assembled.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-7xl mx-auto px-4 sm:px-6">
              {teamMembers.map((member, i) => (
                <motion.div
                  key={member._id || member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.1,
                    duration: 0.5,
                  }}
                  className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 p-5 sm:p-6 glass-morphism rounded-[2.5rem] border border-white/5 hover:border-primary/20 transition-all group overflow-hidden relative min-h-40"
                >
                  {/* Background Accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-colors"></div>

                  <div className="relative size-24 sm:size-32 rounded-3xl overflow-hidden shrink-0 border-2 border-white/5 group-hover:border-primary/50 transition-all duration-700 shadow-xl mt-1 flex items-center justify-center bg-foreground/5">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                    ) : (
                      <span className="text-3xl sm:text-4xl font-black text-primary/40 group-hover:text-primary/60 transition-colors uppercase select-none">
                        {member.name?.charAt(0) || "K"}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  <div className="flex-1 min-w-0 pr-2 pt-1 text-center sm:text-left w-full">
                    <div className="mb-2">
                      <h4 className="text-xl sm:text-2xl font-black text-foreground group-hover:text-primary transition-colors tracking-tighter truncate">
                        {member.name}
                      </h4>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mt-1.5">
                        <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
                        <p className="text-primary font-black uppercase tracking-widest text-[9px]">
                          {member.designation || "Core Team"}
                        </p>
                      </div>
                    </div>

                    <p className="text-foreground/70 text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-2 md:line-clamp-3 group-hover:line-clamp-none transition-all duration-500 cursor-help">
                      {member.roleDescription}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default HomeTeamWorkTestimonials;
