"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";

const GlobalHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  const navLinks = [
    { title: "Home", href: "/" },
    { title: "Programs", href: "/programs" },
    { title: "Projects", href: "/projects" },
    { title: "Blog", href: "/insights" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // 1. Check localStorage first for instant hit
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }

    // 2. Refresh from API to ensure we have the latest (including pic)
    const refreshProfile = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            // Update state and localStorage with latest server-side data
            const current = stored ? JSON.parse(stored) : {};
            const updated = {
              ...current,
              ...data.user,
              // Backend uses _id, frontend might have 'id'
              id: data.user.id || data.user._id || current.id,
            };
            setUser(updated);
            localStorage.setItem("user", JSON.stringify(updated));
          }
        }
      } catch (err) {
        console.warn("Failed to refresh user profile", err);
      }
    };
    refreshProfile();

    // Sync across tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        if (e.newValue) {
          setUser(JSON.parse(e.newValue));
        } else {
          setUser(null);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; max-age=0";
    window.location.href = "/login";
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.loginType === "admin") {
      return user.role === "superadmin"
        ? "/admin/dashboard"
        : "/member/dashboard";
    }
    const userType = user.userType || "student";
    return `/user/${userType}/dashboard`;
  };

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

  // Helper to check if a link is active
  const isActive = (path: string) => {
    if (path === "/" && pathname !== "/") return false;
    return pathname.startsWith(path);
  };

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
                  priority
                  className="object-contain transition-all duration-500 dark:invert-0 invert"
                />
              </div>
              <h2 className="text-xl font-black tracking-tighter text-foreground">
                Kasauli<span className="text-primary">Coder</span>
              </h2>
            </Link>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 text-foreground/80">
            {navLinks.map((item, i) => {
              const active = isActive(item.href);
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <Link
                    className={`text-sm font-bold transition-colors hover:scale-110 inline-block relative group ${
                      active ? "text-primary" : "hover:text-primary"
                    }`}
                    href={item.href}
                  >
                    {item.title}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all ${
                        active ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    ></span>
                  </Link>
                </motion.div>
              );
            })}
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

            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href={getDashboardLink()}
                  className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 transition-all group"
                >
                  <div className="size-8 rounded-full overflow-hidden border border-primary/20 bg-primary/10 flex items-center justify-center shrink-0 shadow-inner group-hover:border-primary/50 transition-colors relative">
                    {/* Initials (Background) fallback */}
                    <span className="text-xs font-black text-primary select-none">
                      {(user.name || user.email || "U").charAt(0).toUpperCase()}
                    </span>
                    {/* Image Overlay */}
                    {(user.pic || user.image) && (
                      <img
                        src={user.pic || user.image}
                        alt={user.name || "User"}
                        className="absolute inset-0 size-full object-cover transition-opacity duration-300 opacity-0"
                        onLoad={(e) => {
                          (e.target as HTMLImageElement).style.opacity = "1";
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-[10px] font-black uppercase tracking-widest leading-tight text-foreground/40">
                      Dashboard
                    </p>
                    <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate max-w-24">
                      {user.name}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="size-10 flex items-center justify-center rounded-full hover:bg-rose-500/10 text-rose-500/70 hover:text-rose-500 transition-all border border-transparent hover:border-rose-500/20"
                  title="Logout"
                >
                  <span className="material-symbols-outlined text-xl">
                    logout
                  </span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`hidden sm:flex items-center justify-center text-sm font-bold transition-all px-5 py-2 rounded-full border ${
                    isActive("/login")
                      ? "text-primary bg-primary/10 border-primary/20"
                      : "text-foreground/80 hover:text-foreground hover:bg-foreground/5 border-transparent hover:border-foreground/10"
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="hidden sm:flex items-center justify-center bg-linear-to-r from-primary to-secondary text-white text-sm font-black px-6 py-2 rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] border border-white/20"
                >
                  Explore Solutions
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden size-10 items-center justify-center gap-1.5 focus:outline-none z-60 relative ${
                isMobileMenuOpen ? "hidden" : "flex flex-col"
              }`}
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
            className="fixed inset-0 z-60 bg-background/98 backdrop-blur-2xl lg:hidden flex flex-col overflow-hidden"
          >
            {/* Header inside mobile menu */}
            <div className="flex items-center justify-between p-6 w-full relative z-10 border-b border-foreground/5">
              <div className="flex items-center gap-3">
                <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/30 relative">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={24}
                    height={24}
                    priority
                    className="object-contain dark:invert-0 invert"
                  />
                </div>
                <h2 className="text-lg font-black tracking-tighter text-foreground">
                  Kasauli<span className="text-primary">Coder</span>
                </h2>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="size-10 flex items-center justify-center rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors"
                aria-label="Close Menu"
              >
                <span className="material-symbols-outlined text-2xl text-foreground/70">
                  close
                </span>
              </button>
            </div>

            <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent pointer-events-none"></div>

            <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
              <div className="mb-12">
                <ThemeSwitcher />
              </div>

              <nav className="flex flex-col items-center gap-6 relative z-10 w-full mb-12">
                {navLinks.map((item, i) => {
                  const active = isActive(item.href);
                  return (
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
                        className={`text-2xl font-bold transition-colors block py-1.5 uppercase tracking-tighter ${
                          active
                            ? "text-primary"
                            : "text-foreground hover:text-primary"
                        }`}
                      >
                        {item.title}
                        {active && (
                          <motion.div
                            layoutId="mobile-active"
                            className="h-1 bg-primary w-12 mx-auto mt-1 rounded-full"
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col gap-4 w-full max-w-xs relative z-10"
              >
                {user ? (
                  <div className="flex flex-col gap-4 w-full max-w-xs relative z-10">
                    <Link
                      href={getDashboardLink()}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-3 py-4 bg-primary/10 border border-primary/20 text-primary font-black rounded-xl"
                    >
                      <div className="size-6 rounded-full overflow-hidden border border-primary/30 bg-primary/10 flex items-center justify-center shrink-0 shadow-inner relative">
                        {/* Initials (Background) fallback */}
                        <span className="text-[10px] font-black text-primary select-none">
                          {(user.name || user.email || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                        {/* Image Overlay */}
                        {(user.pic || user.image) && (
                          <img
                            src={user.pic || user.image}
                            alt={user.name || "User"}
                            className="absolute inset-0 size-full object-cover transition-opacity duration-300 opacity-0"
                            onLoad={(e) => {
                              (e.target as HTMLImageElement).style.opacity =
                                "1";
                            }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        )}
                      </div>
                      Go to Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full py-4 text-rose-500 font-bold rounded-xl border border-rose-500/10 bg-rose-500/5"
                    >
                      Logout Account
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 w-full max-w-xs relative z-10">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`w-full py-4 font-bold rounded-xl text-center border transition-all ${
                        isActive("/login")
                          ? "bg-primary/10 border-primary/20 text-primary"
                          : "bg-white/5 border-white/10 text-foreground"
                      }`}
                    >
                      Login Member
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full py-4 bg-primary text-primary-content font-black rounded-xl text-center neon-glow"
                    >
                      Explore Solutions
                    </Link>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlobalHeader;
