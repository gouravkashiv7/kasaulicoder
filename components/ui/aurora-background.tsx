"use client";

import dynamic from "next/dynamic";

// Client-only wrapper so server-rendered pages can use the brand aurora shader.
const AnoAI = dynamic(
  () => import("@/components/ui/animated-shader-background"),
  {
    ssr: false,
  },
);

export default function AuroraBackground() {
  return <AnoAI />;
}
