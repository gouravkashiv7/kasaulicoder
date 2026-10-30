import type { Metadata } from "next";
import GeneratedScreen from "@/components/marketing/GeneratedScreen";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Software projects built by KasauliCoder, from work in progress to completed projects.",
};

export default function ProjectsPage() {
  return <GeneratedScreen />;
}
