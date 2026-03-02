"use client";

import Link from "next/link";
import Image from "next/image";

const GlobalFooter = () => {
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

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-foreground/5 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
        <div className="text-sm font-semibold text-foreground/40">
          © {new Date().getFullYear()} KasauliCoder. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default GlobalFooter;
