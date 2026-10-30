import { NextResponse } from "next/server";
import { getServerSession } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import { sendSocialMediaAssignmentEmail } from "@/backend/lib/email";
import SocialMedia from "@/backend/models/SocialMedia";
import Staff from "@/backend/models/Staff";

const ALLOWED = [
  "platform",
  "username",
  "password",
  "managedBy",
  "platformUrl",
  "isActive",
] as const;

function pickFields(body: any) {
  const out: Record<string, unknown> = {};
  for (const key of ALLOWED) {
    if (body && key in body) out[key] = body[key];
  }
  return out;
}

// Social media credentials are visible to active staff only
async function requireStaff() {
  const session = await getServerSession();
  if (!session || session.type !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const denied = await requireStaff();
  if (denied) return denied;

  try {
    await connectDB();
    const accounts = await SocialMedia.find().populate(
      "managedBy",
      "name email image",
    );
    return NextResponse.json(accounts);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch social media accounts" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const denied = await requireStaff();
  if (denied) return denied;

  try {
    await connectDB();
    const body = pickFields(await req.json());
    const newAccount = await SocialMedia.create(body);

    // Fetch staff details to send email
    try {
      const staff = await Staff.findById(body.managedBy);
      if (staff) {
        await sendSocialMediaAssignmentEmail({
          toEmail: staff.email,
          toName: staff.name,
          platform: newAccount.platform,
          username: newAccount.username,
          password: newAccount.password,
        });
      }
    } catch (emailError) {
      console.error("Failed to send assignment email:", emailError);
      // We don't want to fail the whole request if email fails
    }

    return NextResponse.json(newAccount);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create social media account" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  const denied = await requireStaff();
  if (denied) return denied;

  try {
    await connectDB();
    const body = await req.json();
    const id = body?.id;
    const updateData = pickFields(body);

    if (!id) {
      return NextResponse.json(
        { error: "Account id required" },
        { status: 400 },
      );
    }

    const oldAccount = await SocialMedia.findById(id);
    const updatedAccount = await SocialMedia.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    // If managed member changed, send mail to new member
    if (
      oldAccount &&
      updatedAccount &&
      updateData.managedBy &&
      String(oldAccount.managedBy) !== String(updateData.managedBy)
    ) {
      try {
        const staff = await Staff.findById(updateData.managedBy);
        if (staff) {
          await sendSocialMediaAssignmentEmail({
            toEmail: staff.email,
            toName: staff.name,
            platform: updatedAccount.platform,
            username: updatedAccount.username,
            password: updatedAccount.password,
          });
        }
      } catch (emailError) {
        console.error("Failed to send update assignment email:", emailError);
      }
    }

    return NextResponse.json(updatedAccount);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update social media account" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  const denied = await requireStaff();
  if (denied) return denied;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await SocialMedia.findByIdAndDelete(id);
    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete social media account" },
      { status: 500 },
    );
  }
}
