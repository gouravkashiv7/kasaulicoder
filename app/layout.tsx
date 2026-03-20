import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google"; // Updated fonts
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
    default: "Kasauli Coder | Building the Future of Tech from the Hills",
    template: "%s | Kasauli Coder",
  },
  description:
    "Kasauli Coder is a premier community for developers, offering world-class programs, hands-on projects, and tech blogs to accelerate your development journey.",
  keywords: [
    "Kasauli Coder",
    "Programming",
    "Web Development",
    "Tech Community",
    "Software Engineering",
    "Learning Path",
    "Tech Programs",
  ],
  authors: [{ name: "Kasauli Coder Team" }],
  creator: "Kasauli Coder",
  publisher: "Kasauli Coder",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Kasauli Coder",
    title: "Kasauli Coder | Accelerating Your Tech Journey",
    description:
      "Join the community of passionate developers building future-ready tech from Kasauli. Explore programs, projects, and career blogs.",
    images: [
      {
        url: "/logowithbg.png",
        width: 1200,
        height: 630,
        alt: "Kasauli Coder Branding",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kasauli Coder | Accelerating Your Tech Journey",
    description:
      "Join the community of passionate developers building future-ready tech from Kasauli. Explore programs, projects, and career insights.",
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
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
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
