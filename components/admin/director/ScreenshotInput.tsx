"use client";

import { useId, useState } from "react";
import { compressImage } from "./imageCompress";

interface ScreenshotInputProps {
  label: string;
  required?: boolean;
  onChange: (attachmentId: string | null) => void;
}

// Picks an image, shrinks it in the browser and uploads it right away; the
// parent only needs the resulting attachment id.
const ScreenshotInput = ({
  label,
  required,
  onChange,
}: ScreenshotInputProps) => {
  const inputId = useId();
  const [preview, setPreview] = useState("");
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
      const dataUrl = await compressImage(file);
      const res = await fetch("/api/director/finance/attachments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setPreview(dataUrl);
      setState("done");
      onChange(data.id);
    } catch (e) {
      setPreview("");
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
        accept="image/*"
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
