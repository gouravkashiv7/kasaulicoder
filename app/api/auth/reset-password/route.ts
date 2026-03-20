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

    if (payload.type === "staff") {
      const staff = await Staff.findByIdAndUpdate(payload.id, { password: hashedPassword });
      if (!staff) {
        return NextResponse.json({ error: "Account not found" }, { status: 404 });
      }
    } else {
      const user = await User.findByIdAndUpdate(payload.id, { password: hashedPassword });
      if (!user) {
        return NextResponse.json({ error: "Account not found" }, { status: 404 });
      }
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
