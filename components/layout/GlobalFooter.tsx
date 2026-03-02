"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

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
          <div className="relative group">
            <label htmlFor="footer-language" className="sr-only">
              Language
            </label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-foreground/10 bg-foreground/3 hover:border-primary/40 focus-within:border-primary/60 transition-all duration-300 cursor-pointer">
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
              <select
                id="footer-language"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-transparent text-sm font-medium text-foreground/60 appearance-none cursor-pointer focus:outline-none pr-5"
              >
                {LANGUAGES.map((lang) => (
                  <option
                    key={lang.code}
                    value={lang.code}
                    className="bg-background text-foreground"
                  >
                    {lang.name}
                  </option>
                ))}
              </select>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-foreground/30 -ml-4 pointer-events-none"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-foreground/10 hidden sm:block" />

          {/* Location Dropdown */}
          <div className="relative group">
            <label htmlFor="footer-location" className="sr-only">
              Location
            </label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-foreground/10 bg-foreground/3 hover:border-primary/40 focus-within:border-primary/60 transition-all duration-300 cursor-pointer">
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
              <select
                id="footer-location"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="bg-transparent text-sm font-medium text-foreground/60 appearance-none cursor-pointer focus:outline-none pr-5"
              >
                {COUNTRIES.map((country) => (
                  <option
                    key={country.code}
                    value={country.code}
                    className="bg-background text-foreground"
                  >
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-foreground/30 -ml-4 pointer-events-none"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default GlobalFooter;
