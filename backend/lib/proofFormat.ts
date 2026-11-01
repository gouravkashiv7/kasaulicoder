// Pure helpers (no imports) so node:test can load them directly.

export type ProofMime = "image/png" | "image/jpeg" | "application/pdf";

const MB = 1024 * 1024;
const MAX_IMAGE_BYTES = MB;
const MAX_PDF_BYTES = 3 * MB;
const DATA_URL =
  /^data:(image\/png|image\/jpeg|application\/pdf);base64,([A-Za-z0-9+/]+=*)$/;

// Checks the file's leading bytes so a spoofed type can't slip through.
function matchesMime(buf: Buffer, mime: ProofMime): boolean {
  if (mime === "image/jpeg") return buf[0] === 0xff && buf[1] === 0xd8;
  if (mime === "image/png") {
    return buf.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
  }
  return buf.subarray(0, 5).toString("ascii") === "%PDF-";
}

// Proofs of payment: PNG, JPG or PDF, as a base64 data URL.
export function parseProofDataUrl(
  dataUrl: unknown,
): { data: Buffer; mime: ProofMime } | { error: string } {
  if (typeof dataUrl !== "string") return { error: "A proof file is required" };
  const match = DATA_URL.exec(dataUrl);
  if (!match) return { error: "Only PNG, JPG or PDF files are allowed" };
  const mime = match[1] as ProofMime;
  const data = Buffer.from(match[2], "base64");
  if (
    mime === "application/pdf"
      ? data.length > MAX_PDF_BYTES
      : data.length > MAX_IMAGE_BYTES
  ) {
    return {
      error:
        mime === "application/pdf"
          ? "PDF is larger than 3 MB"
          : "Image is larger than 1 MB",
    };
  }
  if (!matchesMime(data, mime)) {
    return { error: "File content does not match its type" };
  }
  return { data, mime };
}

const LABEL = "[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";
const DOMAIN = new RegExp(`^(?:${LABEL}\\.)+[a-z]{2,}$`);

// Lower-cased host from whatever was typed or pasted ("HTTPS://WWW.X.com/a"),
// or null when it isn't a domain name.
export function domainName(input: string): string | null {
  const host = input
    .trim()
    .toLowerCase()
    .replace(/^[a-z]+:\/\//, "")
    .split(/[/?#]/)[0]
    .replace(/:\d+$/, "");
  return DOMAIN.test(host) ? host : null;
}
