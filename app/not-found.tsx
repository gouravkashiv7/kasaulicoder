import Link from "next/link";
import GlobalFooter from "@/components/layout/GlobalFooter";
import GlobalHeader from "@/components/layout/GlobalHeader";
import { primaryButton, secondaryButton } from "@/components/ui/marketing";
import UniqueLoading from "@/components/ui/morph-loading";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans overflow-x-hidden">
      <GlobalHeader />
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-36 pb-24 text-center">
        <div className="mb-10">
          <UniqueLoading variant="morph" size="lg" className="mx-auto" />
        </div>
        <p className="font-display text-lg font-semibold text-primary mb-4">
          Error 404
        </p>
        <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight mb-6">
          Page not found
        </h1>
        <p className="text-lg text-foreground/70 max-w-lg leading-relaxed mb-10">
          The page you are looking for does not exist or has moved. Use the
          links below to find what you need.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-sm sm:max-w-none justify-center">
          <Link href="/" className={primaryButton}>
            Go to the homepage
          </Link>
          <Link href="/services" className={secondaryButton}>
            Explore Our Services
          </Link>
        </div>
      </main>
      <GlobalFooter />
    </div>
  );
}
