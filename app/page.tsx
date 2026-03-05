"use client";

import React, { Suspense } from "react";
import HomeVisionHero from "@/components/home/HomeVisionHero";

const AnoAI = React.lazy(
  () => import("@/components/ui/animated-shader-background"),
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
