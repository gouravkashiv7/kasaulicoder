import { NextResponse } from "next/server";
import connectDB from "@/backend/lib/db";
import User from "@/backend/models/User";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_kasaulicoder_secret_key",
);

export async function POST(req: Request) {
  try {
    const { name, email, password, userType } = await req.json();

    if (!name || !email || !password || !userType) {
      return NextResponse.json(
        { error: "Name, email, password, and user type are required" },
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

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      userType,
      emailVerified: false,
    });

    // Auto-login: create JWT token
    const token = await new SignJWT({
      id: user._id,
      email: user.email,
      role: user.role,
      userType: user.userType,
      type: "user",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(JWT_SECRET);

    const response = NextResponse.json(
      {
        message: "Registration successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          userType: user.userType,
        },
      },
      { status: 201 },
    );

    // Set auth cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24h
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
