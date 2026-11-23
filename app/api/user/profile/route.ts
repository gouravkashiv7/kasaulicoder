import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { parseImageDataUrl } from "@/backend/lib/attachments";
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

  // Staff edit their profile through /api/member/profile, which applies the
  // role rules for photos and profile text
  if (auth.type === "admin")
    return NextResponse.json(
      { error: "Staff profiles are updated via /api/member/profile" },
      { status: 403 },
    );

  try {
    const { id } = auth;
    await connectDB();

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object")
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    const { name, email, pic, currentPassword } = body;

    const update: Record<string, string> = {};
    if (typeof name === "string" && name.trim()) update.name = name.trim();
    if (typeof email === "string" && email.trim()) {
      update.email = email.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(update.email))
        return NextResponse.json(
          { error: "Enter a valid email address" },
          { status: 400 },
        );
    }

    if (pic) {
      const parsed = parseImageDataUrl(pic);
      if ("error" in parsed)
        return NextResponse.json({ error: parsed.error }, { status: 400 });
      if (parsed.data.length > 200 * 1024)
        return NextResponse.json(
          { error: "Photo exceeds the 200KB limit. Try a smaller image." },
          { status: 400 },
        );
      update.pic = pic;
    }

    if (Object.keys(update).length === 0)
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });

    const current = await User.findById(id).select("+password email");
    if (!current)
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    if (update.email === current.email.toLowerCase()) delete update.email;

    // Changing the sign-in email needs the current password, so a borrowed or
    // hijacked session can't lock the owner out
    if (
      update.email &&
      !(
        typeof currentPassword === "string" &&
        (await bcrypt.compare(currentPassword, current.password))
      )
    )
      return NextResponse.json(
        { error: "Enter your current password to change your email" },
        { status: 403 },
      );

    // Email must be unique across both user and staff accounts
    if (update.email) {
      const existing =
        (await User.exists({ email: update.email, _id: { $ne: id } }).collation(
          EMAIL_COLLATION,
        )) ||
        (await Staff.exists({ email: update.email }).collation(
          EMAIL_COLLATION,
        ));
      if (existing)
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 },
        );
    }

    // A reset link sent to the old address must stop working
    const account = await User.findByIdAndUpdate(
      id,
      update.email
        ? {
            ...update,
            $unset: { resetPasswordToken: 1, resetPasswordExpires: 1 },
          }
        : update,
      {
        new: true,
      },
    ).select("-password -resetPasswordToken -resetPasswordExpires");

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
  } catch (error) {
    // Two requests claiming the same email at once
    if ((error as { code?: number })?.code === 11000)
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 },
      );
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
