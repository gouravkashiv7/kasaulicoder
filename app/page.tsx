import type { Metadata } from "next";
import { getShowcaseProjectsSafe } from "@/backend/lib/showcase";
import HomeVisionHero from "@/components/home/HomeVisionHero";

export const metadata: Metadata = {
  title: {
    absolute: "KasauliCoder | SaaS Solutions that Drive Growth",
  },
  description:
    "KasauliCoder designs and develops SaaS products, custom software and web applications, with business automation, SEO, UI/UX, cloud infrastructure and technical support for businesses.",
  alternates: { canonical: "/" },
};

// Cached and re-read from the database at most once a minute, so new or
// edited projects appear within a minute without hitting the DB per visit.
export const revalidate = 60;

export default async function Home() {
  const projects = await getShowcaseProjectsSafe({ limit: 3 });
  return <HomeVisionHero projects={projects} />;
}
