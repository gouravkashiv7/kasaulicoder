import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { linkAttachment } from "@/backend/lib/attachments";
import { requireDirector } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import { getActiveDirectors, isDirectorMohit } from "@/backend/lib/directors";
import { sendFundRequestEmail } from "@/backend/lib/email";
import { formatINR, toPaise } from "@/backend/lib/money";
import { NOT_DELETED } from "@/backend/lib/softDelete";
import Contribution from "@/backend/models/Contribution";
import Staff from "@/backend/models/Staff";

// GET — all contributions, newest first
export async function GET() {
  try {
    const auth = await requireDirector();
    if ("error" in auth) return auth.error;

    await connectDB();
    const [contributions, directors] = await Promise.all([
      Contribution.find({ ...NOT_DELETED })
        .sort({ createdAt: -1 })
        .populate("createdBy", "name email")
        .populate("fundedBy", "name email")
        .populate("approvedBy", "name email")
        .populate("shares.staff", "name email")
        .populate("cancelledBy", "name email")
        .lean(),
      getActiveDirectors(),
    ]);

    return NextResponse.json({
      contributions,
      me: auth.session.id,
      isMohit: isDirectorMohit(auth.session),
      directors,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST — start/generate a fund request: { amount, note, fundedBy?, fundedByName?, attachmentId? }.
// Once created, an email is sent to all 3 directors informing them about the request and note.
// The fund request is pending until approved by Director Mohit.
export async function POST(req: Request) {
  try {
    const auth = await requireDirector();
    if ("error" in auth) return auth.error;

    const body = await req.json();
    const amountPaise = toPaise(
      typeof body.amount === "number" || typeof body.amount === "string"
        ? body.amount
        : "",
    );
    if (amountPaise === null || amountPaise <= 0) {
      return NextResponse.json(
        { error: "Enter a valid positive amount in rupees (up to 2 decimals)" },
        { status: 400 },
      );
    }

    const note = typeof body.note === "string" ? body.note.trim() : "";
    if (!note) {
      return NextResponse.json(
        { error: "A note/reason for adding funds is required" },
        { status: 400 },
      );
    }

    await connectDB();
    const directors = await getActiveDirectors();

    let fundedByStaffId: string | null = null;
    let displayFundedByName = auth.session.name;

    if (body.fundedBy && mongoose.isValidObjectId(body.fundedBy)) {
      const funderStaff = await Staff.findById(body.fundedBy).select("name");
      if (funderStaff) {
        fundedByStaffId = funderStaff._id.toString();
        displayFundedByName = funderStaff.name;
      }
    } else if (body.fundedByName && typeof body.fundedByName === "string") {
      displayFundedByName = body.fundedByName.trim();
    } else {
      fundedByStaffId = auth.session.id;
    }

    const contributionId = new mongoose.Types.ObjectId();

    if (body.attachmentId && typeof body.attachmentId === "string") {
      const linked = await linkAttachment(
        body.attachmentId,
        auth.session.id,
        "contribution",
        contributionId.toString(),
      );
      if ("error" in linked) {
        return NextResponse.json(
          { error: linked.error },
          { status: linked.status },
        );
      }
    }

    const contribution = await Contribution.create({
      _id: contributionId,
      totalPaise: amountPaise,
      note: note.slice(0, 500),
      createdBy: auth.session.id,
      fundedBy: fundedByStaffId,
      fundedByName: displayFundedByName,
      proof: body.attachmentId || undefined,
      status: "pending",
    });

    // Notify all active directors (all 3) via email
    try {
      const recipientEmails = directors
        .map((d) => d.email?.trim())
        .filter((e): e is string => Boolean(e));

      if (recipientEmails.length > 0) {
        await sendFundRequestEmail({
          toEmails: recipientEmails,
          requestedByName: auth.session.name,
          fundedByName: displayFundedByName,
          amountFormatted: formatINR(amountPaise),
          note,
        });
      }
    } catch (emailErr) {
      console.error(
        "Failed to send fund request email to directors:",
        emailErr,
      );
    }

    return NextResponse.json(
      { id: contribution._id, status: "pending" },
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
