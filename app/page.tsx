import type { Metadata } from "next";
import HomeVisionHero from "@/components/home/HomeVisionHero";

export const metadata: Metadata = {
  title: "KasauliCoder | SaaS Solutions that Drive Growth",
  description:
    "We design and develop SaaS products, modern web applications and business automation. SEO, UI/UX, cloud infrastructure and ongoing technical support for businesses.",
};

export default function Home() {
  return (
    <main>
      <HomeVisionHero />
    </main>
  );
}
