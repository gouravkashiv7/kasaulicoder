"use client";

import Link from "next/link";
import Image from "next/image";

const GlobalFooter = () => {
  return (
    <footer className="py-12 px-6 border-t border-foreground/10 bg-background relative z-10 w-full overflow-hidden">
      {/* Decorative gradient for the footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent"></div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/30 overflow-hidden">
            <Image
              src="/logo.png"
              alt="KasauliCoder Logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <h2 className="text-lg font-black tracking-tighter text-foreground">
            Kasauli<span className="text-primary">Coder</span>
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm font-bold text-foreground/50 uppercase tracking-widest">
          <Link className="hover:text-primary transition-colors" href="/about">
            About
          </Link>
          <Link
            className="hover:text-primary transition-colors"
            href="/careers"
          >
            Careers
          </Link>
          <Link
            className="hover:text-primary transition-colors"
            href="/privacy"
          >
            Privacy Policy
          </Link>
          <Link className="hover:text-primary transition-colors" href="/terms">
            Terms of Service
          </Link>
          <Link
            className="hover:text-primary transition-colors"
            href="/contact"
          >
            Contact
          </Link>
        </div>

        <div className="text-sm font-semibold text-foreground/50">
          © {new Date().getFullYear()} KasauliCoder. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default GlobalFooter;
