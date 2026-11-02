import type { Metadata } from "next";
import { AboutContent } from "./AboutContent";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Srijon Space connects creators with professional creative spaces across Bangladesh — photo studios, film stages, podcast rooms, music suites, and art workshops.",
};

export default function AboutPage() {
  return <AboutContent />;
}
