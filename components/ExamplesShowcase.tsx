"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Glass, Hairline, SectionLabel } from "./ui";
import { AmbientVideo } from "./AmbientVideo";

const PAIRS = [
  {
    mode: "Text",
    vague: "write me a cold email to a prospect",
    enhanced: `You are a senior B2B SDR with 8 years selling SaaS to mid-market ops teams. Draft a 3-paragraph cold email to [PROSPECT NAME], [TITLE] at [COMPANY].

<context>
- Our product: [ONE-LINE PITCH]
- Their likely pain: [PAIN POINT]
- Source of intent signal: [HOW WE FOUND THEM]
</context>

<requirements>
- Subject line: ≤6 words, curiosity not clickbait
- Open: reference their specific situation, not "I noticed your company"
- Middle: one concrete proof point with a number
- Close: low-friction CTA (15-min question, not a demo)
- Total: under 90 words
</requirements>

Output the email only, no commentary.`,
  },
  {
    mode: "Image",
    vague: "cyberpunk girl",
    enhanced: `A young woman with neon-pink dyed hair and chrome cheekbone implants, leaning against a rain-slick alley wall, wearing a translucent vinyl jacket over a holographic crop top. Reflections of magenta and cyan kanji signs ripple across wet asphalt. Volumetric haze, low-key rim lighting from camera-right, shallow depth of field, 35mm anamorphic lens flare, cinematic color grade --ar 9:16 --style raw --v 6`,
  },
  {
    mode: "Video",
    vague: "spaceship landing",
    enhanced: `An 8-second cinematic shot: a battered cargo spaceship descends through orange dust clouds onto a Martian plateau. Slow 12-second crane shot starting wide above the ship, gradually descending to ground level as landing struts deploy. Hot exhaust kicks rust-red dust outward in concentric rings. Late-afternoon light, long shadows, muted earth tones with cyan ship lights. Filmed in IMAX-style anamorphic, shot on Alexa Mini LF. Audio: low rumbling engine, hiss of pneumatic struts, distant wind.`,
  },
  {
    mode: "Text",
    vague: "code something for sales tracking",
    enhanced: `You are a senior full-stack engineer. Write a minimal Python CLI that tracks daily sales.

<requirements>
- Single file, no external deps beyond stdlib + sqlite3
- Commands: \`add <amount> [--note <text>]\`, \`today\`, \`week\`, \`month\`
- Stores entries in ~/.sales.db with columns: id, amount (REAL), note (TEXT), ts (TEXT ISO8601)
- All amounts in USD, 2 decimal places
- Output formatted as a table; \`today\` shows today's total + count
</requirements>

<output>
Just the Python code, no prose. Include a brief docstring at top.
</output>`,
  },
];

export function ExamplesShowcase() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section ref={ref} className="relative isolate overflow-hidden px-6 py-24 md:py-32">
      <AmbientVideo src="/loop-gear5.mp4" opacity={0.5} />
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <SectionLabel>Receipts</SectionLabel>
          <h2 className="font-serif text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-tight tracking-tight text-ivory-100">
            Vague in, <span className="text-gold-gradient italic">world-class</span> out.
          </h2>
        </div>

        <Hairline className="mb-12" />

        <div className="grid gap-6 md:grid-cols-2">
          {PAIRS.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.12 }}
            >
              <Glass className="overflow-hidden p-0">
                <div className="border-b border-gold-400/10 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-400">
                  {p.mode}
                </div>
                <div className="p-5">
                  <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory-500">
                    Vague
                  </div>
                  <pre className="whitespace-pre-wrap rounded-lg bg-obsidian-950/60 p-3 font-mono text-xs text-ivory-400">
                    {p.vague}
                  </pre>
                  <div className="my-3 flex items-center justify-center text-gold-400/60">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                  <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-400">
                    Unvagued
                  </div>
                  <pre className="max-h-60 overflow-y-auto whitespace-pre-wrap rounded-lg border border-gold-400/10 bg-obsidian-950/60 p-3 font-mono text-xs leading-relaxed text-ivory-100 scrollbar-hide">
                    {p.enhanced}
                  </pre>
                </div>
              </Glass>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
