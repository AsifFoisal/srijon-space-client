import type { Metadata } from "next";
import { Inter, Playwrite_IT_Trad, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { AppPreloader } from "@/components/layout/AppPreloader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const playwrite = Playwrite_IT_Trad({
  variable: "--font-playwrite",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Srijon Space — Creative studios, ready to book",
    template: "%s — Srijon Space",
  },
  description:
    "Discover and book inspiring photo studios, film stages, podcast rooms, music suites, and art workshops. Srijon Space connects creators with premium creative spaces.",
  applicationName: "Srijon Space",
  keywords: [
    "studio rental",
    "photo studio",
    "film stage",
    "podcast studio",
    "music studio",
    "art workshop",
    "creative spaces",
    "Srijon Space",
  ],
  openGraph: {
    title: "Srijon Space — Creative studios, ready to book",
    description:
      "A peer-to-peer marketplace for creative studio rentals. Discover inspiring spaces and book them by the hour.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${playwrite.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem("theme")==="dark"){document.documentElement.classList.add("dark")}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="flex min-h-dvh flex-col bg-ivory text-ink antialiased">
        <Providers>
          <SiteChrome>{children}</SiteChrome>
          <AppPreloader />
        </Providers>
      </body>
    </html>
  );
}
