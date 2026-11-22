import type { Metadata } from "next";
import { JetBrains_Mono, Outfit, Plus_Jakarta_Sans } from "next/font/google"; // Updated fonts
import Script from "next/script";
import "./globals.css";
import MotionProvider from "@/components/ui/motion-provider";
import { serviceGroups } from "@/lib/services";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const baseUrl = "https://kasaulicoder.com";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "KasauliCoder",
  url: baseUrl,
  logo: `${baseUrl}/logo.png`,
  slogan: "SaaS Solutions that Drive Growth",
  description:
    "KasauliCoder is a SaaS and software product development company building SaaS products, custom software and web applications, with business automation, SEO, cloud infrastructure and technical support.",
  knowsAbout: serviceGroups.flatMap((group) => group.includes),
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "KasauliCoder | SaaS Solutions that Drive Growth",
    template: "%s | KasauliCoder",
  },
  description:
    "KasauliCoder is a SaaS and software product development company. We build SaaS products, custom software and web applications, with business automation, SEO, UI/UX, cloud infrastructure and technical support.",
  keywords: [
    "KasauliCoder",
    "SaaS Product Development",
    "Software Product Development",
    "Custom Software Development",
    "Web Application Development",
    "Business Automation",
    "SEO Services",
    "UI/UX Design",
    "Cloud Infrastructure",
  ],
  authors: [{ name: "KasauliCoder" }],
  creator: "KasauliCoder",
  publisher: "KasauliCoder",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "KasauliCoder",
    title: "KasauliCoder | SaaS Solutions that Drive Growth",
    description:
      "SaaS and software product development: SaaS products, custom software, business automation, SEO, UI/UX and cloud infrastructure for businesses.",
    images: [
      {
        url: "/logowithbg.png",
        width: 1024,
        height: 819,
        alt: "KasauliCoder logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KasauliCoder | SaaS Solutions that Drive Growth",
    description:
      "SaaS and software product development: SaaS products, custom software, business automation, SEO, UI/UX and cloud infrastructure for businesses.",
    creator: "@kasaulicoder",
    images: ["/logowithbg.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logowithbg.png",
  },
  alternates: {
    canonical: "./",
  },
  manifest: "/manifest.json",
};

// Light is the site default; a theme picked in ThemeSwitcher wins. Runs before
// first paint so loading screens and SSR output never flash the wrong theme.
// Material Symbols is subset to the icons the site uses (~12 KB instead of
// ~295 KB). When you use a new icon name, add it here — Google requires the
// list in alphabetical order, or the icon renders as its name in plain text.
const iconNames = [
  "account_balance",
  "account_tree",
  "add",
  "add_a_photo",
  "add_circle",
  "add_photo_alternate",
  "analytics",
  "arrow_back",
  "arrow_downward",
  "arrow_forward",
  "arrow_upward",
  "article",
  "auto_awesome",
  "auto_stories",
  "badge",
  "block",
  "bolt",
  "build",
  "calendar_month",
  "calendar_today",
  "cancel",
  "check",
  "check_circle",
  "chevron_left",
  "circle",
  "class",
  "close",
  "cloud_done",
  "code",
  "content_copy",
  "dashboard",
  "delete",
  "delete_forever",
  "deployed_code",
  "description",
  "design_services",
  "desktop_windows",
  "domain",
  "done",
  "done_all",
  "download",
  "edit",
  "edit_document",
  "edit_note",
  "edit_square",
  "email",
  "engineering",
  "error",
  "event",
  "event_upcoming",
  "expand_more",
  "finance",
  "flag",
  "flip",
  "forum",
  "gavel",
  "grid_view",
  "group",
  "group_add",
  "groups",
  "hardware",
  "help_center",
  "home",
  "hourglass_empty",
  "hourglass_top",
  "hub",
  "iframe",
  "image",
  "inbox",
  "info",
  "inventory_2",
  "language",
  "leaderboard",
  "library_books",
  "link",
  "list",
  "lock",
  "lock_reset",
  "login",
  "logout",
  "loop",
  "mail",
  "menu",
  "menu_book",
  "message",
  "mobile",
  "move",
  "movie",
  "notifications_active",
  "open_in_new",
  "overview",
  "password",
  "pause",
  "payment",
  "payments",
  "pending",
  "percent",
  "person",
  "person_check",
  "person_edit",
  "person_off",
  "phone",
  "photo_camera",
  "photo_library",
  "play_arrow",
  "play_circle",
  "policy",
  "power_off",
  "priority",
  "public",
  "radio_button_checked",
  "refresh",
  "remove",
  "remove_red_eye",
  "resize",
  "resume",
  "rocket_launch",
  "save",
  "schedule",
  "school",
  "search",
  "search_off",
  "send",
  "settings",
  "share",
  "shield",
  "shield_person",
  "short_text",
  "smart_display",
  "smartphone",
  "star",
  "start",
  "storage",
  "support",
  "support_agent",
  "switch",
  "sync",
  "tab",
  "terminal",
  "timeline",
  "title",
  "today",
  "toggle_off",
  "toggle_on",
  "token",
  "transform",
  "travel_explore",
  "trending_up",
  "trophy",
  "update",
  "upload",
  "videocam",
  "view_list",
  "visibility",
  "visibility_off",
  "volume_off",
  "volume_up",
  "warning",
  "web_asset",
  "work",
];
const iconFontUrl = `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&icon_names=${iconNames.join(",")}&display=block`;

const themeInitScript = `try{var t=localStorage.getItem("app-theme")||"theme-light";var c=document.documentElement.classList;c.remove("theme-light","theme-brand","theme-dark-violet");c.add(t)}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="theme-light scroll-pt-22.5 scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <link
          rel="stylesheet"
          // display=block avoids flashing icon ligature names as text
          href={iconFontUrl}
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${outfit.variable} ${jetBrainsMono.variable} antialiased bg-background-dark text-slate-100`}
      >
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD built from constants
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
