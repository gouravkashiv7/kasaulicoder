import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getServerSession } from "@/backend/lib/auth";
import connectDB, { EMAIL_COLLATION } from "@/backend/lib/db";
import Staff from "@/backend/models/Staff";

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
    const staff = await Staff.findById(session.id).select(
      "-password -resetPasswordToken -resetPasswordExpires",
    );

    if (!staff) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    return NextResponse.json(staff);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
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

    const { name, email, password, designation, roleDescription } =
      await req.json();

    await connectDB();
    const staff = await Staff.findById(session.id);

    if (!staff) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    if (name) staff.name = name;
    if (email) {
      // Check if email is already taken by another person
      const emailUsed = await Staff.findOne({
        email,
        _id: { $ne: staff._id },
      }).collation(EMAIL_COLLATION);
      if (emailUsed) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 },
        );
      }
      staff.email = email;
    }

    // Admins maintain their own title and bio; other roles keep them read-only
    if (session.role === "admin" || session.role === "superadmin") {
      if (typeof designation === "string") {
        staff.designation = designation.trim().slice(0, 100);
      }
      if (typeof roleDescription === "string") {
        staff.roleDescription = roleDescription.trim().slice(0, 500);
      }
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
        designation: staff.designation,
        roleDescription: staff.roleDescription,
      },
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
