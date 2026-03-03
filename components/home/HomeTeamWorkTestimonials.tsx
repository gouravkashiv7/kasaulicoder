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

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 p-8 glass-morphism border border-primary/20 rounded-3xl text-center max-w-3xl mx-auto neon-glow"
          >
            <h4 className="text-2xl font-bold text-foreground mb-4">
              Want to build with us?
            </h4>
            <p className="text-foreground/60 mb-8">
              We are always looking for mentors, developers, and designers.
            </p>
            <Link href="/careers">
              <button className="px-8 py-3 bg-white/5 border border-white/10 text-foreground font-bold rounded-xl hover:bg-white/10 transition-all">
                View Open Roles
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-transparent border-t border-white/5 border-b relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              Verified{" "}
              <span className="text-stroke text-transparent">Success</span>{" "}
              Stories
            </h2>
          </motion.div>

          <div className="flex flex-nowrap overflow-x-auto gap-6 sm:gap-8 pt-10 pb-12 px-4 sm:px-0 scrollbar-hide snap-x transition-all">
            {[
              {
                name: "John Weaver",
                role: "Software Engineer @ TechCorp",
                text: "KasauliCoder helped me transition from a non-tech background to a full-stack engineer in 6 months. Best hackathons ever.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBoUehh7Ba7_0RCwqxlTyWJUxC33htuRfgzpqbvJWncHUh_i2Ei4Cgei3ixbh_KjGAgnbL486YoC4lfqCWUzcVkzWGGJwBzBaHtPYbgLAIKE5cblHNAujZK8fLRRQFnPvRJmjSPEMkuoUPSIlLchsAjpX97bTVNP4_uZI-sDkTnbQWpY6c2XT9icI5QE8Hbq2_g-FUcJ8I2nHf9D9fj71tnD8RALfm4M7Nhv6Ui0c2oS15x624yXfgYMk3xdLVRHH9kmcK5BPqSPWc",
              },
              {
                name: "Emily Rogers",
                role: "Frontend Dev",
                text: "The mentors are top-notch. Building live projects instead of following tutorials made all the difference.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC8uhV46FrtfwSfk6jmFCi31HGf8a6gEI_3XJnWQr7loXgo96DZq0Td5zA66tRu_OhcQdADAC8B4cBJhmTpLzUTYeq6DMCdRRAuFE5c-cxl4Fvjdr1lrBjl3OHbG-yhGtpJSVyq6J7fyaq-exlgYHUbK5Z7YLSuRUuLz4dtUTm7j8EFDzAjCWzUTLiwV8muyLfL-uRNPc1DJxAsZ5DsKvVHwFZZyU5CPgCMvRNnJnun43rUK2Gx9B3uSjHjks4KzY55Ia8SaeqOw-8",
              },
              {
                name: "Priya Patel",
                role: "AI Intern",
                text: "The Himalayan vibe combined with hardcore coding creates the perfect environment to learn and grow.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYX_GJGdVa2g53ZXo_gYvIyWUEOMbtekO9Pwf3eqiSIGYQkNjEgV4GH8Yzka5egS4_YO9FS9HQ6w7GywJfEEqpRvCWvH5qyxjURHB3Q8oGBCqXz1hw--o8OdAUG_smLp7LOOroojOfiS0ZMBJFj6x5hfokFhC2CIClPeSuawOZcZaPdEijAyS2p6xtjtpClWgdgCsKF-HVEFnXgIPLmjxAA6TinWNrEmIIXhehdtkr5e7XfjXInRpkQZSUwAm-Cd91blgvqRi7alk",
              },
            ].map((testi, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="min-w-70 sm:min-w-87.5 md:min-w-112.5 snap-center bg-card border border-white/10 p-6 sm:p-8 rounded-xl relative group backdrop-blur-md"
              >
                <div className="absolute -top-4 -right-2 sm:-right-4 w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-full flex items-center justify-center border border-primary/40 z-10">
                  <span className="material-symbols-outlined text-primary">
                    format_quote
                  </span>
                </div>
                <div className="flex gap-1 text-primary mb-6">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="material-symbols-outlined text-sm">
                      star
                    </span>
                  ))}
                </div>
                <p className="text-foreground/80 italic mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">
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
                    <h4 className="font-bold text-foreground">{testi.name}</h4>
                    <p className="text-xs text-foreground/50">{testi.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeTeamWorkTestimonials;
