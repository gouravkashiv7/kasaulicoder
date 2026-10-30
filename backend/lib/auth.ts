import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import connectDB from "@/backend/lib/db";
import Staff from "@/backend/models/Staff";
import User from "@/backend/models/User";

let cachedSecret: Uint8Array | null = null;

export function getJwtSecret(): Uint8Array {
  if (cachedSecret) return cachedSecret;
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "JWT_SECRET must be set to a random string of at least 32 characters",
    );
  }
  cachedSecret = new TextEncoder().encode(secret);
  return cachedSecret;
}

export type Session = {
  id: string;
  email: string;
  name: string;
  role: string;
  type: "admin" | "user";
};

// Verifies the auth cookie and re-checks the account in the DB, so
// deactivated accounts and role changes take effect immediately.
export async function getServerSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const { payload } = await jwtVerify(token, getJwtSecret());

    // Password-reset tokens are not login sessions
    if (payload.resetPassword || typeof payload.id !== "string") return null;

    const type = payload.type === "admin" ? "admin" : "user";

    await connectDB();
    const account =
      type === "admin"
        ? await Staff.findById(payload.id).select("name email role isActive")
        : await User.findById(payload.id).select("name email role isActive");

    if (!account || account.isActive === false) return null;

    return {
      id: account._id.toString(),
      email: account.email,
      name: account.name,
      role: account.role,
      type,
    };
  } catch {
    return null;
  }
}
