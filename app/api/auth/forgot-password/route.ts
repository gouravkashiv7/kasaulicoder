import { NextResponse } from "next/server";
import connectDB from "@/backend/lib/db";
import Staff from "@/backend/models/Staff";
import User from "@/backend/models/User";
import { SignJWT } from "jose";
import { sendPasswordResetEmail } from "@/backend/lib/email";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_kasaulicoder_secret_key"
);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectDB();

    // Check in Staff first
    let account = await Staff.findOne({ email });
    let accountType: "staff" | "user" = "staff";

    if (!account) {
      // Check in User
      account = await User.findOne({ email });
      accountType = "user";
    }

    if (!account) {
      // For security, don't reveal if email belongs to an account
      // But user wants to redirected if "correct email is entered"
      // So I'll return success even if not found, to prevent email enumeration
      // HOWEVER, the user said "if correct email is entered... send him a link"
      // Usually it's better to say "If an account exists with this email, you will receive a reset link."
      return NextResponse.json({ 
        message: "If an account exists with this email, you will receive a reset link shortly." 
      });
    }

    if (!account.isActive) {
      return NextResponse.json({ error: "Your account is deactivated. Please contact support." }, { status: 403 });
    }

    const token = await new SignJWT({
      id: account._id.toString(),
      email: account.email,
      type: accountType,
      resetPassword: true,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(JWT_SECRET);

    // Save token to DB for one-time use validation
    account.resetPasswordToken = token;
    account.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await account.save();

    const host = req.headers.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";
    const origin = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

    const resetUrl = `${origin}/reset-password?token=${token}`;

    await sendPasswordResetEmail(account.email, account.name, resetUrl);

    return NextResponse.json({ 
      message: "If an account exists with this email, you will receive a reset link shortly." 
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
