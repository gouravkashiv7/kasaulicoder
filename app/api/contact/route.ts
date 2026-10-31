import { NextResponse } from "next/server";
import connectDB from "@/backend/lib/db";
import { rateLimit } from "@/backend/lib/rateLimit";
import ContactRequest from "@/backend/models/ContactRequest";

export async function POST(req: Request) {
  try {
    if (!rateLimit(req, "contact", 5, 3600000)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }
    const body = await req.json();
    const { name, email, query } = body;
    // All public enquiries are business enquiries; userType is kept for
    // existing records and the admin view.
    const userType = body.userType ?? "professional";

    if (!name || !email || !query) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    if (!["student", "professional"].includes(userType)) {
      return NextResponse.json(
        { error: "Invalid user type selected" },
        { status: 400 },
      );
    }

    // Optional business details from the enquiry form
    const optional: Record<string, string> = {};
    for (const key of ["company", "service", "budget", "timeline"]) {
      const value = body[key];
      if (value === undefined || value === null || value === "") continue;
      if (typeof value !== "string" || value.length > 200) {
        return NextResponse.json(
          { error: `Invalid ${key} value` },
          { status: 400 },
        );
      }
      optional[key] = value.trim();
    }

    await connectDB();

    // Extract IP and Device from Headers
    const ipAddress =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const device = req.headers.get("user-agent") || "unknown";

    const newRequest = await ContactRequest.create({
      name,
      email,
      userType,
      query,
      ...optional,
      ipAddress: ipAddress.split(",")[0].trim(),
      device,
    });

    return NextResponse.json(
      { message: "Inquiry received successfully.", data: newRequest },
      { status: 201 },
    );
  } catch (error) {
    console.error("Contact request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
