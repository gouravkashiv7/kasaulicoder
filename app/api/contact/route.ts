import { NextResponse } from "next/server";
import connectDB from "@/backend/lib/db";
import ContactRequest from "@/backend/models/ContactRequest";

export async function POST(req: Request) {
  try {
    const { name, email, userType, query } = await req.json();

    if (!name || !email || !userType || !query) {
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
