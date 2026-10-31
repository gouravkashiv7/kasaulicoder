import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import connectDB from "@/backend/lib/db";
import Staff from "@/backend/models/Staff";
import User from "@/backend/models/User";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await connectDB();

  const results: Record<string, string> = {};

  // ── 1. Test Student ──────────────────────────────────────────────
  try {
    const existing = await User.findOne({ email: "student@kasaulicoder.com" });
    if (existing) {
      results.student = "Already exists";
    } else {
      const hashed = await bcrypt.hash("student@kasaulicoder", 12);
      await User.create({
        name: "Test Student",
        email: "student@kasaulicoder.com",
        password: hashed,
        userType: "student",
        emailVerified: true,
      });
      results.student = "Created";
    }
  } catch (e) {
    results.student = `Error: ${e instanceof Error ? e.message : String(e)}`;
  }

  // ── 2. Test Professional ─────────────────────────────────────────
  try {
    const existing = await User.findOne({
      email: "professional@kasaulicoder.com",
    });
    if (existing) {
      results.professional = "Already exists";
    } else {
      const hashed = await bcrypt.hash("professional@kasaulicoder", 12);
      await User.create({
        name: "Test Professional",
        email: "professional@kasaulicoder.com",
        password: hashed,
        userType: "professional",
        emailVerified: true,
      });
      results.professional = "Created";
    }
  } catch (e) {
    results.professional = `Error: ${e instanceof Error ? e.message : String(e)}`;
  }

  // ── 3. SuperAdmin (Staff) ────────────────────────────────────────
  try {
    const existing = await Staff.findOne({ role: "superadmin" });
    if (existing) {
      results.admin = "Already exists";
    } else {
      const hashed = await bcrypt.hash("admin@kasaulicoder", 12);
      await Staff.create({
        name: "Super Admin",
        email: "admin@kasaulicoder.com",
        password: hashed,
        role: "superadmin",
        designation: "Founder & Superadmin",
        isActive: true,
      });
      results.admin = "Created";
    }
  } catch (e) {
    results.admin = `Error: ${e instanceof Error ? e.message : String(e)}`;
  }

  return NextResponse.json({ message: "Seed complete", results });
}
