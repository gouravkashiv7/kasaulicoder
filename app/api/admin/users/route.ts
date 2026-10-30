import { getServerSession } from "@/backend/lib/auth";
import { NextResponse } from "next/server";
import connectDB from "@/backend/lib/db";
import User from "@/backend/models/User";
import {
  sendAccountDeactivationEmail,
  sendAccountActivationEmail,
} from "@/backend/lib/email";


export async function GET() {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "superadmin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    await connectDB();
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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
      return NextResponse.json({ error: "User id required" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Toggle logic: Explicitly check for false, everything else toggles to false.
    const currentStatus = user.isActive === false ? false : true;
    user.isActive = !currentStatus;
    await user.save();

    // Send email notification if requested
    if (sendEmail) {
      try {
        if (user.isActive) {
          await sendAccountActivationEmail(user.email, user.name);
        } else {
          await sendAccountDeactivationEmail(user.email, user.name);
        }
      } catch (emailErr) {
        console.error("Failed to send status toggle email:", emailErr);
        // We don't fail the toggle request if just the email fails
      }
    }

    return NextResponse.json({ isActive: user.isActive });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
