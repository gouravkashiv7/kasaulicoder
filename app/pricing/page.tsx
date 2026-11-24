import type { Metadata } from "next";
import { headers } from "next/headers";
import PricingView from "@/components/pricing/PricingView";
import { currencyForCountry } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Starting prices for websites, CRM-based sites and SaaS builds, plus monthly managed plans for hosting, SEO and support. Priced in INR for India and USD elsewhere.",
  alternates: { canonical: "/pricing" },
};

export default async function PricingPage() {
  const h = await headers();
  const country = h.get("x-vercel-ip-country") ?? h.get("cf-ipcountry");
  return <PricingView initialCurrency={currencyForCountry(country)} />;
}
