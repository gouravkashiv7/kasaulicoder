import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google"; // Added Inter
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
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
        url: "/logo.png",
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
    images: ["/logo.png"],
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
    apple: "/logo.png",
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
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased bg-background-dark text-slate-100`}
      >
        {children}
      </body>
    </html>
  );
}
