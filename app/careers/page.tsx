import CareersPage from "@/components/marketing/CareersPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join our mission to build a world-class tech community. Explore open roles and career opportunities at Kasauli Coder.",
};

export default function Careers() {
  return <CareersPage />;
}
