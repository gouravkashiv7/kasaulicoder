"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const HomeTeamWorkTestimonials = () => {
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

          <div className="grid md:grid-cols-2 max-w-4xl mx-auto gap-12">
            {[
              {
                name: "Alex Neon",
                role: "Founder & CEO",
                desc: "Former Tech Lead aiming to revolutionize tech education from the Himalayas.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC8uhV46FrtfwSfk6jmFCi31HGf8a6gEI_3XJnWQr7loXgo96DZq0Td5zA66tRu_OhcQdADAC8B4cBJhmTpLzUTYeq6DMCdRRAuFE5c-cxl4Fvjdr1lrBjl3OHbG-yhGtpJSVyq6J7fyaq-exlgYHUbK5Z7YLSuRUuLz4dtUTm7j8EFDzAjCWzUTLiwV8muyLfL-uRNPc1DJxAsZ5DsKvVHwFZZyU5CPgCMvRNnJnun43rUK2Gx9B3uSjHjks4KzY55Ia8SaeqOw-8",
              },
              {
                name: "Sarah Cipher",
                role: "Co-Founder & CTO",
                desc: "AI Architect building scalable systems and guiding our live project cohorts.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYX_GJGdVa2g53ZXo_gYvIyWUEOMbtekO9Pwf3eqiSIGYQkNjEgV4GH8Yzka5egS4_YO9FS9HQ6w7GywJfEEqpRvCWvH5qyxjURHB3Q8oGBCqXz1hw--o8OdAUG_smLp7LOOroojOfiS0ZMBJFj6x5hfokFhC2CIClPeSuawOZcZaPdEijAyS2p6xtjtpClWgdgCsKF-HVEFnXgIPLmjxAA6TinWNrEmIIXhehdtkr5e7XfjXInRpkQZSUwAm-Cd91blgvqRi7alk",
              },
            ].map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="text-center group"
              >
                <div className="relative size-48 mx-auto rounded-full overflow-hidden mb-6 border-4 border-white/5 group-hover:border-primary/50 transition-colors duration-500">
                  <Image
                    src={member.img}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h4 className="text-2xl font-bold text-foreground mb-1">
                  {member.name}
                </h4>
                <p className="text-primary font-mono text-sm mb-4">
                  {member.role}
                </p>
                <p className="text-foreground/60 text-sm">{member.desc}</p>
              </motion.div>
            ))}
          </div>

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
