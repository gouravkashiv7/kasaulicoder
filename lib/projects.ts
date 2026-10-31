// Shape of a project as shown on public pages, plus URL helpers that are
// safe to use from both server and client components.

export interface ShowcaseProject {
  _id: string;
  title: string;
  slug: string;
  outcome: string;
  desc: string;
  tags: string[];
  status: "active" | "past";
  featured: boolean;
  image: string;
  liveUrl?: string;
}

export function projectPath(project: Pick<ShowcaseProject, "slug" | "status">) {
  const section =
    project.status === "active" ? "active-projects" : "recent-projects";
  return `/projects/${section}/${project.slug}`;
}

// Returns a usable external URL, or undefined for empty/placeholder values.
export function cleanUrl(url?: string | null) {
  const trimmed = url?.trim();
  return trimmed && /^https?:\/\//i.test(trimmed) ? trimmed : undefined;
}

export function displayHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
