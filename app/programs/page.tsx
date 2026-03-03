import ProgramsPage from "@/components/marketing/ProgramsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Explore our specialized tech programs designed to take you from beginner to industry-ready developer with hands-on training.",
};

export default function Programs() {
  return <ProgramsPage />;
}
