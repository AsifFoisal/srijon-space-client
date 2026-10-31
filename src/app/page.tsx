import { HeroSlider } from "@/components/home/hero-slider";
import { FeaturedStudios } from "@/components/home/featured-studios";
import { CategoriesSection } from "@/components/home/categories-section";
import { HowItWorks } from "@/components/home/how-it-works";
import { TrustSection } from "@/components/home/trust-section";
import { HostCta } from "@/components/home/host-cta";

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <FeaturedStudios />
      <CategoriesSection />
      <HowItWorks />
      <TrustSection />
      <HostCta />
    </>
  );
}
