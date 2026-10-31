import type { Metadata } from "next";
import ContactForm from "@/components/marketing/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Discuss your project with KasauliCoder. Tell us what you want to build or improve, the service you need and your timeline, and we will reply by email.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage(props: {
  searchParams: Promise<{ service?: string | string[] }>;
}) {
  const { service } = await props.searchParams;
  return (
    <ContactForm
      initialService={typeof service === "string" ? service : undefined}
    />
  );
}
