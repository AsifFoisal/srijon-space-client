import type { Metadata } from "next";
import { AboutContent } from "./about-content";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Srijon Space connects creators with professional creative spaces across New York — photo studios, film stages, podcast rooms, music suites, and art workshops.",
};

export default function AboutPage() {
  return <AboutContent />;
}
