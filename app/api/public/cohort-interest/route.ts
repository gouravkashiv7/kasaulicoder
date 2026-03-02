import { NextResponse } from "next/server";
import connectDB from "@/backend/lib/db";
import NextCohortInterest from "@/backend/models/NextCohortInterest";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 },
      );
    }

    const trimmed = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(trimmed)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    await connectDB();

    // Check for duplicate
    const existing = await NextCohortInterest.findOne({ email: trimmed });
    if (existing) {
      return NextResponse.json(
        { message: "You're already on the list! We'll notify you soon." },
        { status: 200 },
      );
    }

    await NextCohortInterest.create({ email: trimmed, emailSent: false });

    return NextResponse.json(
      {
        message: "You're on the list! We'll notify you when the cohort opens.",
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Cohort interest error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
