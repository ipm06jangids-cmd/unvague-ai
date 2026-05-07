"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Eye, Wand2, Crown } from "lucide-react";
import { Hairline, SectionLabel } from "./ui";
import { AmbientVideo } from "./AmbientVideo";

const STEPS = [
  {
    icon: Eye,
    title: "Diagnose",
    body: "We scan your prompt for the six pillars: role, context, task, constraints, format, success criteria. Whatever's missing, we surface.",
  },
  {
    icon: Wand2,
    title: "Re-architect",
    body: "Your idea is rebuilt in the grammar your target model loves — XML for Claude, role-first for GPT, structural for Gemini, flag syntax for Midjourney.",
  },
  {
    icon: Crown,
    title: "Justify",
    body: "Every addition comes with a one-line reason. Use the tool, learn prompt engineering by watching it happen.",
  },
];

export function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how" ref={ref} className="relative isolate overflow-hidden px-6 py-24 md:py-32">
      <AmbientVideo src="/loop-itachi.mp4" peak={0.7} />
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <SectionLabel>The method</SectionLabel>
          <h2 className="font-serif text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-tight tracking-tight text-ivory-100">
            Three moves between vague and{" "}
            <span className="text-gold-gradient italic">world-class</span>.
          </h2>
        </div>

        <Hairline className="mb-12" />

        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="glass relative overflow-hidden rounded-2xl p-7"
            >
              <div className="absolute -right-6 -top-6 font-serif text-[8rem] font-bold leading-none text-gold-400/5">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="relative">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/5 text-gold-300">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-2xl font-semibold text-ivory-100">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory-400">{s.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
