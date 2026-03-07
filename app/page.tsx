import React from "react";
import { Metadata } from "next";
import HomeVisionHero from "@/components/home/HomeVisionHero";

export const metadata: Metadata = {
  title: "Kasauli Coder | Premier Tech Community & SaaS Solutions",
  description:
    "Join the community of passionate developers building future-ready tech from Kasauli. Explore programs, projects, and custom SaaS platforms.",
};

export default function Home() {
  return (
    <main>
      <HomeVisionHero />
    </main>
  );
}
