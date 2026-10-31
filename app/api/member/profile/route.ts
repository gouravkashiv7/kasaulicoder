import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { parseImageDataUrl } from "@/backend/lib/attachments";
import { getServerSession } from "@/backend/lib/auth";
import connectDB, { EMAIL_COLLATION } from "@/backend/lib/db";
import Staff from "@/backend/models/Staff";

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
    const staff = await Staff.findById(session.id).select(
      "-password -resetPasswordToken -resetPasswordExpires",
    );

    if (!staff) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    return NextResponse.json(staff);
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

    if (session.type !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { name, email, password, designation, roleDescription, image } =
      await req.json();

    // Validate the photo before changing anything. "" removes it.
    const canEditProfileText =
      session.role === "admin" || session.role === "superadmin";
    let newImage: string | undefined;
    if (canEditProfileText && typeof image === "string") {
      if (image === "") {
        newImage = "";
      } else {
        const parsed = parseImageDataUrl(image);
        if ("error" in parsed) {
          return NextResponse.json({ error: parsed.error }, { status: 400 });
        }
        if (parsed.data.length > 200 * 1024) {
          return NextResponse.json(
            { error: "Photo exceeds the 200KB limit. Try a smaller image." },
            { status: 400 },
          );
        }
        newImage = image;
      }
    }

    await connectDB();
    const staff = await Staff.findById(session.id);

    if (!staff) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    if (name) staff.name = name;
    if (email) {
      // Check if email is already taken by another person
      const emailUsed = await Staff.findOne({
        email,
        _id: { $ne: staff._id },
      }).collation(EMAIL_COLLATION);
      if (emailUsed) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 },
        );
      }
      staff.email = email;
    }

    // Admins maintain their own title and bio; other roles keep them read-only
    if (canEditProfileText) {
      if (newImage !== undefined) staff.image = newImage;
      if (typeof designation === "string") {
        staff.designation = designation.trim().slice(0, 100);
      }
      if (typeof roleDescription === "string") {
        staff.roleDescription = roleDescription.trim().slice(0, 500);
      }
    }

    if (password) {
      staff.password = await bcrypt.hash(password, 12);
    }

    await staff.save();

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        designation: staff.designation,
        roleDescription: staff.roleDescription,
        image: staff.image,
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
