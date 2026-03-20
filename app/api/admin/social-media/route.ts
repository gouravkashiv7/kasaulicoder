import { NextResponse } from "next/server";
import connectDB from "@/backend/lib/db";
import SocialMedia from "@/backend/models/SocialMedia";
import Staff from "@/backend/models/Staff";

export async function GET() {
  try {
    await connectDB();
    const accounts = await SocialMedia.find().populate("managedBy", "name email image");
    return NextResponse.json(accounts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch social media accounts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newAccount = await SocialMedia.create(body);
    return NextResponse.json(newAccount);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create social media account" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, ...updateData } = body;
    const updatedAccount = await SocialMedia.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(updatedAccount);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update social media account" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await SocialMedia.findByIdAndDelete(id);
    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete social media account" }, { status: 500 });
  }
}
