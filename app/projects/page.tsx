import type { Metadata } from "next";
import GeneratedScreen from "@/components/marketing/GeneratedScreen";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "See the real-world projects built by our community members and partners using the latest technologies and best practices.",
};

export default function ProjectsPage() {
  return <GeneratedScreen />;
}
