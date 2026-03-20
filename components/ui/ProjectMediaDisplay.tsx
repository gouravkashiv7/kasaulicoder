"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface MediaItem {
  type: "image" | "video";
  url: string;
}

interface ProjectMediaDisplayProps {
  media: MediaItem[];
  liveUrl?: string;
  title: string;
  className?: string;
  aspectRatio?: string;
}

export const ProjectMediaDisplay: React.FC<ProjectMediaDisplayProps> = ({
  media = [],
  liveUrl,
  title,
  className = "",
  aspectRatio = "aspect-video",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"media" | "iframe">(
    media.length > 0 ? "media" : "iframe"
  );

  // Helper to get embed URL for YouTube/Vimeo
  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const id = url.includes("v=")
        ? url.split("v=")[1].split("&")[0]
        : url.split("/").pop();
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("vimeo.com")) {
      const id = url.split("/").pop();
      return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  // Render Iframe Preview
  const renderIframe = () => (
    <div className={`relative group overflow-hidden bg-foreground/5 border border-foreground/10 rounded-2xl ${aspectRatio} ${className}`}>
      <div className="absolute top-0 left-0 right-0 h-8 bg-background/80 backdrop-blur-md border-b border-white/10 z-10 px-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <span className="size-2 rounded-full bg-rose-500" />
          <span className="size-2 rounded-full bg-amber-500" />
          <span className="size-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-bold text-foreground/40 ml-2 truncate uppercase tracking-widest">
            Live Preview: {liveUrl?.replace(/^https?:\/\//, "")}
          </span>
        </div>
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-black uppercase tracking-tighter text-primary hover:underline flex items-center gap-1"
        >
          Visit <span className="material-symbols-outlined text-[12px]">open_in_new</span>
        </a>
      </div>
      <div className="w-full h-full pt-8">
        <iframe
          src={liveUrl}
          className="w-full h-full border-0"
          title={`${title} Website Preview`}
        />
        {/* Overlay to detect blocked iframes or just handle interaction */}
        <div className="absolute inset-0 pt-8 pointer-events-none group-hover:bg-primary/5 transition-colors" />
      </div>
      
      {/* Fallback Message for iframe blocking */}
      <div className="absolute inset-x-4 bottom-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-background/90 backdrop-blur-md border border-white/10 p-3 rounded-xl text-[10px] font-bold text-center">
            Previewing via Iframe. Some sites may block this view. 
            <a href={liveUrl} target="_blank" className="text-primary hover:underline ml-1">Open in new tab →</a>
        </div>
      </div>
    </div>
  );

  // Render Media Carousel
  const renderMedia = () => {
    const currentMedia = media[currentIndex];
    return (
      <div className={`relative group overflow-hidden bg-foreground/5 border border-foreground/10 rounded-2xl ${aspectRatio} ${className}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full h-full"
          >
            {currentMedia.type === "image" ? (
              <Image
                src={currentMedia.url}
                alt={`${title} - Media ${currentIndex + 1}`}
                fill
                className="object-cover"
              />
            ) : (
              <iframe
                src={getEmbedUrl(currentMedia.url)}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </motion.div>
        </AnimatePresence>

        {media.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 size-10 rounded-full bg-background/50 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-white/20"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 size-10 rounded-full bg-background/50 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-white/20"
            >
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {media.map((_, i) => (
                <div
                  key={i}
                  className={`size-1.5 rounded-full transition-all ${
                    i === currentIndex ? "bg-primary w-4" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const hasMedia = media.length > 0;
  const hasLiveUrl = liveUrl && liveUrl !== "#";

  return (
    <div className="relative w-full h-full flex flex-col gap-4">
      {/* Toggle Controls */}
      {hasMedia && hasLiveUrl && (
        <div className="flex justify-center md:justify-end gap-2 mb-2">
          <button
            onClick={() => setViewMode("media")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${
              viewMode === "media"
                ? "bg-primary text-background"
                : "bg-white/5 border border-white/10 text-foreground/60 hover:text-foreground"
            }`}
          >
            <span className="material-symbols-outlined text-sm">photo_library</span>
            Gallery
          </button>
          <button
            onClick={() => setViewMode("iframe")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${
              viewMode === "iframe"
                ? "bg-primary text-background"
                : "bg-white/5 border border-white/10 text-foreground/60 hover:text-foreground"
            }`}
          >
            <span className="material-symbols-outlined text-sm">language</span>
            Live Preview
          </button>
        </div>
      )}

      {/* Main Display Area */}
      {viewMode === "media" && hasMedia ? (
        renderMedia()
      ) : viewMode === "iframe" && hasLiveUrl ? (
        renderIframe()
      ) : (
        <div className={`flex flex-col items-center justify-center bg-foreground/5 border border-foreground/10 rounded-2xl ${aspectRatio} ${className}`}>
          <span className="material-symbols-outlined text-4xl text-foreground/20 mb-2">
            website
          </span>
          <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest">
            No Preview Available
          </span>
        </div>
      )}
    </div>
  );
};

