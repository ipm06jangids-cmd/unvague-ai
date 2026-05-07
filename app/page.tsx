import { Hero } from "@/components/Hero";
import { EnhanceTool } from "@/components/EnhanceTool";
import { HowItWorks } from "@/components/HowItWorks";
import { ExamplesShowcase } from "@/components/ExamplesShowcase";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <EnhanceTool />
      <HowItWorks />
      <ExamplesShowcase />
      <Footer />
    </main>
  );
}
