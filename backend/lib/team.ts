import connectDB from "@/backend/lib/db";
import { staffImageUrl } from "@/backend/lib/staffImage";
import Staff from "@/backend/models/Staff";

export interface PublicTeamMember {
  _id: string;
  name: string;
  designation?: string;
  roleDescription?: string;
  image?: string;
  role: string;
}

// Active admins and superadmins with a photo, superadmins first. Photos are
// returned as cacheable URLs, not the base64 stored in the database.
export async function getPublicTeam(): Promise<PublicTeamMember[]> {
  await connectDB();
  const members = await Staff.find({
    isActive: true,
    role: { $in: ["admin", "superadmin"] },
    image: { $exists: true, $ne: null },
  })
    .select("name designation roleDescription image role")
    .sort({ role: -1 })
    .lean();

  return members.map((m) => ({
    _id: String(m._id),
    name: m.name,
    designation: m.designation,
    roleDescription: m.roleDescription,
    image: staffImageUrl(m._id, m.image),
    role: m.role,
  }));
}

// Same as getPublicTeam, but logs and returns an empty list on database
// errors so marketing pages still render without the team section.
export async function getPublicTeamSafe() {
  try {
    return await getPublicTeam();
  } catch (error) {
    console.error("Failed to load team", error);
    return [];
  }
}
