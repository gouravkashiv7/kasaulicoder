import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { getJwtSecret } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import { rateLimit } from "@/backend/lib/rateLimit";
import Staff from "@/backend/models/Staff";
import User from "@/backend/models/User";

export async function POST(req: Request) {
  try {
    if (!rateLimit(req, "reset", 10, 3600000)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }
    const { token, password } = await req.json();

    if (
      typeof token !== "string" ||
      typeof password !== "string" ||
      !token ||
      !password
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    // Verify Token
    const { payload } = await jwtVerify(token, getJwtSecret());

    if (!payload.resetPassword) {
      return NextResponse.json(
        { error: "Invalid token type" },
        { status: 400 },
      );
    }

    await connectDB();

    const hashedPassword = await bcrypt.hash(password, 12);
    if (payload.type === "staff") {
      const staff = await Staff.findOne({
        _id: payload.id,
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
      if (!staff) {
        return NextResponse.json(
          { error: "Invalid or expired reset link. Please try again." },
          { status: 400 },
        );
      }
      staff.password = hashedPassword;
      staff.resetPasswordToken = undefined;
      staff.resetPasswordExpires = undefined;
      await staff.save();
    } else {
      const user = await User.findOne({
        _id: payload.id,
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
      if (!user) {
        return NextResponse.json(
          { error: "Invalid or expired reset link. Please try again." },
          { status: 400 },
        );
      }
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
    }

    return NextResponse.json({
      message: "Password updated successfully! You can now log in.",
    });
  } catch (error: any) {
    // Log only the error type: messages can echo the token
    console.error("Reset password error:", error?.name);
    if (error.code === "ERR_JWT_EXPIRED") {
      return NextResponse.json(
        { error: "Reset link has expired. Please request a new one." },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 },
    );
  }
}
