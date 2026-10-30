// In-memory fixed-window limiter. Per-instance only; use a shared store
// (Redis/Upstash) if the app runs on multiple instances or serverless.
const hits = new Map<string, { count: number; resetAt: number }>();

export function clientIp(req: Request): string {
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",").pop()?.trim() ||
    "unknown"
  );
}

export function rateLimit(
  req: Request,
  name: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  if (hits.size > 10000) {
    for (const [k, v] of hits) if (v.resetAt < now) hits.delete(k);
  }
  const key = `${name}:${clientIp(req)}`;
  const entry = hits.get(key);
  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  entry.count++;
  return entry.count <= limit;
}
