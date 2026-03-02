import { NextResponse } from "next/server";
import connectDB from "@/backend/lib/db";
import Staff from "@/backend/models/Staff";

export async function GET() {
  try {
    await connectDB();

    // Fetch active staff, typically those with an image and designation
    // For now we'll fetch all active staff who have admin/superadmin roles
    // and explicitly requested fields to show on the public page
    const teamMembers = await Staff.find({
      isActive: true,
      role: { $in: ["admin", "superadmin"] },
      image: { $exists: true, $ne: null },
    })
      .select("name designation roleDescription image role")
      .sort({ role: -1 }); // superadmin first, then admin

    return NextResponse.json(teamMembers, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
