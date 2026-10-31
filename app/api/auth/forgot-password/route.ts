import { NextResponse } from "next/server";
import connectDB, { EMAIL_COLLATION } from "@/backend/lib/db";
import { sendPasswordResetEmail } from "@/backend/lib/email";
import { issuePasswordResetLink } from "@/backend/lib/passwordReset";
import { rateLimit } from "@/backend/lib/rateLimit";
import Staff from "@/backend/models/Staff";
import User from "@/backend/models/User";

export async function POST(req: Request) {
  try {
    if (!rateLimit(req, "forgot", 5, 3600000)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectDB();

    // Check in Staff first
    let account = await Staff.findOne({ email }).collation(EMAIL_COLLATION);
    let accountType: "staff" | "user" = "staff";

    if (!account) {
      // Check in User
      account = await User.findOne({ email }).collation(EMAIL_COLLATION);
      accountType = "user";
    }

    if (!account) {
      // For security, don't reveal if email belongs to an account
      // But user wants to redirected if "correct email is entered"
      // So I'll return success even if not found, to prevent email enumeration
      // HOWEVER, the user said "if correct email is entered... send him a link"
      // Usually it's better to say "If an account exists with this email, you will receive a reset link."
      return NextResponse.json({
        message:
          "If an account exists with this email, you will receive a reset link shortly.",
      });
    }

    if (!account.isActive) {
      return NextResponse.json(
        { error: "Your account is deactivated. Please contact support." },
        { status: 403 },
      );
    }

    const resetUrl = await issuePasswordResetLink(account, accountType);
    if (!resetUrl) {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }

    await sendPasswordResetEmail(account.email, account.name, resetUrl);

    return NextResponse.json({
      message:
        "If an account exists with this email, you will receive a reset link shortly.",
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
