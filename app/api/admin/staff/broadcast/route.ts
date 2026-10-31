import { NextResponse } from "next/server";
import { getServerSession } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import { sendAdminBroadcastEmail } from "@/backend/lib/email";
import { rateLimit } from "@/backend/lib/rateLimit";
import Staff from "@/backend/models/Staff";

const MAX_SUBJECT = 150;
const MAX_MESSAGE = 5000;

async function requireSuperadmin() {
  const session = await getServerSession();
  if (!session) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  if (session.type !== "admin" || session.role !== "superadmin") {
    return {
      error: NextResponse.json({ error: "Access denied" }, { status: 403 }),
    };
  }
  return { session };
}

// Active team members with the "admin" role: who a broadcast reaches.
async function findRecipients() {
  await connectDB();
  return Staff.find({ role: "admin", isActive: true }).select("name email");
}

// How many admins a broadcast would reach.
export async function GET() {
  try {
    const guard = await requireSuperadmin();
    if ("error" in guard) return guard.error;

    const recipients = await findRecipients();
    return NextResponse.json({ count: recipients.length });
  } catch (error) {
    console.error("Broadcast count error:", (error as Error)?.name);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Superadmin emails every active admin.
export async function POST(req: Request) {
  try {
    const guard = await requireSuperadmin();
    if ("error" in guard) return guard.error;
    const { session } = guard;

    if (!rateLimit(req, "staff-broadcast", 10, 3600000)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await req.json();
    const subject =
      typeof body.subject === "string"
        ? body.subject.replace(/[\r\n]+/g, " ").trim()
        : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required" },
        { status: 400 },
      );
    }
    if (subject.length > MAX_SUBJECT || message.length > MAX_MESSAGE) {
      return NextResponse.json(
        {
          error: `Subject is limited to ${MAX_SUBJECT} and message to ${MAX_MESSAGE} characters`,
        },
        { status: 400 },
      );
    }

    const recipients = await findRecipients();
    if (recipients.length === 0) {
      return NextResponse.json(
        { error: "There are no active admins to email" },
        { status: 400 },
      );
    }

    await sendAdminBroadcastEmail({
      toEmails: recipients.map((r) => r.email),
      senderName: session.name,
      senderEmail: session.email,
      subject,
      message,
    });

    return NextResponse.json({
      message: `Email sent to ${recipients.length} admin${recipients.length === 1 ? "" : "s"}`,
      count: recipients.length,
    });
  } catch (error) {
    console.error("Broadcast email error:", (error as Error)?.name);
    return NextResponse.json(
      { error: "Could not send the email" },
      { status: 500 },
    );
  }
}
