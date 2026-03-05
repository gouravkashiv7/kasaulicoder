import React from "react";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Active Projects",
  description:
    "Explore the live projects currently being engineered in our labs.",
};

export default function ActiveProjects() {
  return (
    <div className="relative bg-background text-foreground font-sans min-h-screen flex flex-col">
      <GlobalHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-12">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Currently Engineering
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 group inline-block">
            Active <span className="text-primary">Projects</span>
          </h1>
          <p className="text-foreground/60 max-w-2xl text-lg">
            A look into the live solutions and cutting-edge digital
            architectures we are currently building.
          </p>
        </div>

        {/* Dummy Project */}
        <div className="grid lg:grid-cols-2 gap-8 items-center border border-foreground/10 bg-foreground/5 rounded-3xl p-6 sm:p-10 hover:border-primary/30 transition-colors">
          <div className="aspect-video w-full rounded-2xl bg-foreground/10 border border-foreground/10 flex items-center justify-center overflow-hidden relative group">
            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay group-hover:opacity-0 transition-opacity"></div>
            <span className="text-foreground/40 font-bold uppercase tracking-widest text-sm">
              Project Demo Visual
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-2xl sm:text-3xl font-black text-foreground">
              Next-Gen Delivery Automation
            </h3>
            <p className="text-foreground/70 leading-relaxed">
              We are engineering a high-performance logistics dashboard
              utilizing real-time WebSockets, 3D geospatial mapping, and
              predictive AI dispatching to minimize delivery times and optimize
              fleet routes.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-3 py-1 bg-foreground/10 rounded-md text-xs font-bold text-foreground/80">
                Next.js 15
              </span>
              <span className="px-3 py-1 bg-foreground/10 rounded-md text-xs font-bold text-foreground/80">
                Three.js
              </span>
              <span className="px-3 py-1 bg-foreground/10 rounded-md text-xs font-bold text-foreground/80">
                Socket.io
              </span>
            </div>
            <div className="mt-6 flex gap-4">
              <button className="px-6 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-bold opacity-50 cursor-not-allowed">
                In Development
              </button>
            </div>
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}
