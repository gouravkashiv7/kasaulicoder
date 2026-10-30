import type { Metadata } from "next";
import { JetBrains_Mono, Outfit, Plus_Jakarta_Sans } from "next/font/google"; // Updated fonts
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "KasauliCoder | SaaS Solutions that Drive Growth",
    template: "%s | KasauliCoder",
  },
  description:
    "KasauliCoder designs and develops SaaS products, web applications and business automation, with SEO, UI/UX, cloud infrastructure and ongoing technical support.",
  keywords: [
    "KasauliCoder",
    "SaaS Development",
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
      "SaaS product development, web applications, business automation, SEO, UI/UX and cloud infrastructure for businesses.",
    images: [
      {
        url: "/logowithbg.png",
        width: 1200,
        height: 630,
        alt: "KasauliCoder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KasauliCoder | SaaS Solutions that Drive Growth",
    description:
      "SaaS product development, web applications, business automation, SEO, UI/UX and cloud infrastructure for businesses.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-pt-22.5 scroll-smooth">
      <head>
        <link
          rel="stylesheet"
          // biome-ignore lint/suspicious/useGoogleFontDisplay: block avoids flashing icon ligature names as text
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${outfit.variable} ${jetBrainsMono.variable} antialiased bg-background-dark text-slate-100`}
      >
        {children}
      </body>
    </html>
  );
}
