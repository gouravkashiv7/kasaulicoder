import { v2 as cloudinary } from "cloudinary";

// Proof files live in Cloudinary as private (`authenticated`) assets: they have
// no public URL and are only ever read back by our own director-only route.
// The app never deletes them.

export function cloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

function getCloudinary() {
  if (!cloudinaryConfigured()) throw new Error("Cloudinary is not configured");
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return cloudinary;
}

export const PROOF_FOLDER = "kasaulicoder/proofs";

// PNG, JPG and PDF are all stored as `image` assets, which Cloudinary accepts
// for PDFs too.
export async function putProof(
  data: Buffer,
  key: string,
  folder = PROOF_FOLDER,
): Promise<{ publicId: string; version: number; format: string }> {
  const c = getCloudinary();
  return new Promise((resolve, reject) => {
    c.uploader
      .upload_stream(
        {
          folder,
          public_id: key,
          type: "authenticated",
          resource_type: "image",
          overwrite: false,
        },
        (err, res) => {
          if (err || !res) return reject(err ?? new Error("Upload failed"));
          resolve({
            publicId: res.public_id,
            version: res.version,
            format: res.format,
          });
        },
      )
      .end(data);
  });
}

// Fetches a stored proof server-side through a short-lived signed download URL.
export async function getProof(
  publicId: string,
  format: string,
): Promise<Buffer> {
  const c = getCloudinary();
  const url = c.utils.private_download_url(publicId, format, {
    resource_type: "image",
    type: "authenticated",
    expires_at: Math.floor(Date.now() / 1000) + 300,
  });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Cloudinary returned ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}
