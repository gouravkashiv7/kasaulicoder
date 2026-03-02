"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const COUNTRIES = [
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "AE", name: "UAE", flag: "🇦🇪" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "RU", name: "Russia", flag: "🇷🇺" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩" },
  { code: "LK", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "NP", name: "Nepal", flag: "🇳🇵" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "CL", name: "Chile", flag: "🇨🇱" },
  { code: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
  { code: "IE", name: "Ireland", flag: "🇮🇪" },
  { code: "IL", name: "Israel", flag: "🇮🇱" },
];

const LANGUAGES = [{ code: "en", name: "English", icon: "🌐" }];

const GlobalFooter = () => {
  const [selectedCountry, setSelectedCountry] = useState("IN");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [langOpen, setLangOpen] = useState(false);
  const [locOpen, setLocOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const locRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
      if (locRef.current && !locRef.current.contains(event.target as Node)) {
        setLocOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <footer className="pt-20 pb-10 px-6 border-t border-foreground/10 bg-transparent relative w-full overflow-hidden">
      {/* Decorative gradient for the footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent"></div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-12 lg:gap-8 relative z-10">
        <div className="flex flex-col gap-6 max-w-sm">
          <Link href="/" className="flex items-center gap-3 w-fit group">
            <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/30 group-hover:border-primary transition-colors overflow-hidden relative">
              <Image
                src="/logo.png"
                alt="KasauliCoder Logo"
                width={40}
                height={40}
                className="object-contain transition-all duration-500"
                style={{ filter: "drop-shadow(0 0 8px var(--primary))" }}
              />
            </div>
            <h2 className="text-xl font-black tracking-tighter text-foreground group-hover:drop-shadow-[0_0_8px_var(--primary)] transition-all">
              Kasauli<span className="text-primary">Coder</span>
            </h2>
          </Link>
          <p className="text-sm font-medium text-foreground/60 leading-relaxed">
            Empowering developers from the hills of Kasauli. Build, learn, and
            grow with a community of passionate coders shaping the future of
            tech.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-10 sm:gap-20">
          <div className="flex flex-col gap-5 min-w-30">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest border-l-2 border-primary pl-3">
              Platform
            </h3>
            <div className="flex flex-col gap-3 pl-3">
              <Link
                className="text-sm font-medium text-foreground/60 hover:text-primary transition-colors hover:translate-x-1 group inline-block w-fit"
                href="/"
              >
                Home{" "}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </Link>
              <Link
                className="text-sm font-medium text-foreground/60 hover:text-primary transition-colors hover:translate-x-1 group inline-block w-fit"
                href="/programs"
              >
                Programs{" "}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </Link>
              <Link
                className="text-sm font-medium text-foreground/60 hover:text-primary transition-colors hover:translate-x-1 group inline-block w-fit"
                href="/projects"
              >
                Projects{" "}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </Link>
              <Link
                className="text-sm font-medium text-foreground/60 hover:text-primary transition-colors hover:translate-x-1 group inline-block w-fit"
                href="/insights"
              >
                Blog{" "}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </Link>
              <Link
                className="text-sm font-medium text-foreground/60 hover:text-primary transition-colors hover:translate-x-1 group inline-block w-fit"
                href="/pricing"
              >
                Pricing{" "}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-5 min-w-30">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest border-l-2 border-primary pl-3">
              Company
            </h3>
            <div className="flex flex-col gap-3 pl-3">
              <Link
                className="text-sm font-medium text-foreground/60 hover:text-primary transition-colors hover:translate-x-1 group inline-block w-fit"
                href="/about"
              >
                About Us{" "}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </Link>
              <Link
                className="text-sm font-medium text-foreground/60 hover:text-primary transition-colors hover:translate-x-1 group inline-block w-fit"
                href="/careers"
              >
                Careers{" "}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </Link>
              <Link
                className="text-sm font-medium text-foreground/60 hover:text-primary transition-colors hover:translate-x-1 group inline-block w-fit"
                href="/contact"
              >
                Contact{" "}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-5 min-w-30">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest border-l-2 border-primary pl-3">
              Legal
            </h3>
            <div className="flex flex-col gap-3 pl-3">
              <Link
                className="text-sm font-medium text-foreground/60 hover:text-primary transition-colors hover:translate-x-1 group inline-block w-fit"
                href="/privacy"
              >
                Privacy Policy{" "}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </Link>
              <Link
                className="text-sm font-medium text-foreground/60 hover:text-primary transition-colors hover:translate-x-1 group inline-block w-fit"
                href="/terms"
              >
                Terms of Service{" "}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-foreground/5 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
        <div className="text-sm font-semibold text-foreground/40">
          © {new Date().getFullYear()} KasauliCoder. All rights reserved.
        </div>

        {/* Language & Location Dropdowns */}
        <div className="flex items-center gap-4 flex-wrap justify-center">
          {/* Language Dropdown */}
          <div className="relative group" ref={langRef}>
            <label htmlFor="footer-language" className="sr-only">
              Language
            </label>
            <button
              onClick={() => {
                setLangOpen(!langOpen);
                setLocOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-foreground/10 bg-foreground/3 hover:border-primary/40 focus:border-primary/60 hover:bg-foreground/5 transition-all duration-300 min-w-32.5 justify-between z-10 relative"
            >
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-foreground/40 group-hover:text-primary/70 transition-colors shrink-0"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span className="text-sm font-medium text-foreground truncate">
                  {LANGUAGES.find((l) => l.code === selectedLanguage)?.name ||
                    "English"}
                </span>
              </div>
              <motion.svg
                animate={{ rotate: langOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-foreground/40 shrink-0"
              >
                <polyline points="6 9 12 15 18 9" />
              </motion.svg>
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full left-0 mb-2 w-40 max-h-48 overflow-y-auto scrollbar-hide rounded-xl border border-glass-border bg-background/95 backdrop-blur-xl shadow-2xl z-50 p-1 custom-scrollbar"
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLanguage(lang.code);
                        setLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 text-sm transition-all rounded-lg flex items-center gap-2 ${
                        selectedLanguage === lang.code
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-foreground/80 hover:bg-foreground/5 hover:text-foreground"
                      }`}
                    >
                      <span>{lang.icon}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-foreground/10 hidden sm:block" />

          {/* Location Dropdown */}
          <div className="relative group" ref={locRef}>
            <label htmlFor="footer-location" className="sr-only">
              Location
            </label>
            <button
              onClick={() => {
                setLocOpen(!locOpen);
                setLangOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-foreground/10 bg-foreground/3 hover:border-primary/40 focus:border-primary/60 hover:bg-foreground/5 transition-all duration-300 min-w-40 justify-between z-10 relative"
            >
              <div className="flex items-center gap-2 truncate">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-foreground/40 group-hover:text-primary/70 transition-colors shrink-0"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="text-sm font-medium text-foreground truncate">
                  {COUNTRIES.find((c) => c.code === selectedCountry)?.flag}{" "}
                  {COUNTRIES.find((c) => c.code === selectedCountry)?.name ||
                    "Location"}
                </span>
              </div>
              <motion.svg
                animate={{ rotate: locOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-foreground/40 shrink-0"
              >
                <polyline points="6 9 12 15 18 9" />
              </motion.svg>
            </button>

            <AnimatePresence>
              {locOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full right-0 sm:left-auto mb-2 w-auto min-w-50 max-h-60 overflow-y-auto scrollbar-hide rounded-xl border border-glass-border bg-background/95 backdrop-blur-xl shadow-2xl z-50 p-1 custom-scrollbar"
                >
                  {COUNTRIES.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => {
                        setSelectedCountry(country.code);
                        setLocOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 text-sm whitespace-nowrap transition-all rounded-lg flex items-center gap-2 ${
                        selectedCountry === country.code
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-foreground/80 hover:bg-foreground/5 hover:text-foreground"
                      }`}
                    >
                      <span className="text-base">{country.flag}</span>
                      <span className="truncate">{country.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default GlobalFooter;
