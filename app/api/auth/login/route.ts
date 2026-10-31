import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";
import { getJwtSecret } from "@/backend/lib/auth";
import connectDB, { EMAIL_COLLATION } from "@/backend/lib/db";
import { rateLimit } from "@/backend/lib/rateLimit";
import Staff from "@/backend/models/Staff";
import User from "@/backend/models/User";

export async function POST(req: Request) {
  try {
    if (!rateLimit(req, "login", 10, 900000)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }
    const { email, password, loginType } = await req.json();

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email ||
      !password ||
      !loginType
    ) {
      return NextResponse.json(
        { error: "Email, password, and loginType are required" },
        { status: 400 },
      );
    }

    await connectDB();

    type LoginAccount = {
      _id: { toString(): string };
      email: string;
      password: string;
      name?: string;
      role?: string;
      userType?: string | null;
      pic?: string | null;
      image?: string | null;
      isActive?: boolean;
    };
    let account: LoginAccount | null;

    if (loginType === "admin") {
      account = (await Staff.findOne({ email: email.trim() })
        .collation(EMAIL_COLLATION)
        .select("+password")) as unknown as LoginAccount | null;
    } else {
      account = (await User.findOne({ email: email.trim() })
        .collation(EMAIL_COLLATION)
        .select("+password")) as unknown as LoginAccount | null;
    }

    if (!account) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    if (account.isActive === false) {
      return NextResponse.json(
        {
          error:
            loginType === "admin"
              ? "This administrative account is inactive"
              : "Your account has been deactivated. Please contact support.",
        },
        { status: 403 },
      );
    }

    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Update last login for staff
    if (loginType === "admin") {
      await Staff.findByIdAndUpdate(account._id, { lastLogin: new Date() });
    }

    // Create token
    const token = await new SignJWT({
      id: account._id.toString(),
      email: account.email,
      role: account.role,
      userType: account.userType || null,
      type: loginType,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(getJwtSecret());

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: account._id,
          name: account.name,
          email: account.email,
          role: account.role,
          userType: account.userType || null,
          pic: account.pic || account.image || null, // Include profile image
        },
      },
      { status: 200 },
    );

    // Set cookie
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
