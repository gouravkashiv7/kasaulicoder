import type { Metadata } from "next";
import ProposalRequest from "@/components/marketing/ProposalRequest";

export const metadata: Metadata = {
  title: "Request a Proposal",
  description:
    "Every KasauliCoder project is scoped to your requirements. Tell us about your project and request a proposal.",
};

export default function PricingPage() {
  return <ProposalRequest />;
}
