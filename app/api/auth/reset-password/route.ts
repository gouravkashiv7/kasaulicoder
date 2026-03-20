import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import connectDB from "@/backend/lib/db";
import Staff from "@/backend/models/Staff";
import User from "@/backend/models/User";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_kasaulicoder_secret_key"
);

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    // Verify Token
    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (!payload.resetPassword) {
      return NextResponse.json({ error: "Invalid token type" }, { status: 400 });
    }

    await connectDB();

    const hashedPassword = await bcrypt.hash(password, 12);
    const update = { 
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null 
    };

    if (payload.type === "staff") {
      const staff = await Staff.findOne({ 
        _id: payload.id, 
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });
      if (!staff) {
        return NextResponse.json({ error: "Invalid or expired reset link. Please try again." }, { status: 400 });
      }
      staff.password = hashedPassword;
      staff.resetPasswordToken = undefined;
      staff.resetPasswordExpires = undefined;
      await staff.save();
    } else {
      const user = await User.findOne({ 
        _id: payload.id, 
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });
      if (!user) {
        return NextResponse.json({ error: "Invalid or expired reset link. Please try again." }, { status: 400 });
      }
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
    }

    return NextResponse.json({ message: "Password updated successfully! You can now log in." });
  } catch (error: any) {
    console.error("Reset password error:", error);
    if (error.code === "ERR_JWT_EXPIRED") {
      return NextResponse.json({ error: "Reset link has expired. Please request a new one." }, { status: 400 });
    }
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }
}
