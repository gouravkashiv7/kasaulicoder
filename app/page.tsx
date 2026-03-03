"use client";

import React, { Suspense, useState, useEffect } from "react";
import HomeVisionHero from "@/components/home/HomeVisionHero";
import PageLoading from "@/components/ui/page-loading";

const AnoAI = React.lazy(
  () => import("@/components/ui/animated-shader-background"),
);

export default function Home() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!ready) {
    return (
      <PageLoading
        title="Loading Homepage"
        subtitle="Launching Kasauli Coder..."
      />
    );
  }

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
