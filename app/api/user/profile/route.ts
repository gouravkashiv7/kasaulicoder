import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import connectDB from "@/backend/lib/db";
import User from "@/backend/models/User";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_kasaulicoder_secret_key",
);

async function getUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.id as string;
  } catch {
    return null;
  }
}

export async function GET() {
  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const user = await User.findById(userId).select("-password");
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ user });
}

export async function PATCH(req: Request) {
  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const body = await req.json();
  const { name, email, pic } = body;

  const update: Record<string, string> = {};
  if (name?.trim()) update.name = name.trim();
  if (email?.trim()) update.email = email.trim().toLowerCase();
  if (pic) update.pic = pic; // base64 data URL

  if (Object.keys(update).length === 0)
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });

  // Check email uniqueness if changed
  if (update.email) {
    const existing = await User.findOne({
      email: update.email,
      _id: { $ne: userId },
    });
    if (existing)
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 },
      );
  }

  const user = await User.findByIdAndUpdate(userId, update, {
    new: true,
  }).select("-password");

  return NextResponse.json({
    message: "Profile updated",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      userType: user.userType,
      role: user.role,
    },
  });
}
