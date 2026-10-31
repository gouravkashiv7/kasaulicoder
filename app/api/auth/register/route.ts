import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";
import { getJwtSecret } from "@/backend/lib/auth";
import connectDB, { EMAIL_COLLATION } from "@/backend/lib/db";
import { rateLimit } from "@/backend/lib/rateLimit";
import User from "@/backend/models/User";

export async function POST(req: Request) {
  try {
    if (!rateLimit(req, "register", 5, 3600000)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }
    const body = await req.json();
    const { name, password, userType } = body;
    const email = typeof body.email === "string" ? body.email.trim() : "";

    if (!name || !email || !password || !userType) {
      return NextResponse.json(
        { error: "Name, email, password, and user type are required" },
        { status: 400 },
      );
    }

    if (typeof name !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
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

    const existingUser = await User.findOne({ email }).collation(
      EMAIL_COLLATION,
    );

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
      isActive: true,
    });

    // Auto-login: create JWT token
    const token = await new SignJWT({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      userType: user.userType,
      type: "user",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(getJwtSecret());

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
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
