// Centre-crops an image to a square JPEG so profile photos stay uniform and
// small enough for the 200 KB staff photo limit.
export async function squareAvatar(file: File, size = 400): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file");

  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();

    const edge = Math.min(img.width, img.height);
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not process the image");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, size, size);
    ctx.drawImage(
      img,
      (img.width - edge) / 2,
      (img.height - edge) / 2,
      edge,
      edge,
      0,
      0,
      size,
      size,
    );

    for (const quality of [0.85, 0.7, 0.55, 0.4]) {
      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      // base64 is ~4/3 of the byte size; stay under the 200 KB server cap
      if ((dataUrl.length * 3) / 4 <= 190 * 1024) return dataUrl;
    }
    throw new Error("Photo is too large even after compression");
  } finally {
    URL.revokeObjectURL(url);
  }
}
