import Link from "next/link";
import UniqueLoading from "@/components/ui/morph-loading";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 text-center bg-zinc-950 text-zinc-100">
      <div className="mb-10">
        <UniqueLoading variant="morph" size="lg" className="mx-auto" />
      </div>

      <div className="space-y-4">
        <h1 className="text-8xl font-black tracking-tight text-white mb-2">
          404
        </h1>

        <h2 className="text-3xl md:text-4xl font-bold text-zinc-200">
          Lost in the Digital Wilderness?
        </h2>

        <p className="text-zinc-400 max-w-lg mx-auto text-lg leading-relaxed mb-10">
          The page you're searching for has either moved to a new dimension or
          vanished into the digital void. Don't worry, even the best coders take
          a wrong turn sometimes.
        </p>

        <div className="flex justify-center">
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-10 py-7 text-xl rounded-full border-none transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/20">
              <Home className="w-6 h-6" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-20 text-xs text-zinc-600 font-mono">
        <p>[ error_code: PAGE_NOT_FOUND_EXCEPTION ]</p>
      </div>
    </div>
  );
}
