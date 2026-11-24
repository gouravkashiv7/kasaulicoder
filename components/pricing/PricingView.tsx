"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import GlobalFooter from "@/components/layout/GlobalFooter";
import ASMRStaticBackground from "@/components/ui/asmr-background";
import { primaryButton, secondaryButton } from "@/components/ui/marketing";
import type { Currency } from "@/lib/pricing";
import BuildTiers from "./BuildTiers";
import DiscountBanner from "./DiscountBanner";
import ManagedPlans from "./ManagedPlans";
import PricingFaq from "./PricingFaq";
import TeamProof from "./TeamProof";

const STORAGE_KEY = "kc-currency";

const PricingView = ({ initialCurrency }: { initialCurrency: Currency }) => {
  const [currency, setCurrency] = useState<Currency>(initialCurrency);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "INR" || saved === "USD") setCurrency(saved);
    } catch {}
  }, []);

  const choose = (next: Currency) => {
    setCurrency(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  };

  return (
    <div className="bg-transparent text-foreground min-h-screen selection:bg-primary/30 font-sans overflow-x-hidden">
      <ASMRStaticBackground />

      <main className="relative z-10 px-4 sm:px-6 pt-36 sm:pt-44 pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto">
          <section className="max-w-3xl mb-16 sm:mb-24">
            <p className="font-display text-base sm:text-lg font-semibold text-primary mb-5">
              Pricing
            </p>
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.02] mb-8">
              Clear starting prices, scoped to your project
            </h1>
            <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed mb-8">
              From a single page to a SaaS product, with SEO, deployment and
              maintenance managed for you. Every project gets a written quote
              before work begins.
            </p>
            <fieldset className="inline-flex rounded-xl border border-foreground/20 p-1 mb-8">
              <legend className="sr-only">Currency</legend>
              {(["INR", "USD"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={currency === c}
                  onClick={() => choose(c)}
                  className={`px-5 py-2 rounded-lg font-bold text-sm transition-colors ${
                    currency === c
                      ? "bg-primary text-primary-content"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {c === "INR" ? "₹ INR" : "$ USD"}
                </button>
              ))}
            </fieldset>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-sm sm:max-w-none">
              <Link href="/contact" className={primaryButton}>
                Get a scoped quote
              </Link>
              <Link href="/projects" className={secondaryButton}>
                See our projects
              </Link>
            </div>
          </section>

          <BuildTiers currency={currency} />
          <ManagedPlans currency={currency} />
          <DiscountBanner currency={currency} />
          <TeamProof />
          <PricingFaq />

          <section className="rounded-3xl border border-primary/30 bg-background/80 backdrop-blur-md p-8 sm:p-12 text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-black mb-4">
              Not sure which fits?
            </h2>
            <p className="text-foreground/70 mb-8 max-w-xl mx-auto">
              Tell us what you want to build and we will recommend the right
              tier and send a quote.
            </p>
            <Link href="/contact" className={`${primaryButton} mx-auto`}>
              Request a proposal
            </Link>
          </section>
        </div>
      </main>

      <div className="relative z-10">
        <GlobalFooter />
      </div>
    </div>
  );
};

export default PricingView;
