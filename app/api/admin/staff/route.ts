import bcrypt from "bcryptjs";
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
        "name email role designation roleDescription image isActive isDirector createdAt",
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
      image,
      isDirector,
    } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Name, email, password, and role are required" },
        { status: 400 },
      );
    }

    // Validate image size (max 200KB)
    if (image) {
      // image is expected to be a data URL: data:image/png;base64,iVBORw0KGgo...
      const base64Data = image.split(",")[1];
      if (base64Data) {
        const buffer = Buffer.from(base64Data, "base64");
        // 200KB limit
        if (buffer.length > 200 * 1024) {
          return NextResponse.json(
            {
              error:
                "Image size exceeds the 200KB limit. Please try a smaller image.",
            },
            { status: 400 },
          );
        }
      }
    }

    await connectDB();

    const existingStaff = await Staff.findOne({ email }).collation(
      EMAIL_COLLATION,
    );

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
    if (!id) {
      return NextResponse.json({ error: "Staff id required" }, { status: 400 });
    }

    await connectDB();
    const staff = await Staff.findById(id);

    if (!staff) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    // Toggle logic: Explicitly check for false, everything else toggles to false.
    const currentStatus = staff.isActive !== false;
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
      image,
      isDirector,
    } = await req.json();

    if (!id) {
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
        const emailUsed = await Staff.findOne({
          email: nextEmail,
          _id: { $ne: staff._id },
        }).collation(EMAIL_COLLATION);
        if (emailUsed) {
          return NextResponse.json(
            { error: "Email already in use" },
            { status: 400 },
          );
        }
        staff.email = nextEmail;
      }
    }

    if (name) staff.name = name;
    if (designation !== undefined) staff.designation = designation;
    if (roleDescription !== undefined) staff.roleDescription = roleDescription;
    if (typeof image === "string") staff.image = image;
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
