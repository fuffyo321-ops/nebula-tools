import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { PricingSection } from "@/components/landing/pricing-section";
import { FAQ } from "@/components/landing/faq";

export const metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing. Start free, scale when ready.",
};

export default function PricingPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-16">
        <PricingSection />
        <FAQ />
      </div>
      <Footer />
    </main>
  );
}
