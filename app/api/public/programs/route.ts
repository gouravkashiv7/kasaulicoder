import { NextResponse } from "next/server";
import connectDB from "@/backend/lib/db";
import Program from "@/backend/models/Program";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const programs = await Program.find({ isVisible: { $ne: false } }).sort({
      sortOrder: 1,
      createdAt: -1,
    });

    return NextResponse.json({ success: true, data: programs });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
