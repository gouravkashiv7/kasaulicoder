import ContactCommunity from "@/components/marketing/ContactCommunity";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Kasauli Coder team for any inquiries, support, or partnership opportunities.",
};

export default function ContactPage() {
  return <ContactCommunity />;
}
