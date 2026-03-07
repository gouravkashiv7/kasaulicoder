import { NextResponse } from "next/server";
import connectDB from "@/backend/lib/db";
import Project from "@/backend/models/Project";
import Staff from "@/backend/models/Staff";

// Function to generate slug
const generateSlug = (title: string, desc: string) => {
  const base = `${title}-${desc.substring(0, 20)}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  return `${base}-${Math.floor(Math.random() * 1000)}`;
};

export async function POST() {
  try {
    await connectDB();

    // Data provided by the user
    const defaultProjects = [
      {
        title: "AI SaaS Boilerplate",
        outcome: "Launch a fully integrated SaaS in weeks",
        desc: "Built with Next.js, Tailwind, Stripe — Scalable, Fast & SEO-ready.",
        images: [
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDkqmd6cJ7Wo_yDBHW_RPBs0jEDLP_5yGUKaiymSgG9DStDhLLyv_MfNRr64wdHehQ_-AwP-GTQdjknMP2n3hMsUIW3mz9UkP4WS1QM0g7HE3oit1cCuvGt4Km1c4AWMVcAQI2d-HD7RJQhwNLgwcim0tAd1CBGVP4fxw8A8vK9XbJZigKLZmoGIw8kjn7yLvGOtWWqXOLKtqB02IBEQkr6lQxNWgfFc3X9zO1Q_snOR_QKXqb5c-6kFil2mVoev1HNdDDkzWILZcg",
        ],
        tags: ["NEXT.JS", "TAILWIND", "STRIPE"],
        status: "past",
      },
      {
        title: "Workflow Orchestrator",
        outcome: "Automation that cut admin time by 45%",
        desc: "Enterprise-grade automation tool using agentic workflows to handle complex business tasks.",
        images: [
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBLrZzBC1qPl3IPuDIaSy-GKLLHwvLxkZsxxvbbOSzEatZWcj4t8qWNQWHrHHZFbGDLt4kQFHeCOqYmO3pxpaZpoj-59M5O0oVelGvhHBtpSxmKmBAIIosXU2g0zurUXwkPBBk4FAkV0QYeONeiRphAm6YV9DOPVmFsRDip7Hw06auAffUB73YjV7E6S4IIHqEZs5tmJUmUc7BJss2vUnOj4t-HhEiHP5rHxe1aWRMpQmyJn4yQbi5mPOOrNusRk6sn_Zd_kpPalNc",
        ],
        tags: ["PYTHON", "LANGCHAIN", "ZAPIER"],
        status: "past",
      },
      {
        title: "AI Content Analytics",
        outcome: "Real-time insights dashboards with Next.js",
        desc: "Full-stack dashboard with real-time visualizations of LLM outputs and performance metrics.",
        images: [
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDtWew6lCblRoK84au8NTbJXud-LUukQH11GxXo9mQ2cdgB2EipW8sxGeAShmaRBTjIyHMZLC1PKU65A-f8UJQTVMfKajPUE1ovBcQVv7CY7pDr7O10Cw-_fSNKRcRgtfojWpuskNGQUSN0v4JBRcdJ-JcT_oXHV1vnBCeT5V3wJfim2NZONV2gGshMvHVx-C8uVUzANJJfjpUj1V78Kvj6qRBxtlH6Q-na2TL2V9_xmsXG68kCV5o21l4c4zhkReBLD6384OS53So",
        ],
        tags: ["NEXT.JS", "OPENAI", "THREE.JS"],
        status: "past",
      },
    ];

    // Create projects with generated slugs
    for (const data of defaultProjects) {
      const slug = generateSlug(data.title, data.desc);
      const existing = await Project.findOne({ title: data.title });

      if (!existing) {
        await Project.create({
          ...data,
          slug,
        });
      }
    }

    return NextResponse.json(
      { message: "Default projects seeded successfully." },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error seeding projects:", error);
    return NextResponse.json(
      { error: "Failed to seed projects", details: error.message },
      { status: 500 },
    );
  }
}
