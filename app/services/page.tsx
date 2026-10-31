import type { Metadata } from "next";
import ServicesPage from "@/components/marketing/ServicesPage";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Product engineering, business automation, SEO and digital growth, and cloud and technical support. See what KasauliCoder provides and how to enquire.",
  alternates: { canonical: "/services" },
};

export default function Services() {
  return <ServicesPage />;
}
