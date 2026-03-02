import { NextResponse } from "next/server";
import connectDB from "@/backend/lib/db";
import Staff from "@/backend/models/Staff";
import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import {
  sendStaffWelcomeEmail,
  sendAccountDeactivationEmail,
  sendAccountActivationEmail,
} from "@/backend/lib/email";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_kasaulicoder_secret_key",
);

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (payload.role !== "superadmin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    await connectDB();

    const staffMembers = await Staff.find({}).sort({ createdAt: -1 });

    return NextResponse.json(staffMembers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (payload.role !== "superadmin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { name, email, password, role, designation, roleDescription, image } =
      await req.json();

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

    const existingStaff = await Staff.findOne({ email });

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
        message: "Staff member created successfully",
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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (payload.role !== "superadmin") {
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
    const currentStatus = staff.isActive === false ? false : true;
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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (payload.role !== "superadmin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { id, name, role, designation, roleDescription, image } =
      await req.json();

    if (!id) {
      return NextResponse.json({ error: "Staff id required" }, { status: 400 });
    }

    await connectDB();
    const staff = await Staff.findById(id);

    if (!staff) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    if (name) staff.name = name;
    if (role) staff.role = role;
    if (designation !== undefined) staff.designation = designation;
    if (roleDescription !== undefined) staff.roleDescription = roleDescription;

    if (image) {
      const base64Data = image.split(",")[1];
      if (base64Data) {
        const buffer = Buffer.from(base64Data, "base64");
        if (buffer.length > 200 * 1024) {
          return NextResponse.json(
            { error: "Image size exceeds 200KB limit." },
            { status: 400 },
          );
        }
        staff.image = image;
      }
    }

    await staff.save();

    return NextResponse.json({
      message: "Staff member updated successfully",
      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        designation: staff.designation,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
