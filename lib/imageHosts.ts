// Remote hosts whose images Next.js may resize and convert. next.config.ts
// allows only these, so the image optimizer can't be used to proxy any URL.
// Images from other hosts (e.g. a URL an admin pastes) still show, just
// unoptimized — pass `unoptimized={!canOptimizeImage(src)}` to <Image>.
export const optimizedImageHosts = [
  "res.cloudinary.com",
  "cdn.prod.website-files.com",
  "lh3.googleusercontent.com",
  "www.gouravkashiv.com",
];

export function canOptimizeImage(src: string | undefined | null): boolean {
  if (!src || !/^https?:\/\//i.test(src)) return true; // local, data: or blob:
  try {
    const url = new URL(src);
    return (
      url.protocol === "https:" && optimizedImageHosts.includes(url.hostname)
    );
  } catch {
    return false;
  }
}
