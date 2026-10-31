import type { Metadata } from "next";
import { Inter, Playwrite_IT_Trad, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteChrome } from "@/components/layout/site-chrome";
import { AppPreloader } from "@/components/layout/app-preloader";

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
    default: "StudioSpace — Creative studios, ready to book",
    template: "%s — StudioSpace",
  },
  description:
    "Discover and book inspiring photo studios, film stages, podcast rooms, music suites, and art workshops. StudioSpace connects creators with premium creative spaces.",
  applicationName: "StudioSpace",
  keywords: [
    "studio rental",
    "photo studio",
    "film stage",
    "podcast studio",
    "music studio",
    "art workshop",
    "creative spaces",
    "StudioSpace",
  ],
  openGraph: {
    title: "StudioSpace — Creative studios, ready to book",
    description:
      "A peer-to-peer marketplace for creative studio rentals. Discover inspiring spaces and book them by the hour.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${playwrite.variable}`}
    >
      <body className="flex min-h-dvh flex-col bg-ivory text-ink antialiased">
        <Providers>
          <SiteChrome>{children}</SiteChrome>
          <AppPreloader />
        </Providers>
      </body>
    </html>
  );
}
