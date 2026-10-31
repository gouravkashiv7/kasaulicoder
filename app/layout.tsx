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
          // biome-ignore lint/suspicious/useGoogleFontDisplay: block avoids flashing icon ligature names as text
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=block"
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
