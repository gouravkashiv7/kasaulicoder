"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { serviceGroups } from "@/lib/services";

const LogoGif = ({ size }: { size: number }) => {
  const [loaded, setLoaded] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const check = () =>
      setIsLight(document.documentElement.classList.contains("theme-light"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const filterStyle = isLight ? "invert(1)" : "none";

  return (
    <span className="relative block" style={{ width: size, height: size }}>
      {/* Fallback: logo.png shown instantly */}
      <img
        src="/logo.png"
        alt=""
        aria-hidden
        width={size}
        height={size}
        className="absolute inset-0 object-contain"
        style={{
          width: size,
          height: size,
          filter: filterStyle,
          opacity: loaded ? 0 : 1,
          transition: "opacity 0.4s ease",
        }}
      />
      {/* GIF: fades in once loaded */}
      <img
        src="/logo.gif"
        loading="lazy"
        alt="KasauliCoder Logo"
        width={size}
        height={size}
        onLoad={() => setLoaded(true)}
        className="absolute inset-0 object-contain"
        style={{
          width: size,
          height: size,
          filter: filterStyle,
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />
    </span>
  );
};

const linkClass =
  "text-sm font-medium text-foreground/65 hover:text-primary transition-colors w-fit focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded";

const footerColumns = [
  {
    title: "Services",
    links: serviceGroups.map((group) => ({
      label: group.title,
      href: `/services#${group.id}`,
    })),
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Projects", href: "/projects" },
      { label: "Blog", href: "/blogs" },
      { label: "Request a Proposal", href: "/pricing" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

const GlobalFooter = () => {
  return (
    <footer className="relative z-10 w-full overflow-hidden border-t border-foreground/10 bg-background/90 px-4 sm:px-6 pt-16 sm:pt-20 pb-10">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4 flex flex-col gap-6 max-w-sm">
          <Link href="/" className="flex items-center gap-3 w-fit group">
            <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/30 group-hover:border-primary transition-colors overflow-hidden relative">
              <LogoGif size={40} />
            </div>
            <span className="font-display text-xl font-black tracking-tighter text-foreground">
              Kasauli<span className="text-primary">Coder</span>
            </span>
          </Link>
          <p className="font-display text-lg font-semibold text-foreground">
            SaaS Solutions that Drive Growth
          </p>
          <p className="text-sm text-foreground/65 leading-relaxed">
            A SaaS and software product development company. We build SaaS
            products, custom software and web applications, and provide business
            automation, SEO, cloud infrastructure and technical support.
          </p>
          <Link
            href="/contact"
            className="text-sm font-bold text-primary hover:underline underline-offset-4 w-fit"
          >
            Discuss a Project
          </Link>
        </div>

        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-10">
          {footerColumns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="font-display text-sm font-bold text-foreground mb-5">
                {column.title}
              </h2>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link className={linkClass} href={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-14 pt-8 border-t border-foreground/10 text-sm text-foreground/50">
        © {new Date().getFullYear()} KasauliCoder. All rights reserved.
      </div>
    </footer>
  );
};

export default GlobalFooter;
