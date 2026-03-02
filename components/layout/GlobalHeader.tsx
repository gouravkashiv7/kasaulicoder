"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";

const GlobalHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "py-3 bg-background/80 backdrop-blur-xl border-b border-primary/20 shadow-lg"
            : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link
              href="/"
              className="flex items-center gap-3 group cursor-pointer"
            >
              <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/30 group-hover:border-primary transition-colors overflow-hidden relative">
                <Image
                  src="/logo.png"
                  alt="KasauliCoder Logo"
                  width={40}
                  height={40}
                  className="object-contain transition-all duration-500"
                  style={{
                    filter: "drop-shadow(0 0 8px var(--primary))",
                  }}
                />
              </div>
              <h2 className="text-xl font-black tracking-tighter text-foreground">
                Kasauli<span className="text-primary">Coder</span>
              </h2>
            </Link>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 text-foreground/80">
            {navLinks.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <Link
                  className="text-sm font-bold hover:text-primary transition-colors hover:scale-110 inline-block relative group"
                  href={item.href}
                >
                  {item.title}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Actions & Mobile Toggle */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="hidden md:block">
              <ThemeSwitcher />
            </div>

            <Link
              href="/login"
              className="hidden sm:block text-sm font-bold text-foreground/70 hover:text-foreground transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="hidden sm:block bg-primary text-primary-content text-sm font-black px-6 py-2.5 rounded-lg neon-glow hover:brightness-110 transition-all hover:scale-105 active:scale-95"
            >
              Enroll Now
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden size-10 flex flex-col items-center justify-center gap-1.5 focus:outline-none z-60 relative"
              aria-label="Toggle Menu"
            >
              <motion.span
                animate={
                  isMobileMenuOpen
                    ? { rotate: 45, y: 7.5 }
                    : { rotate: 0, y: 0 }
                }
                className="w-8 h-0.5 bg-primary block rounded-full"
              ></motion.span>
              <motion.span
                animate={
                  isMobileMenuOpen
                    ? { opacity: 0, x: -20 }
                    : { opacity: 1, x: 0 }
                }
                className="w-8 h-0.5 bg-primary block rounded-full"
              ></motion.span>
              <motion.span
                animate={
                  isMobileMenuOpen
                    ? { rotate: -45, y: -7.5 }
                    : { rotate: 0, y: 0 }
                }
                className="w-8 h-0.5 bg-primary block rounded-full"
              ></motion.span>
            </button>
          </motion.div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-55 bg-background/98 backdrop-blur-2xl lg:hidden flex flex-col overflow-y-auto"
          >
            <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent pointer-events-none"></div>

            <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-screen">
              <div className="mb-12">
                <ThemeSwitcher />
              </div>

              <nav className="flex flex-col items-center gap-6 relative z-10 w-full mb-12">
                {navLinks.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="w-full text-center"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-2xl font-bold text-foreground hover:text-primary transition-colors block py-1.5 uppercase tracking-tighter"
                    >
                      {item.title}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col gap-4 w-full max-w-xs relative z-10"
              >
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-4 bg-white/5 border border-white/10 text-foreground font-bold rounded-xl text-center"
                >
                  Login Member
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-4 bg-primary text-primary-content font-black rounded-xl text-center neon-glow"
                >
                  Join the Hub
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlobalHeader;
