import type { Metadata } from "next";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";
import CustomCursor from "@/components/motion/CustomCursor";
import GrainOverlay from "@/components/motion/GrainOverlay";

export const metadata: Metadata = {
  title: {
    default: "Designs.Tech7 — Graphic Design & Motion Poster Studio",
    template: "%s | Designs.Tech7",
  },
  description:
    "Premium poster design, motion posters, key visuals, and animated campaign graphics. A studio built on precision, typography, and cinematic motion.",
  keywords: [
    "motion poster",
    "poster design",
    "key visual",
    "motion graphics",
    "campaign graphics",
    "title sequence",
    "animated poster",
    "graphic design studio",
  ],
  authors: [{ name: "Designs.Tech7" }],
  creator: "Designs.Tech7",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Designs.Tech7",
    title: "Designs.Tech7",
    description: "Premium poster design and motion graphics studio.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Designs.Tech7",
    description: "Premium poster design and motion graphics studio.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-ink text-platinum font-body antialiased">
        {/* Grain texture overlay */}
        <GrainOverlay />

        {/* Custom cursor (desktop only) */}
        <CustomCursor />

        {/* Main content */}
        {children}

        {/* Toast notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "rgba(26, 26, 26, 0.95)",
              color: "#e8e6e1",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              letterSpacing: "0.05em",
            },
            success: {
              iconTheme: {
                primary: "#c8ff00",
                secondary: "#0a0a0a",
              },
            },
            error: {
              iconTheme: {
                primary: "#ff4400",
                secondary: "#0a0a0a",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
