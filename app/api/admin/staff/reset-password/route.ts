import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getServerSession } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import { sendPasswordResetEmail } from "@/backend/lib/email";
import { issuePasswordResetLink } from "@/backend/lib/passwordReset";
import { rateLimit } from "@/backend/lib/rateLimit";
import Staff from "@/backend/models/Staff";

// Superadmin sends a password-reset email to one team member.
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.type !== "admin" || session.role !== "superadmin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    if (!rateLimit(req, "staff-reset", 30, 3600000)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const { id } = await req.json();
    if (typeof id !== "string" || !mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid staff id" }, { status: 400 });
    }

    await connectDB();
    const staff = await Staff.findById(id);
    if (!staff) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }
    if (staff.role === "superadmin") {
      return NextResponse.json(
        { error: "Superadmin accounts reset their own password" },
        { status: 400 },
      );
    }
    if (!staff.isActive) {
      return NextResponse.json(
        { error: "This account is deactivated. Activate it first." },
        { status: 400 },
      );
    }

    const resetUrl = await issuePasswordResetLink(staff, "staff");
    if (!resetUrl) {
      return NextResponse.json(
        { error: "Reset links are not configured on this server" },
        { status: 500 },
      );
    }

    await sendPasswordResetEmail(staff.email, staff.name, resetUrl);

    return NextResponse.json({
      message: `Password reset email sent to ${staff.email}`,
    });
  } catch (error) {
    console.error("Staff reset email error:", (error as Error)?.name);
    return NextResponse.json(
      { error: "Could not send the reset email" },
      { status: 500 },
    );
  }
}
