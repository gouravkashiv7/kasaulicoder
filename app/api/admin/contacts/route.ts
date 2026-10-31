import { NextResponse } from "next/server";
import { getServerSession } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import { sendContactRejectionEmail } from "@/backend/lib/email";
import ContactRequest from "@/backend/models/ContactRequest";

// GET all contact requests (superadmin only)
export async function GET() {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "superadmin") {
      return NextResponse.json(
        { error: "Access denied. Superadmin only." },
        { status: 403 },
      );
    }

    await connectDB();

    const requests = await ContactRequest.find({}).sort({ createdAt: -1 });

    return NextResponse.json(requests);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PATCH — mark a contact request as read, or reject it (superadmin only)
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "superadmin") {
      return NextResponse.json(
        { error: "Access denied. Superadmin only." },
        { status: 403 },
      );
    }

    const { id, action, reason, sendEmail } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Request ID is required" },
        { status: 400 },
      );
    }

    await connectDB();

    if (action === "reject") {
      const trimmedReason = typeof reason === "string" ? reason.trim() : "";
      if (!trimmedReason) {
        return NextResponse.json(
          { error: "A rejection reason is required" },
          { status: 400 },
        );
      }
      if (trimmedReason.length > 1000) {
        return NextResponse.json(
          { error: "Rejection reason must be 1000 characters or fewer" },
          { status: 400 },
        );
      }

      const existing = await ContactRequest.findById(id);
      if (!existing) {
        return NextResponse.json(
          { error: "Request not found" },
          { status: 404 },
        );
      }
      if (existing.status === "rejected") {
        return NextResponse.json(
          { error: "Request is already rejected" },
          { status: 409 },
        );
      }

      let emailSent = false;
      let emailError: string | undefined;
      if (sendEmail === true) {
        try {
          await sendContactRejectionEmail(
            existing.email,
            existing.name,
            trimmedReason,
          );
          emailSent = true;
        } catch (err) {
          console.error("Failed to send rejection email:", err);
          emailError = "Request rejected, but the email could not be sent.";
        }
      }

      existing.status = "rejected";
      existing.isRead = true;
      existing.rejectionReason = trimmedReason;
      existing.rejectedAt = new Date();
      existing.rejectionEmailSent = emailSent;
      await existing.save();

      return NextResponse.json({
        message: "Request rejected",
        data: existing,
        emailSent,
        emailError,
      });
    }

    const updated = await ContactRequest.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true },
    );

    if (!updated) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Marked as read", data: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
