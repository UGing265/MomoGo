import {
  Navigation,
  HeroSection,
  ComparisonSection,
  FeaturesSection,
  SecuritySection,
  HowItWorks,
  SocialProof,
  FaqSection,
  ContactSection,
  Footer,
} from "@/components/landing";

export default function Home() {
  return (
    <main className="flex flex-col flex-1">
      <Navigation />
      <HeroSection />
      <ComparisonSection />
      <FeaturesSection />
      <SecuritySection />
      <HowItWorks />
      <SocialProof />
      <FaqSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
