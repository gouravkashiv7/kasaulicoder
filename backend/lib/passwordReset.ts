import { SignJWT } from "jose";
import { getJwtSecret } from "@/backend/lib/auth";

type ResettableAccount = {
  _id: { toString(): string };
  email: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  save(): Promise<unknown>;
};

// Creates a one-hour, one-time reset token, stores it on the account and
// returns the link to email. Returns null when no safe origin is configured.
export async function issuePasswordResetLink(
  account: ResettableAccount,
  accountType: "staff" | "user",
): Promise<string | null> {
  // Never build the link from the Host header: a forged header would
  // send the reset token to an attacker-controlled domain.
  const origin =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.NODE_ENV !== "production" ? "http://localhost:3000" : "");
  if (!origin) {
    console.error("NEXT_PUBLIC_BASE_URL is not set; cannot send reset link");
    return null;
  }

  const token = await new SignJWT({
    id: account._id.toString(),
    email: account.email,
    type: accountType,
    resetPassword: true,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(getJwtSecret());

  // Save token to DB for one-time use validation
  account.resetPasswordToken = token;
  account.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
  await account.save();

  return `${origin}/reset-password?token=${token}`;
}
