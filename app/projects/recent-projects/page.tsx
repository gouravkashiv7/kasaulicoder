import React from "react";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recent Projects",
  description:
    "Browse our past success stories and completed digital architectures.",
};

export default function RecentProjects() {
  return (
    <div className="relative bg-background text-foreground font-sans min-h-screen flex flex-col">
      <GlobalHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-12">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 text-foreground/70 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
            Past Work
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            Recent Case <span className="text-foreground/50">Studies</span>
          </h1>
          <p className="text-foreground/60 max-w-2xl text-lg">
            Review the proven high-performance solutions we have previously
            engineered and shipped to our clients.
          </p>
        </div>

        {/* Dummy Project */}
        <div className="grid lg:grid-cols-2 gap-8 items-center border border-foreground/10 bg-foreground/5 rounded-3xl p-6 sm:p-10 hover:border-foreground/20 transition-colors">
          <div className="order-2 lg:order-1 flex flex-col gap-4">
            <h3 className="text-2xl sm:text-3xl font-black text-foreground">
              Cloud-Native FinTech Portal
            </h3>
            <p className="text-foreground/70 leading-relaxed">
              We developed a completely serverless banking dashboard replacing
              legacy monolithic infrastructure. Our solution reduced API latency
              by 60% while meeting global data residency compliance standards
              natively.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-3 py-1 bg-foreground/10 rounded-md text-xs font-bold text-foreground/80">
                React
              </span>
              <span className="px-3 py-1 bg-foreground/10 rounded-md text-xs font-bold text-foreground/80">
                AWS Lambda
              </span>
              <span className="px-3 py-1 bg-foreground/10 rounded-md text-xs font-bold text-foreground/80">
                DynamoDB
              </span>
            </div>
            <div className="mt-6">
              <button className="px-6 py-2 bg-foreground text-background border border-transparent hover:bg-foreground/80 rounded-lg text-sm font-bold transition-colors">
                Read Case Study
              </button>
            </div>
          </div>

          <div className="order-1 lg:order-2 aspect-video w-full rounded-2xl bg-foreground/10 border border-foreground/10 flex items-center justify-center overflow-hidden">
            <span className="text-foreground/40 font-bold uppercase tracking-widest text-sm text-center">
              Cloud Portal <br /> Dashboard Screenshot
            </span>
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}
