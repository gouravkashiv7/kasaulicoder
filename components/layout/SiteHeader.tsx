"use client";

import { usePathname } from "next/navigation";
import GlobalHeader from "@/components/layout/GlobalHeader";

// Dashboards have their own navigation, so the site header is hidden there.
const HIDDEN_PREFIXES = ["/admin", "/member", "/user", "/dashboard"];

// Rendered once in the root layout so the header stays mounted across page
// navigations instead of remounting (and re-running its effects) on each one.
export default function SiteHeader() {
  const pathname = usePathname();
  if (
    HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  ) {
    return null;
  }
  return <GlobalHeader />;
}
