"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const GlobalHeader = () => {
  const navLinks = [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "Blog", href: "/insights" },
    { title: "Programs", href: "/programs" },
    { title: "Projects", href: "/projects" },
    { title: "Pricing", href: "/pricing" },
    { title: "Careers", href: "/careers" },
    { title: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-primary/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            href="/"
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/30 group-hover:border-primary transition-colors overflow-hidden">
              <Image
                src="/logo.png"
                alt="KasauliCoder Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <h2 className="text-xl font-black tracking-tighter text-slate-100">
              Kasauli<span className="text-primary">Coder</span>
            </h2>
          </Link>
        </motion.div>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <Link
                className="text-sm font-medium text-slate-300 hover:text-primary transition-colors hover:scale-105 inline-block"
                href={item.href}
              >
                {item.title}
              </Link>
            </motion.div>
          ))}
        </nav>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <Link
            href="/login"
            className="hidden sm:block text-sm font-bold text-slate-300 hover:text-white transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-primary text-background-dark text-sm font-bold px-6 py-2.5 rounded-lg neon-glow hover:brightness-110 transition-all hover:scale-105"
          >
            Enroll Now
          </Link>
        </motion.div>
      </div>
    </header>
  );
};

export default GlobalHeader;
