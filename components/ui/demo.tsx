import UniqueLoading from "@/components/ui/morph-loading";

export default function DemoOne() {
  return (
    <div className="flex items-center justify-center p-12 bg-card rounded-2xl border border-glass-border">
      <UniqueLoading variant="morph" size="lg" />
    </div>
  );
}
