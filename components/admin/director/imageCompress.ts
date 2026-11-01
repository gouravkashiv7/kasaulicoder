const MAX_EDGE = 1600;
const MAX_BYTES = 900 * 1024;

export const readAsDataUrl = (file: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the file"));
    reader.readAsDataURL(file);
  });

// Largest PDF the server accepts; a PDF can't be shrunk in the browser.
export const MAX_PDF_BYTES = 3 * 1024 * 1024;

// Shrinks a screenshot to a JPEG under ~900 KB so it fits the 1 MB upload cap.
export async function compressImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file");
  const img = new Image();
  img.src = await readAsDataUrl(file);
  await img.decode();

  const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process the image");
  // JPEG has no alpha, so flatten transparent PNGs onto white
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  for (const quality of [0.85, 0.7, 0.55, 0.4]) {
    const dataUrl = canvas.toDataURL("image/jpeg", quality);
    // base64 is ~4/3 of the byte size
    if ((dataUrl.length * 3) / 4 <= MAX_BYTES) return dataUrl;
  }
  throw new Error("Image is too large even after compression");
}
