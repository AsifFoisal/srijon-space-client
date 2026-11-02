import { Suspense } from "react";
import { HeroSlider } from "@/components/home/HeroSlider";
import { FeaturedStudios } from "@/components/home/FeaturedStudios";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { TrustSection } from "@/components/home/TrustSection";
import { HostCta } from "@/components/home/HostCta";
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
