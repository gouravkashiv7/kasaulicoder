import bcrypt from "bcryptjs";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import { parseImageDataUrl } from "@/backend/lib/attachments";
import { getServerSession } from "@/backend/lib/auth";
import connectDB, { EMAIL_COLLATION } from "@/backend/lib/db";
import {
  sendAccountActivationEmail,
  sendAccountDeactivationEmail,
  sendStaffWelcomeEmail,
} from "@/backend/lib/email";
import Staff from "@/backend/models/Staff";
import User from "@/backend/models/User";

// Guards against locking every superadmin out of the panel.
async function hasOtherActiveSuperadmin(staffId: unknown): Promise<boolean> {
  return Boolean(
    await Staff.exists({
      role: "superadmin",
      isActive: { $ne: false },
      _id: { $ne: staffId },
    }),
  );
}

// Only http(s) links are stored; anything else clears the field.
function cleanWebsite(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.href
      : "";
  } catch {
    return "";
  }
}

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.type !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    await connectDB();

    // If not superadmin, maybe return a limited selection?
    // For now, allow all admin types to see the staff list names/ids.
    const staffMembers = await Staff.find({})
      .select(
        "name email role designation roleDescription website image isActive isDirector createdAt",
      )
      .sort({ createdAt: -1 });

    return NextResponse.json(staffMembers);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "superadmin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const {
      name,
      email,
      password,
      role,
      designation,
      roleDescription,
      website,
      image,
      isDirector,
    } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Name, email, password, and role are required" },
        { status: 400 },
      );
    }

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return NextResponse.json(
        { error: "Name, email and password must be text" },
        { status: 400 },
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    // Same image check as editing: a real image, at most 200KB
    if (image) {
      const parsed = parseImageDataUrl(image);
      if ("error" in parsed) {
        return NextResponse.json({ error: parsed.error }, { status: 400 });
      }
      if (parsed.data.length > 200 * 1024) {
        return NextResponse.json(
          {
            error:
              "Image size exceeds the 200KB limit. Please try a smaller image.",
          },
          { status: 400 },
        );
      }
    }

    await connectDB();

    // Emails are unique across staff and user accounts, so password
    // reset always finds the right one
    const existingStaff =
      (await Staff.exists({ email }).collation(EMAIL_COLLATION)) ||
      (await User.exists({ email }).collation(EMAIL_COLLATION));

    if (existingStaff) {
      return NextResponse.json(
        { error: "Staff email already registered" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newStaff = await Staff.create({
      name,
      email,
      password: hashedPassword,
      role,
      designation,
      roleDescription,
      website: cleanWebsite(website),
      image,
      isActive: true,
      isDirector: isDirector === true,
    });

    // Send welcome email (fire-and-forget — don't block the response)
    sendStaffWelcomeEmail({
      toEmail: email,
      toName: name,
      role,
      designation,
      roleDescription,
      plainPassword: password,
    }).catch((err) =>
      console.error("[WelcomeEmail] Failed to send welcome email:", err),
    );

    return NextResponse.json(
      {
        message: "Team member created successfully",
        staff: {
          id: newStaff._id,
          name: newStaff.name,
          email: newStaff.email,
          role: newStaff.role,
          designation: newStaff.designation,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "superadmin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { id, sendEmail } = await req.json();
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Staff id required" }, { status: 400 });
    }

    await connectDB();
    const staff = await Staff.findById(id);

    if (!staff) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    // Toggle logic: Explicitly check for false, everything else toggles to false.
    const currentStatus = staff.isActive !== false;
    if (currentStatus) {
      if (staff._id.toString() === session.id) {
        return NextResponse.json(
          { error: "You cannot deactivate your own account" },
          { status: 400 },
        );
      }
      if (
        staff.role === "superadmin" &&
        !(await hasOtherActiveSuperadmin(staff._id))
      ) {
        return NextResponse.json(
          { error: "Cannot deactivate the last active superadmin" },
          { status: 400 },
        );
      }
    }
    staff.isActive = !currentStatus;
    await staff.save();

    // Send email notification if requested
    if (sendEmail) {
      try {
        if (staff.isActive) {
          await sendAccountActivationEmail(staff.email, staff.name);
        } else {
          await sendAccountDeactivationEmail(staff.email, staff.name);
        }
      } catch (emailErr) {
        console.error("Failed to send status toggle email:", emailErr);
        // We don't fail the toggle request if just the email fails
      }
    }

    return NextResponse.json({ isActive: staff.isActive });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Admins may edit the profile details of editors and support staff. Roles,
    // the director flag and everyone above them stay with a superadmin.
    const isSuper = session.role === "superadmin";
    if (!isSuper && session.role !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const {
      id,
      name,
      email,
      role,
      designation,
      roleDescription,
      website,
      image,
      isDirector,
    } = await req.json();

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Staff id required" }, { status: 400 });
    }

    await connectDB();
    const staff = await Staff.findById(id);

    if (!staff) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    if (!isSuper && !["editor", "support"].includes(staff.role)) {
      return NextResponse.json(
        { error: "Admins can only edit editors and support staff" },
        { status: 403 },
      );
    }
    // Directors control company finances; only a superadmin may change their
    // account (an email change would let an admin reset their password).
    if (!isSuper && staff.isDirector) {
      return NextResponse.json(
        { error: "Only a superadmin can edit a board director" },
        { status: 403 },
      );
    }

    // Validate a changed photo before saving anything. "" removes it, and a
    // photo sent back unchanged is left alone.
    if (typeof image === "string" && image !== "" && image !== staff.image) {
      const parsed = parseImageDataUrl(image);
      if ("error" in parsed) {
        return NextResponse.json({ error: parsed.error }, { status: 400 });
      }
      if (parsed.data.length > 200 * 1024) {
        return NextResponse.json(
          { error: "Image size exceeds 200KB limit." },
          { status: 400 },
        );
      }
    }

    if (typeof email === "string" && email.trim()) {
      const nextEmail = email.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) {
        return NextResponse.json(
          { error: "Enter a valid email address" },
          { status: 400 },
        );
      }
      if (nextEmail !== staff.email) {
        const emailUsed =
          (await Staff.exists({
            email: nextEmail,
            _id: { $ne: staff._id },
          }).collation(EMAIL_COLLATION)) ||
          (await User.exists({ email: nextEmail }).collation(EMAIL_COLLATION));
        if (emailUsed) {
          return NextResponse.json(
            { error: "Email already in use" },
            { status: 400 },
          );
        }
        staff.email = nextEmail;
        // A reset link sent to the old address must stop working
        staff.resetPasswordToken = undefined;
        staff.resetPasswordExpires = undefined;
      }
    }

    if (name) staff.name = name;
    if (designation !== undefined) staff.designation = designation;
    if (roleDescription !== undefined) staff.roleDescription = roleDescription;
    if (website !== undefined) staff.website = cleanWebsite(website);
    if (typeof image === "string") staff.image = image;
    if (
      isSuper &&
      role &&
      role !== "superadmin" &&
      staff.role === "superadmin" &&
      staff.isActive !== false &&
      !(await hasOtherActiveSuperadmin(staff._id))
    ) {
      return NextResponse.json(
        { error: "Cannot demote the last active superadmin" },
        { status: 400 },
      );
    }

    if (isSuper) {
      if (role) staff.role = role;
      if (typeof isDirector === "boolean") staff.isDirector = isDirector;
    }

    await staff.save();

    return NextResponse.json({
      message: "Team member updated successfully",
      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        designation: staff.designation,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
