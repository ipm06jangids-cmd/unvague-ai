"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import { Button, SectionLabel } from "./ui";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const videoOpacity = useTransform(scrollY, [0, 600], [0.55, 0]);
  const overlayOpacity = useTransform(scrollY, [0, 600], [0.4, 1]);
  const contentY = useTransform(scrollY, [0, 600], [0, -80]);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pt-24"
    >
      <motion.video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        style={{ opacity: videoOpacity }}
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover"
        aria-hidden
      >
        <source src="/hero.mp4" type="video/mp4" />
      </motion.video>

      <motion.div
        aria-hidden
        style={{ opacity: overlayOpacity }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950/40 via-obsidian-950/70 to-obsidian-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_30%,rgba(124,58,237,0.18),transparent_60%)]" />
      </motion.div>

      <div className="grain pointer-events-none absolute inset-0 -z-10" />

      <motion.div
        style={{ y: contentY }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-8"
        >
          <SectionLabel>
            <Sparkles className="h-3 w-3" />
            Free · No signup · Powered by Gemini
          </SectionLabel>
        </motion.div>

        <motion.h1
          initial={{ y: 28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="font-serif text-[clamp(2.75rem,8vw,6.5rem)] font-semibold leading-[0.95] tracking-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
        >
          <span className="text-ivory-gradient">Make every prompt </span>
          <span className="relative inline-block">
            <span className="text-gold-gradient italic">unvague.</span>
            <motion.span
              aria-hidden
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-1 left-0 right-0 h-[3px] origin-left bg-gradient-to-r from-transparent via-gold-400 to-transparent"
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-8 max-w-2xl text-balance text-base text-ivory-300 md:text-lg"
        >
          Paste a lazy, vague prompt. Get back a world-class, model-optimized prompt
          that gets dramatically better results from ChatGPT, Claude, Gemini,
          Midjourney, Veo and more.
        </motion.p>

        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.55 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Button
            size="lg"
            onClick={() =>
              document.getElementById("tool")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <Sparkles className="h-4 w-4" />
            Unvague a prompt
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() =>
              document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            See how it works
          </Button>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{
            opacity: { duration: 1, delay: 1.2 },
            y: { duration: 2.4, delay: 1.2, repeat: Infinity, ease: "easeInOut" },
          }}
          onClick={() =>
            document.getElementById("tool")?.scrollIntoView({ behavior: "smooth" })
          }
          aria-label="Scroll to tool"
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-ivory-300 hover:text-gold-300"
        >
          <ArrowDown className="h-5 w-5" />
        </motion.button>
      </motion.div>
    </section>
  );
}
