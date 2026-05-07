"use client";

import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import { GodRays } from "./GodRays";
import { Button, SectionLabel } from "./ui";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pt-24">
      <GodRays intense />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-8"
        >
          <SectionLabel>
            <Sparkles className="h-3 w-3" />
            Free · No signup · Powered by Gemini
          </SectionLabel>
        </motion.div>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.25 }}
          className="font-serif text-[clamp(2.75rem,8vw,6.5rem)] font-semibold leading-[0.95] tracking-tight"
        >
          <span className="text-ivory-gradient">Make every prompt </span>
          <span className="relative inline-block">
            <span className="text-gold-gradient italic">unvague.</span>
            <motion.span
              aria-hidden
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 1, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-1 left-0 right-0 h-[3px] origin-left bg-gradient-to-r from-transparent via-gold-400 to-transparent"
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-8 max-w-2xl text-balance text-base text-ivory-400 md:text-lg"
        >
          Paste a lazy, vague prompt. Get back a world-class, model-optimized prompt
          that gets dramatically better results from ChatGPT, Claude, Gemini,
          Midjourney, Veo and more.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
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
            opacity: { duration: 1, delay: 1.5 },
            y: { duration: 2.4, delay: 1.5, repeat: Infinity, ease: "easeInOut" },
          }}
          onClick={() =>
            document.getElementById("tool")?.scrollIntoView({ behavior: "smooth" })
          }
          aria-label="Scroll to tool"
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-ivory-500 hover:text-gold-300"
        >
          <ArrowDown className="h-5 w-5" />
        </motion.button>
      </motion.div>
    </section>
  );
}
