import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { PricingSection } from "@/components/landing/pricing-section";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { CTA } from "@/components/landing/cta";

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <Navbar />

      <Hero />

      {/* Divider */}
      <div className="section-divider max-w-7xl mx-auto" />

      <Features />

      <div className="section-divider max-w-7xl mx-auto" />

      <Testimonials />

      <div className="section-divider max-w-7xl mx-auto" />

      <PricingSection />

      <div className="section-divider max-w-7xl mx-auto" />

      <FAQ />

      <CTA />

      <Footer />
    </main>
  );
}
