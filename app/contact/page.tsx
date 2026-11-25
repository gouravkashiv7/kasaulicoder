import type { Metadata } from "next";
import ContactForm from "@/components/marketing/ContactForm";
import { buildTiers, managedPlans } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Discuss your project with KasauliCoder. Tell us what you want to build or improve, the service you need and your timeline, and we will reply by email.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage(props: {
  searchParams: Promise<{
    service?: string | string[];
    plan?: string | string[];
  }>;
}) {
  const { service, plan } = await props.searchParams;
  // Only known tier and plan ids from the pricing page are carried over.
  const tier = buildTiers.find((t) => t.id === plan);
  const managed = managedPlans.find((m) => m.id === plan);
  const initialPlan = tier
    ? `${tier.name} build`
    : managed
      ? `${managed.name} managed plan`
      : undefined;
  return (
    <ContactForm
      initialService={typeof service === "string" ? service : undefined}
      initialPlan={initialPlan}
    />
  );
}
