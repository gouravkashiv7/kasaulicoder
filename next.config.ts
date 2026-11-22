import type { NextConfig } from "next";
import { optimizedImageHosts } from "./lib/imageHosts";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async redirects() {
    return [
      { source: "/programs", destination: "/", permanent: true },
      { source: "/careers", destination: "/contact", permanent: true },
      { source: "/register", destination: "/contact", permanent: true },
    ];
  },
  images: {
    // Only these hosts go through the optimizer; other remote images render
    // unoptimized via canOptimizeImage() in lib/imageHosts.ts.
    remotePatterns: optimizedImageHosts.map((hostname) => ({
      protocol: "https" as const,
      hostname,
    })),
  },
};

export default nextConfig;
