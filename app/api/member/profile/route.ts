import { NextResponse } from "next/server";
import connectDB from "@/backend/lib/db";
import Staff from "@/backend/models/Staff";
import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_kasaulicoder_secret_key",
);

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      console.log("No token in /api/member/profile");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    console.log("Payload in /api/member/profile:", payload);

    if (payload.type !== "admin") {
      console.log("Failed type check:", payload.type);
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    await connectDB();
    const staff = await Staff.findById(payload.id).select("-password");

    if (!staff) {
      console.log("Staff not found for id:", payload.id);
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    return NextResponse.json(staff);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (payload.type !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { name, email, password } = await req.json();

    await connectDB();
    const staff = await Staff.findById(payload.id);

    if (!staff) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    if (name) staff.name = name;
    if (email) {
      // Check if email is already taken by another person
      const emailUsed = await Staff.findOne({ email, _id: { $ne: staff._id } });
      if (emailUsed) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 },
        );
      }
      staff.email = email;
    }

    if (password) {
      staff.password = await bcrypt.hash(password, 12);
    }

    await staff.save();

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
