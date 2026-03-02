import { NextResponse } from "next/server";
import connectDB from "@/backend/lib/db";
import User from "@/backend/models/User";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_kasaulicoder_secret_key",
);

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.type === "admin" ? payload : null;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const admin = await verifyAdmin();
    if (!admin)
      return NextResponse.json({ error: "Access denied" }, { status: 403 });

    await connectDB();
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin)
      return NextResponse.json({ error: "Access denied" }, { status: 403 });

    const { id } = await req.json();
    if (!id)
      return NextResponse.json({ error: "User id required" }, { status: 400 });

    await connectDB();
    const user = await User.findById(id);
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // isActive defaults to true when field doesn't exist yet
    user.isActive = user.isActive === false ? true : false;
    await user.save();

    return NextResponse.json({ isActive: user.isActive });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
