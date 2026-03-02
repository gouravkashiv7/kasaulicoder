import { NextResponse } from "next/server";
import connectDB from "@/backend/lib/db";
import Staff from "@/backend/models/Staff";
import bcrypt from "bcryptjs";

export async function POST() {
  await connectDB();

  try {
    const existingSuperAdmin = await Staff.findOne({ role: "superadmin" });

    if (existingSuperAdmin) {
      return NextResponse.json(
        { message: "SuperAdmin already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash("admin@kasaulicoder", 12);

    const superAdmin = await Staff.create({
      name: "Super Admin",
      email: "admin@kasaulicoder.com",
      password: hashedPassword,
      role: "superadmin",
      isActive: true,
    });

    return NextResponse.json(
      {
        message: "SuperAdmin created successfully",
        credentials: {
          email: "admin@kasaulicoder.com",
          password: "admin@kasaulicoder",
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
