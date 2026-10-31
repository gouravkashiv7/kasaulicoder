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

// Read projects on each request so newly added projects appear without a redeploy.
export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await getShowcaseProjectsSafe({ limit: 3 });
  return <HomeVisionHero projects={projects} />;
}
