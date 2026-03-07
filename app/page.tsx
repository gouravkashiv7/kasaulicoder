import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import HomeVisionHero from "@/components/home/HomeVisionHero";

export const metadata: Metadata = {
  title: "Kasauli Coder | Premier Tech Community & SaaS Solutions",
  description:
    "Join the community of passionate developers building future-ready tech from Kasauli. Explore programs, projects, and custom SaaS platforms.",
};

const AnoAI = dynamic(
  () => import("@/components/ui/animated-shader-background"),
  { ssr: false },
);

export default function Home() {
  return (
    <>
      {/* Fixed full-screen shader background */}
      <Suspense fallback={null}>
        <AnoAI />
      </Suspense>

      {/* Page content sits above the shader */}
      <div className="relative z-10">
        <HomeVisionHero />
      </div>
    </>
  );
}
