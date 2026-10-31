import { NextResponse } from "next/server";
import { getServerSession } from "@/backend/lib/auth";
import connectDB, { EMAIL_COLLATION } from "@/backend/lib/db";
import Staff from "@/backend/models/Staff";
import User from "@/backend/models/User";

async function getUserAuth(): Promise<{ id: string; type: string } | null> {
  const session = await getServerSession();
  return session ? { id: session.id, type: session.type } : null;
}

export async function GET() {
  const auth = await getUserAuth();
  if (!auth)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, type } = auth;
  await connectDB();

  let account: unknown;
  if (type === "admin") {
    const staff = await Staff.findById(id).select(
      "-password -resetPasswordToken -resetPasswordExpires",
    );
    // Normalize image to pic for frontend
    account = staff ? { ...staff.toObject(), pic: staff.image || null } : null;
  } else {
    account = await User.findById(id).select(
      "-password -resetPasswordToken -resetPasswordExpires",
    );
  }

  if (!account)
    return NextResponse.json({ error: "Account not found" }, { status: 404 });

  return NextResponse.json({ user: account });
}

export async function PATCH(req: Request) {
  const auth = await getUserAuth();
  if (!auth)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, type } = auth;
  await connectDB();

  const body = await req.json();
  const { name, email, pic } = body;

  const update: Record<string, string> = {};
  if (name?.trim()) update.name = name.trim();
  if (email?.trim()) update.email = email.trim().toLowerCase();

  if (pic) {
    if (type === "admin") {
      update.image = pic;
    } else {
      update.pic = pic;
    }
  }

  if (Object.keys(update).length === 0)
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });

  // Check email uniqueness if changed
  const Model = type === "admin" ? Staff : User;
  if (update.email) {
    const existing = await Model.findOne({
      email: update.email,
      _id: { $ne: id },
    }).collation(EMAIL_COLLATION);
    if (existing)
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 },
      );
  }

  const account = await Model.findByIdAndUpdate(id, update, {
    new: true,
  }).select("-password -resetPasswordToken -resetPasswordExpires");

  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  return NextResponse.json({
    message: "Profile updated",
    user: {
      id: account._id,
      name: account.name,
      email: account.email,
      pic: account.pic || account.image || null,
      userType: account.userType || null,
      role: account.role,
    },
  });
}
