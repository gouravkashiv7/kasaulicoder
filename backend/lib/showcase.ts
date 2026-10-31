import connectDB from "@/backend/lib/db";
import Project from "@/backend/models/Project";
import { cleanUrl, type ShowcaseProject } from "@/lib/projects";

interface RawProject {
  _id: unknown;
  title: string;
  slug: string;
  outcome?: string;
  desc?: string;
  tags?: string[];
  status: "active" | "past";
  featured?: boolean;
  liveUrl?: string;
  media?: { type: string; url: string }[];
}

// Public pages only show projects that have at least one real screenshot,
// so a project without one never appears as an empty placeholder card.
export async function getShowcaseProjects(
  options: { status?: "active" | "past"; limit?: number } = {},
): Promise<ShowcaseProject[]> {
  await connectDB();
  const filter: Record<string, unknown> = { "media.type": "image" };
  if (options.status) filter.status = options.status;

  let query = Project.find(filter)
    .select("title slug outcome desc tags status featured liveUrl media")
    .sort({ featured: -1, createdAt: -1 });
  if (options.limit) query = query.limit(options.limit);

  const raw = (await query.lean()) as unknown as RawProject[];

  return raw.map((p) => ({
    _id: String(p._id),
    title: p.title,
    slug: p.slug,
    outcome: p.outcome ?? "",
    desc: p.desc ?? "",
    tags: p.tags ?? [],
    status: p.status,
    featured: Boolean(p.featured),
    image: p.media?.find((m) => m.type === "image")?.url ?? "",
    liveUrl: cleanUrl(p.liveUrl),
  }));
}

// Same as getShowcaseProjects, but logs and returns an empty list on database
// errors so marketing pages still render without project data.
export async function getShowcaseProjectsSafe(
  options: { status?: "active" | "past"; limit?: number } = {},
) {
  try {
    return await getShowcaseProjects(options);
  } catch (error) {
    console.error("Failed to load showcase projects", error);
    return [];
  }
}

export interface ProjectDetailData {
  _id: string;
  title: string;
  slug: string;
  outcome: string;
  desc: string;
  content?: string;
  tags: string[];
  status: "active" | "past";
  media: { type: "image" | "video"; url: string }[];
  liveUrl?: string;
  githubUrl?: string;
  videoUrl?: string;
  members: {
    _id: string;
    name: string;
    image?: string;
    designation?: string;
  }[];
}

// One project with its team members, for the project detail pages.
export async function getProjectDetail(
  slug: string,
  status: "active" | "past",
): Promise<ProjectDetailData | null> {
  await connectDB();
  await import("@/backend/models/Staff"); // register schema for populate
  const raw = await Project.findOne({ slug, status })
    .populate("members", "name image designation")
    .lean();
  if (!raw) return null;
  const project = JSON.parse(JSON.stringify(raw));
  return {
    ...project,
    tags: project.tags ?? [],
    media: project.media ?? [],
    members: project.members ?? [],
    liveUrl: cleanUrl(project.liveUrl),
    githubUrl: cleanUrl(project.githubUrl),
    videoUrl: cleanUrl(project.videoUrl),
  };
}
