"use client";

import { ArrowUp, Sparkles } from "lucide-react";
import { Button, Hairline, SectionLabel } from "./ui";
import { AmbientVideo } from "./AmbientVideo";

const SHARE_TEXT =
  "Found this — turns lazy AI prompts into world-class ones. Free, no signup. unvague.ai";

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden px-6 py-20">
      <AmbientVideo src="/loop-luffy.mp4" peak={0.7} />
      <div className="mx-auto max-w-4xl">
        <Hairline className="mb-16" />

        <div className="flex flex-col items-center gap-8 text-center">
          <SectionLabel>Don&apos;t stop now</SectionLabel>
          <h3 className="font-serif text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-tight tracking-tight">
            <span className="text-ivory-gradient">One more vague prompt? </span>
            <span className="text-gold-gradient italic">Go on.</span>
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={() => {
                document.getElementById("tool")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Sparkles className="h-4 w-4" />
              Unvague another
            </Button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}`}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover
            >
              <Button variant="outline" size="lg">
                Share on X
              </Button>
            </a>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <ArrowUp className="h-4 w-4" />
              Back to top
            </Button>
          </div>

          <Hairline className="my-8 max-w-xs" />

          <div className="flex flex-col items-center gap-2 text-xs text-ivory-500">
            <div className="font-serif text-base text-ivory-300">Unvague AI</div>
            <div>Made with Gemini · Your prompts are never stored.</div>
            <div className="mt-2 flex gap-4 text-[11px]">
              <a
                href="https://github.com/ipm06jangids-cmd/unvague-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold-300"
                data-cursor-hover
              >
                GitHub
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold-300"
                data-cursor-hover
              >
                Tweet
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
