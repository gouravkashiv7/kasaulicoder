"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

// Framer Motion skips transform animations when the visitor prefers reduced motion.
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
