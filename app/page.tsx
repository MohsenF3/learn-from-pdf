import { BenefitsSection } from "@/features/home/components/benefits-section";
import { BlobBackground } from "@/features/home/components/blob-background";
import { CtaSection } from "@/features/home/components/cta-section";
import { FeaturesCards } from "@/features/home/components/features-cards";
import { HeroSection } from "@/features/home/components/hero-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LearnfromPDF - Transform PDFs into Interactive Quizzes",
};

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <BlobBackground />

      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          <HeroSection />
          <FeaturesCards />
          <BenefitsSection />
          <CtaSection />
        </div>
      </div>
    </main>
  );
}
