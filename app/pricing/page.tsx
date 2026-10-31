import type { Metadata } from "next";
import ProposalRequest from "@/components/marketing/ProposalRequest";

export const metadata: Metadata = {
  title: "Request a Proposal",
  description:
    "KasauliCoder scopes every project to your requirements instead of selling fixed packages. Tell us about your project and request a proposal.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return <ProposalRequest />;
}
