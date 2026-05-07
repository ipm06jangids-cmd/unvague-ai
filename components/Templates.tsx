"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { Glass, SectionLabel } from "./ui";

type Cat =
  | "Recommended"
  | "Sales"
  | "Marketing"
  | "Product"
  | "Engineering"
  | "Founder"
  | "Operations"
  | "Customer Success"
  | "Writing"
  | "Image"
  | "Video";

interface Template {
  cat: Cat[];
  title: string;
  desc: string;
  prompt: string;
  mode?: "text" | "image" | "video";
}

const TEMPLATES: Template[] = [
  {
    cat: ["Recommended", "Writing"],
    title: "Draft a professional email",
    desc: "Write a clear, confident email for any situation",
    prompt: "write a professional email to my manager asking for a deadline extension",
  },
  {
    cat: ["Recommended", "Operations"],
    title: "Distill meeting notes",
    desc: "Clean up messy notes into a clear summary and next steps",
    prompt:
      "turn these meeting notes into a clean summary with action items and owners",
  },
  {
    cat: ["Recommended", "Operations"],
    title: "Summarize a document",
    desc: "Get the key points from any long document, fast",
    prompt: "summarize this document in 5 bullets and surface anything risky",
  },
  {
    cat: ["Recommended", "Product"],
    title: "Analyze data",
    desc: "Make sense of your numbers and spot what matters",
    prompt:
      "analyze this dataset and tell me what's interesting and what's worth digging into",
  },
  {
    cat: ["Recommended", "Sales"],
    title: "Craft a cold outreach email",
    desc: "Write a first-touch email people actually respond to",
    prompt: "write a cold email to a head of growth at a B2B SaaS company",
  },
  {
    cat: ["Recommended", "Product"],
    title: "Build a PRD",
    desc: "Lay out what you're building, why, and how it'll work",
    prompt: "write a PRD for a new feature that lets users collaborate on documents",
  },
  {
    cat: ["Recommended", "Marketing"],
    title: "Create a launch email campaign",
    desc: "Emails that get people excited about your release",
    prompt:
      "write a 3-email launch sequence for a new SaaS product targeting startup founders",
  },
  {
    cat: ["Sales", "Founder"],
    title: "Write a consulting proposal",
    desc: "A proposal that wins the project, not just answers the brief",
    prompt: "write a consulting proposal for a 3-month brand strategy engagement",
  },
  {
    cat: ["Engineering"],
    title: "Code review checklist",
    desc: "Review a PR like a senior engineer would",
    prompt:
      "review this pull request and give me a checklist of issues by severity",
  },
  {
    cat: ["Engineering"],
    title: "Debug an error",
    desc: "Walk through a stack trace and find the root cause",
    prompt:
      "I'm getting this error in production, help me find the root cause and fix",
  },
  {
    cat: ["Marketing", "Writing"],
    title: "Write a viral tweet",
    desc: "A scroll-stopping tweet about your topic",
    prompt: "write a tweet about why most startup advice is wrong",
  },
  {
    cat: ["Marketing"],
    title: "Generate ad copy variations",
    desc: "5 different ad headlines and descriptions to A/B test",
    prompt: "generate 5 Meta ad variations for a meditation app targeting busy parents",
  },
  {
    cat: ["Founder"],
    title: "Write a fundraising deck outline",
    desc: "10-slide outline for a pre-seed pitch",
    prompt: "outline a 10-slide pre-seed pitch deck for an AI dev tools startup",
  },
  {
    cat: ["Customer Success"],
    title: "Reply to an angry customer",
    desc: "Diffuse a tense thread and turn it around",
    prompt:
      "draft a reply to this angry customer email — acknowledge, own it, propose a fix",
  },
  {
    cat: ["Customer Success"],
    title: "Write a release notes email",
    desc: "Tell users what shipped without making them yawn",
    prompt:
      "write a friendly release notes email for non-technical users about new features",
  },
  {
    cat: ["Image"],
    title: "Cinematic portrait",
    desc: "A dramatic, gallery-worthy character shot",
    prompt: "cyberpunk warrior in a neon alley",
    mode: "image",
  },
  {
    cat: ["Image"],
    title: "Product hero shot",
    desc: "A clean, premium product image",
    prompt: "minimal product photo of a luxury watch on dark stone",
    mode: "image",
  },
  {
    cat: ["Video"],
    title: "Cinematic reveal",
    desc: "A dramatic 8-second product or character reveal",
    prompt: "spaceship landing on mars during sunset",
    mode: "video",
  },
];

const CATS: Cat[] = [
  "Recommended",
  "Sales",
  "Marketing",
  "Product",
  "Engineering",
  "Founder",
  "Operations",
  "Customer Success",
  "Writing",
  "Image",
  "Video",
];

export function Templates({
  onPick,
}: {
  onPick: (prompt: string, mode?: "text" | "image" | "video") => void;
}) {
  const [active, setActive] = useState<Cat>("Recommended");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const byCat = TEMPLATES.filter((t) => t.cat.includes(active));
    if (!q.trim()) return byCat;
    const lc = q.toLowerCase();
    return byCat.filter(
      (t) =>
        t.title.toLowerCase().includes(lc) ||
        t.desc.toLowerCase().includes(lc) ||
        t.prompt.toLowerCase().includes(lc),
    );
  }, [active, q]);

  return (
    <section className="relative px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>Discover</SectionLabel>
            <h2 className="mt-3 font-serif text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-tight tracking-tight text-ivory-100">
              Ready-to-use prompts.{" "}
              <span className="text-gold-gradient italic">Pick one and make it yours.</span>
            </h2>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ivory-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search templates"
              className="w-full rounded-full border border-obsidian-700 bg-obsidian-900/60 py-2.5 pl-10 pr-4 text-sm text-ivory-100 placeholder:text-ivory-500 focus:border-gold-400/50 focus:outline-none"
            />
          </div>
        </div>

        <div className="scrollbar-hide mb-8 flex gap-2 overflow-x-auto pb-2">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              data-cursor-hover
              className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
                active === c
                  ? "border-gold-400/60 bg-gold-400/10 text-gold-300 shadow-[0_0_16px_-6px_var(--gold-400)]"
                  : "border-obsidian-700 bg-obsidian-900/40 text-ivory-400 hover:border-gold-400/40 hover:text-ivory-100"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((t, i) => (
            <motion.button
              key={t.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: (i % 8) * 0.04 }}
              onClick={() => {
                onPick(t.prompt, t.mode);
                setTimeout(() => {
                  document.getElementById("tool")?.scrollIntoView({ behavior: "smooth" });
                }, 50);
              }}
              data-cursor-hover
              className="group text-left"
            >
              <Glass className="flex h-full flex-col justify-between p-5 transition-all hover:border-gold-400/30 hover:shadow-[0_0_30px_-12px_var(--gold-400)]">
                <div>
                  <div className="font-serif text-lg font-semibold leading-tight text-ivory-100">
                    {t.title}
                  </div>
                  <div className="mt-1.5 text-xs text-ivory-400">{t.desc}</div>
                </div>
                <div className="mt-4 inline-flex items-center justify-end text-gold-400 transition-transform group-hover:translate-x-1">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Glass>
            </motion.button>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-sm text-ivory-500">
              No templates match.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
