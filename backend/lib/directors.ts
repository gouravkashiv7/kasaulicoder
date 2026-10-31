import Staff from "@/backend/models/Staff";

export interface DirectorSummary {
  id: string;
  name: string;
  email: string;
  image?: string;
}

// Active board directors, oldest account first so ordering is stable.
export async function getActiveDirectors(): Promise<DirectorSummary[]> {
  const rows = await Staff.find({ isDirector: true, isActive: true })
    .select("name email image")
    .sort({ createdAt: 1 })
    .lean();
  return rows.map((d) => ({
    id: String(d._id),
    name: d.name,
    email: d.email,
    image: d.image,
  }));
}
