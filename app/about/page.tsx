import type { Metadata } from "next";
import { getShowcaseProjectsSafe } from "@/backend/lib/showcase";
import AboutUs from "@/components/marketing/AboutUs";

export const metadata: Metadata = {
  title: "About",
  description:
    "KasauliCoder is a SaaS and software product development company. Learn what we build, how we approach software projects and how businesses work with us.",
  alternates: { canonical: "/about" },
};

// Cached and re-read from the database at most once a minute, so new or
// edited projects appear within a minute without hitting the DB per visit.
export const revalidate = 60;

export default async function About() {
  const projects = await getShowcaseProjectsSafe();

  // Unique technologies across published projects, most used first.
  // Version suffixes are dropped so "React 19" counts as "React".
  const counts = new Map<string, number>();
  for (const project of projects) {
    for (const tag of project.tags) {
      const name = tag.replace(/\s+\d+(\.\d+)*$/, "").trim();
      if (name) counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }
  const technologies = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name]) => name);

  return <AboutUs technologies={technologies} />;
}
