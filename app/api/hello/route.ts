import { NextResponse } from "next/server";
import connectDB from "@/backend/lib/db";
import User from "@/backend/models/User";

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}).limit(10);
    return NextResponse.json({ success: true, count: users.length, users });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
