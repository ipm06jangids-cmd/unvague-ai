"use client";

import { Hero } from "@/components/Hero";
import { EnhanceTool } from "@/components/EnhanceTool";
import { Templates } from "@/components/Templates";
import { HowItWorks } from "@/components/HowItWorks";
import { ExamplesShowcase } from "@/components/ExamplesShowcase";
import { Footer } from "@/components/Footer";

export default function Home() {
  function pickTemplate(prompt: string, mode?: "text" | "image" | "video") {
    window.dispatchEvent(
      new CustomEvent("unvague:prefill", { detail: { prompt, mode } }),
    );
  }
  return (
    <main className="relative">
      <Hero />
      <EnhanceTool />
      <Templates onPick={pickTemplate} />
      <HowItWorks />
      <ExamplesShowcase />
      <Footer />
    </main>
  );
}
