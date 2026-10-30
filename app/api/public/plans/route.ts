import { NextResponse } from "next/server";
import connectDB from "@/backend/lib/db";
import Plan from "@/backend/models/Plan";

// GET: Fetch all plans (public)
export async function GET() {
  try {
    await connectDB();
    const plans = await Plan.find({ isActive: true }).sort({ sortOrder: 1 });
    return NextResponse.json({ plans }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
