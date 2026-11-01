"use client";

import { useId, useState } from "react";
import { compressImage, MAX_PDF_BYTES, readAsDataUrl } from "./imageCompress";

interface ScreenshotInputProps {
  label: string;
  required?: boolean;
  onChange: (attachmentId: string | null) => void;
}

// Picks a proof (PNG, JPG or PDF), shrinks images in the browser and uploads it
// right away; the parent only needs the resulting attachment id.
const ScreenshotInput = ({
  label,
  required,
  onChange,
}: ScreenshotInputProps) => {
  const inputId = useId();
  const [preview, setPreview] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [state, setState] = useState<"idle" | "uploading" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setState("uploading");
    setError("");
    onChange(null);
    try {
      const isPdf = file.type === "application/pdf";
      if (isPdf && file.size > MAX_PDF_BYTES) {
        throw new Error("PDF is larger than 3 MB");
      }
      const dataUrl = isPdf
        ? await readAsDataUrl(file)
        : await compressImage(file);
      const res = await fetch("/api/director/finance/attachments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setPreview(isPdf ? "" : dataUrl);
      setPdfName(isPdf ? file.name : "");
      setState("done");
      onChange(data.id);
    } catch (e) {
      setPreview("");
      setPdfName("");
      setState("error");
      setError(e instanceof Error ? e.message : "Upload failed");
    }
  };

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={inputId}
        className="text-[10px] font-black uppercase text-foreground/40 ml-1"
      >
        {label}
        {required && " *"}
      </label>
      <input
        id={inputId}
        type="file"
        accept="image/png,image/jpeg,application/pdf"
        onChange={(e) => pick(e.target.files?.[0])}
        className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:font-bold file:text-primary"
      />
      {state === "uploading" && (
        <p className="text-xs text-foreground/50">Uploading…</p>
      )}
      {state === "error" && (
        <p role="alert" className="text-xs font-bold text-rose-500">
          {error}
        </p>
      )}
      {pdfName && (
        <p className="mt-2 text-xs font-bold text-foreground/60">
          PDF attached: {pdfName}
        </p>
      )}
      {preview && (
        // biome-ignore lint/performance/noImgElement: local data URL preview
        <img
          src={preview}
          alt="Selected screenshot preview"
          className="mt-2 max-h-40 rounded-lg border border-foreground/10"
        />
      )}
    </div>
  );
};

export default ScreenshotInput;
