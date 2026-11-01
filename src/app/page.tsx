import { Suspense } from "react";
import { HeroSlider } from "@/components/home/hero-slider";
import { FeaturedStudios } from "@/components/home/featured-studios";
import { CategoriesSection } from "@/components/home/categories-section";
import { HowItWorks } from "@/components/home/how-it-works";
import { TrustSection } from "@/components/home/trust-section";
import { HostCta } from "@/components/home/host-cta";
import { StudioGridSkeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <Suspense
        fallback={
          <section className="py-20 lg:py-28">
            <div className="shell shell-wide">
              <StudioGridSkeleton count={6} />
            </div>
          </section>
        }
      >
        <FeaturedStudios />
      </Suspense>
      <CategoriesSection />
      <HowItWorks />
      <TrustSection />
      <HostCta />
    </>
  );
}
