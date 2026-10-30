const ALLOWED = [
  "title",
  "slug",
  "outcome",
  "desc",
  "media",
  "tags",
  "content",
  "githubUrl",
  "liveUrl",
  "videoUrl",
  "status",
  "featured",
  "members",
] as const;

// Whitelist client-supplied project fields to prevent mass assignment.
export function pickProjectFields(body: unknown): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (!body || typeof body !== "object") return out;
  for (const key of ALLOWED) {
    if (key in (body as object)) out[key] = (body as any)[key];
  }
  return out;
}
