import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import connectDB from "@/backend/lib/db";
import Staff from "@/backend/models/Staff";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
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

    await Staff.create({
      name: "Super Admin",
      email: "admin@kasaulicoder.com",
      password: hashedPassword,
      role: "superadmin",
      isActive: true,
    });

    return NextResponse.json(
      {
        message: "SuperAdmin created successfully",
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
