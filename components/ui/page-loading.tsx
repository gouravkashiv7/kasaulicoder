import UniqueLoading from "@/components/ui/morph-loading";

interface PageLoadingProps {
  title?: string;
  subtitle?: string;
}

export default function PageLoading({
  title = "Loading",
  subtitle = "Preparing your experience...",
}: PageLoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex flex-col items-center gap-8 relative z-10">
        <UniqueLoading variant="morph" size="lg" />
        <div className="text-center">
          <p className="text-primary font-black text-lg tracking-[0.3em] uppercase animate-pulse">
            {title}
          </p>
          <p className="text-foreground/30 text-xs font-bold mt-2 tracking-widest uppercase">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
