"use client";

import React from "react";
import { Component as RotatingText } from "@/components/ui/rotating-text";

const words = ["faster", "better", "smarter", "together"];
const modes = ["slide", "fade", "blur", "flip", "drop"] as const;

const ShipTodayShowcase = () => {
  return (
    <section className="flex flex-col items-center justify-center gap-20 px-6 py-20 pb-40">
      {/* Hero showcase */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
          Build{" "}
          <RotatingText words={words} mode="slide" className="text-primary" />
        </h1>
      </div>

      {/* All modes grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl mx-auto">
        {modes.map((mode, i) => (
          <div
            key={mode}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-foreground/10 bg-foreground/5 p-8 glass-morphism text-center"
          >
            <span className="text-[11px] font-semibold tracking-widest uppercase text-foreground/50">
              {mode}
            </span>
            <p className="text-xl font-bold tracking-tight text-foreground">
              Ship{" "}
              <RotatingText
                words={["today", "now", "fast", "more"]}
                mode={mode}
                interval={2000 + i * 300}
                className="text-secondary"
              />
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShipTodayShowcase;
