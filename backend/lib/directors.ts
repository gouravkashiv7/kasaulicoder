import Staff from "@/backend/models/Staff";

export interface DirectorSummary {
  id: string;
  name: string;
  email: string;
}

// Active board directors, oldest account first so ordering is stable.
// Profile photos are deliberately not selected: they are base64 blobs of up
// to 200KB each and this runs on almost every directors-area request.
export async function getActiveDirectors(): Promise<DirectorSummary[]> {
  const rows = await Staff.find({ isDirector: true, isActive: true })
    .select("name email")
    .sort({ createdAt: 1 })
    .lean();
  return rows.map((d) => ({
    id: String(d._id),
    name: d.name,
    email: d.email,
  }));
}

// Check if a staff/user/session represents Director Mohit (Mohit Thakur).
// Matched on email only: emails are unique across staff, while anyone can
// edit their own display name.
export function isDirectorMohit(
  user: { email?: string } | null | undefined,
): boolean {
  if (!user) return false;
  return (user.email || "").toLowerCase().trim() === "mt4488857@gmail.com";
}
