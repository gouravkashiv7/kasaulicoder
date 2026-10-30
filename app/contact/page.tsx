import type { Metadata } from "next";
import ContactForm from "@/components/marketing/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Discuss your project with KasauliCoder. Tell us what you would like built or improved and we will get back to you.",
};

export default function ContactPage() {
  return <ContactForm />;
}
