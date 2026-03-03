import WhoWeArePricing from "@/components/marketing/WhoWeArePricing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Choose the right plan for your development journey. We offer transparent pricing for students and professionals.",
};

export default function PricingPage() {
  return <WhoWeArePricing />;
}
