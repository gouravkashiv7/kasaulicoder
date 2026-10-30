import { getServerSession } from "@/backend/lib/auth";
import { NextResponse } from "next/server";
import connectDB from "@/backend/lib/db";
import Staff from "@/backend/models/Staff";
import bcrypt from "bcryptjs";


export async function GET() {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.type !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    await connectDB();
    const staff = await Staff.findById(session.id).select("-password -resetPasswordToken -resetPasswordExpires");

    if (!staff) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    return NextResponse.json(staff);
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.type !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { name, email, password } = await req.json();

    await connectDB();
    const staff = await Staff.findById(session.id);

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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
