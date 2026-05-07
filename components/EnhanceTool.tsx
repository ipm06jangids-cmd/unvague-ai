"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Sparkles,
  Wand2,
  Copy,
  Check,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Type,
  Image as ImageIcon,
  Film,
} from "lucide-react";
import { Button, Chip, Glass, Hairline, SectionLabel } from "./ui";
import {
  AnyTarget,
  AspectRatio,
  CameraMove,
  Duration,
  EnhanceResponse,
  ImageStyle,
  ImageTarget,
  Mode,
  TaskType,
  TextTarget,
  Tone,
  VideoTarget,
} from "@/lib/meta-prompt";

const TEXT_TARGETS: { v: TextTarget; l: string }[] = [
  { v: "any", l: "Any" },
  { v: "claude", l: "Claude" },
  { v: "gpt", l: "ChatGPT" },
  { v: "gemini", l: "Gemini" },
  { v: "grok", l: "Grok" },
  { v: "llama", l: "Llama" },
];
const IMAGE_TARGETS: { v: ImageTarget; l: string }[] = [
  { v: "midjourney", l: "Midjourney v6" },
  { v: "nano-banana", l: "Nano Banana" },
  { v: "dalle", l: "DALL·E 3" },
  { v: "flux", l: "Flux 1.1" },
  { v: "sdxl", l: "SDXL" },
  { v: "generic-image", l: "Generic" },
];
const VIDEO_TARGETS: { v: VideoTarget; l: string }[] = [
  { v: "veo", l: "Veo 3" },
  { v: "runway", l: "Runway Gen-3" },
  { v: "kling", l: "Kling 1.5" },
  { v: "sora", l: "Sora" },
  { v: "pika", l: "Pika 2.0" },
];

const TASKS: { v: TaskType; l: string }[] = [
  { v: "auto", l: "Auto" },
  { v: "writing", l: "Writing" },
  { v: "coding", l: "Coding" },
  { v: "analysis", l: "Analysis" },
  { v: "marketing", l: "Marketing" },
  { v: "research", l: "Research" },
  { v: "roleplay", l: "Roleplay" },
  { v: "extraction", l: "Extraction" },
];
const TONES: { v: Tone; l: string }[] = [
  { v: "neutral", l: "Neutral" },
  { v: "formal", l: "Formal" },
  { v: "casual", l: "Casual" },
  { v: "technical", l: "Technical" },
  { v: "persuasive", l: "Persuasive" },
  { v: "academic", l: "Academic" },
];
const ASPECTS: AspectRatio[] = ["1:1", "16:9", "9:16", "3:2", "4:5"];
const STYLES: { v: ImageStyle; l: string }[] = [
  { v: "photo", l: "Photo" },
  { v: "cinematic", l: "Cinematic" },
  { v: "illustration", l: "Illustration" },
  { v: "3d", l: "3D" },
  { v: "anime", l: "Anime" },
  { v: "editorial", l: "Editorial" },
];
const DURATIONS: Duration[] = ["4s", "8s", "12s", "30s"];
const CAMERAS: { v: CameraMove; l: string }[] = [
  { v: "static", l: "Static" },
  { v: "dolly", l: "Dolly" },
  { v: "pan", l: "Pan" },
  { v: "crane", l: "Crane" },
  { v: "orbit", l: "Orbit" },
  { v: "handheld", l: "Handheld" },
];

const EXAMPLES: Record<Mode, string[]> = {
  text: [
    "write me a poem about love",
    "code something for sales tracking",
    "help me with marketing strategy",
    "summarize this article",
  ],
  image: [
    "cat in space",
    "futuristic city at night",
    "portrait of a warrior",
    "minimal product photo of a watch",
  ],
  video: [
    "person walking through forest",
    "spaceship landing on mars",
    "coffee being poured slow motion",
    "city timelapse",
  ],
};

interface RunBothResult {
  vague: string;
  enhanced: string;
}

export function EnhanceTool() {
  const [mode, setMode] = useState<Mode>("text");
  const [prompt, setPrompt] = useState("");
  const [textTarget, setTextTarget] = useState<TextTarget>("any");
  const [imageTarget, setImageTarget] = useState<ImageTarget>("midjourney");
  const [videoTarget, setVideoTarget] = useState<VideoTarget>("veo");
  const [task, setTask] = useState<TaskType>("auto");
  const [tone, setTone] = useState<Tone>("neutral");
  const [aspect, setAspect] = useState<AspectRatio>("1:1");
  const [style, setStyle] = useState<ImageStyle>("cinematic");
  const [duration, setDuration] = useState<Duration>("8s");
  const [camera, setCamera] = useState<CameraMove>("dolly");
  const [audio, setAudio] = useState(false);
  const [runBoth, setRunBoth] = useState(false);

  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EnhanceResponse | null>(null);
  const [bothResult, setBothResult] = useState<RunBothResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"enhanced" | "why" | "compare">(
    "enhanced",
  );
  const [showOriginal, setShowOriginal] = useState(false);

  function currentTarget(): AnyTarget {
    if (mode === "image") return imageTarget;
    if (mode === "video") return videoTarget;
    return textTarget;
  }

  async function enhance() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setBothResult(null);
    setCopied(false);
    try {
      const body = {
        prompt,
        mode,
        target: currentTarget(),
        ...(mode === "text" && { taskType: task, tone }),
        ...(mode === "image" && { aspect, style }),
        ...(mode === "video" && {
          duration,
          camera,
          audio: videoTarget === "veo" ? audio : false,
        }),
      };
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "request failed");
      setResult(data as EnhanceResponse);
      setActiveTab("enhanced");
      if (runBoth && mode === "text") {
        setRunning(true);
        try {
          const r2 = await fetch("/api/run-both", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ vague: prompt, enhanced: data.enhanced }),
          });
          const d2 = await r2.json();
          if (r2.ok) setBothResult(d2 as RunBothResult);
        } finally {
          setRunning(false);
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "something broke");
    } finally {
      setLoading(false);
    }
  }

  async function copyEnhanced() {
    if (!result) return;
    await navigator.clipboard.writeText(result.enhanced);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function deepLink(provider: "claude" | "chatgpt" | "gemini") {
    if (!result) return "#";
    const q = encodeURIComponent(result.enhanced);
    if (provider === "claude") return `https://claude.ai/new?q=${q}`;
    if (provider === "chatgpt") return `https://chat.openai.com/?q=${q}`;
    return `https://gemini.google.com/app?q=${q}`;
  }

  return (
    <section id="tool" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col items-center gap-4">
          <SectionLabel>The forge</SectionLabel>
          <h2 className="font-serif text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-tight tracking-tight text-ivory-100">
            Paste anything vague. Get back a{" "}
            <span className="text-gold-gradient italic">crystal-clear</span> prompt.
          </h2>
        </div>

        <Glass className="p-2">
          <div className="flex gap-1 rounded-xl bg-obsidian-950/50 p-1">
            {(
              [
                { v: "text", l: "Text", I: Type },
                { v: "image", l: "Image", I: ImageIcon },
                { v: "video", l: "Video", I: Film },
              ] as const
            ).map(({ v, l, I }) => (
              <button
                key={v}
                onClick={() => {
                  setMode(v);
                  setResult(null);
                  setBothResult(null);
                }}
                data-cursor-hover
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  mode === v
                    ? "bg-gradient-to-b from-violet-500/30 to-violet-600/10 text-ivory-100 shadow-[0_0_24px_-12px_var(--violet-500)]"
                    : "text-ivory-400 hover:text-ivory-100"
                }`}
              >
                <I className="h-4 w-4" />
                {l}
              </button>
            ))}
          </div>
        </Glass>

        <Glass className="mt-6 p-6 md:p-8">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`e.g. "${EXAMPLES[mode][0]}"`}
            rows={4}
            maxLength={4000}
            className="w-full resize-none rounded-xl border border-obsidian-700 bg-obsidian-950/50 p-4 font-mono text-sm text-ivory-100 placeholder:text-ivory-500 focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/40"
          />

          <div className="mt-5 space-y-4">
            <div>
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory-500">
                Target model
              </div>
              <div className="flex flex-wrap gap-2">
                {(mode === "text"
                  ? TEXT_TARGETS
                  : mode === "image"
                    ? IMAGE_TARGETS
                    : VIDEO_TARGETS
                ).map((t) => (
                  <Chip
                    key={t.v}
                    active={
                      (mode === "text" && textTarget === t.v) ||
                      (mode === "image" && imageTarget === t.v) ||
                      (mode === "video" && videoTarget === t.v)
                    }
                    onClick={() => {
                      if (mode === "text") setTextTarget(t.v as TextTarget);
                      if (mode === "image") setImageTarget(t.v as ImageTarget);
                      if (mode === "video") setVideoTarget(t.v as VideoTarget);
                    }}
                  >
                    {t.l}
                  </Chip>
                ))}
              </div>
            </div>

            {mode === "text" && (
              <>
                <ChipRow
                  label="Task"
                  options={TASKS.map((t) => ({ v: t.v, l: t.l }))}
                  value={task}
                  onChange={(v) => setTask(v as TaskType)}
                />
                <ChipRow
                  label="Tone"
                  options={TONES.map((t) => ({ v: t.v, l: t.l }))}
                  value={tone}
                  onChange={(v) => setTone(v as Tone)}
                />
              </>
            )}
            {mode === "image" && (
              <>
                <ChipRow
                  label="Aspect"
                  options={ASPECTS.map((a) => ({ v: a, l: a }))}
                  value={aspect}
                  onChange={(v) => setAspect(v as AspectRatio)}
                />
                <ChipRow
                  label="Style"
                  options={STYLES.map((s) => ({ v: s.v, l: s.l }))}
                  value={style}
                  onChange={(v) => setStyle(v as ImageStyle)}
                />
              </>
            )}
            {mode === "video" && (
              <>
                <ChipRow
                  label="Duration"
                  options={DURATIONS.map((d) => ({ v: d, l: d }))}
                  value={duration}
                  onChange={(v) => setDuration(v as Duration)}
                />
                <ChipRow
                  label="Camera move"
                  options={CAMERAS.map((c) => ({ v: c.v, l: c.l }))}
                  value={camera}
                  onChange={(v) => setCamera(v as CameraMove)}
                />
                {videoTarget === "veo" && (
                  <label className="flex items-center gap-2 text-xs text-ivory-400">
                    <input
                      type="checkbox"
                      checked={audio}
                      onChange={(e) => setAudio(e.target.checked)}
                      className="accent-violet-500"
                    />
                    Include native audio (Veo only)
                  </label>
                )}
              </>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="self-center text-ivory-500">Try:</span>
              {EXAMPLES[mode].map((ex) => (
                <button
                  key={ex}
                  onClick={() => setPrompt(ex)}
                  data-cursor-hover
                  className="rounded-full border border-obsidian-700 bg-obsidian-900/40 px-2.5 py-1 text-ivory-400 transition hover:border-gold-400/40 hover:text-gold-300"
                >
                  {ex}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              {mode === "text" && (
                <label className="flex items-center gap-2 text-xs text-ivory-400">
                  <input
                    type="checkbox"
                    checked={runBoth}
                    onChange={(e) => setRunBoth(e.target.checked)}
                    className="accent-violet-500"
                  />
                  Run both (proof)
                </label>
              )}
              <Button
                size="lg"
                onClick={enhance}
                disabled={loading || !prompt.trim()}
              >
                {loading ? (
                  <>
                    <Wand2 className="h-4 w-4 animate-pulse" />
                    Unvaguing…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Unvague
                  </>
                )}
              </Button>
            </div>
          </div>
        </Glass>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 rounded-xl border border-red-900/50 bg-red-950/20 p-4 text-sm text-red-300"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10"
            >
              <Hairline className="my-6" />

              <div className="mb-4 flex flex-wrap items-center gap-1 rounded-xl bg-obsidian-900/50 p-1 backdrop-blur">
                {(
                  [
                    { v: "enhanced", l: "Enhanced" },
                    { v: "why", l: "Why it's better" },
                    ...(bothResult || running
                      ? [{ v: "compare" as const, l: "Side-by-side" }]
                      : []),
                  ] as const
                ).map((t) => (
                  <button
                    key={t.v}
                    onClick={() => setActiveTab(t.v)}
                    data-cursor-hover
                    className={`flex-1 rounded-lg px-4 py-2 text-xs font-medium transition-all md:text-sm ${
                      activeTab === t.v
                        ? "bg-gold-400/10 text-gold-300"
                        : "text-ivory-400 hover:text-ivory-100"
                    }`}
                  >
                    {t.l}
                  </button>
                ))}
              </div>

              {activeTab === "enhanced" && (
                <Glass className="p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <SectionLabel>
                      <Sparkles className="h-3 w-3" />
                      {result.detectedTaskType}
                    </SectionLabel>
                    <button
                      onClick={copyEnhanced}
                      data-cursor-hover
                      className="inline-flex items-center gap-1.5 rounded-md border border-obsidian-700 bg-obsidian-950/50 px-3 py-1.5 text-xs text-ivory-300 transition hover:border-gold-400/40 hover:text-gold-300"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap rounded-xl border border-obsidian-700 bg-obsidian-950/60 p-4 font-mono text-sm leading-relaxed text-ivory-100">
                    {result.enhanced}
                  </pre>
                  {mode === "text" && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(
                        [
                          ["claude", "Open in Claude"],
                          ["chatgpt", "Open in ChatGPT"],
                          ["gemini", "Open in Gemini"],
                        ] as const
                      ).map(([p, l]) => (
                        <a
                          key={p}
                          href={deepLink(p)}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cursor-hover
                          className="inline-flex items-center gap-1.5 rounded-md border border-obsidian-700 bg-obsidian-950/50 px-3 py-1.5 text-xs text-ivory-300 transition hover:border-gold-400/40 hover:text-gold-300"
                        >
                          {l}
                          <ArrowRight className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => setShowOriginal((s) => !s)}
                    data-cursor-hover
                    className="mt-4 inline-flex items-center gap-1 text-xs text-ivory-500 hover:text-ivory-300"
                  >
                    {showOriginal ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    {showOriginal ? "Hide original" : "Show original"}
                  </button>
                  <AnimatePresence>
                    {showOriginal && (
                      <motion.pre
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-2 overflow-hidden whitespace-pre-wrap font-mono text-sm text-ivory-500"
                      >
                        {prompt}
                      </motion.pre>
                    )}
                  </AnimatePresence>
                </Glass>
              )}

              {activeTab === "why" && (
                <Glass className="p-6">
                  <SectionLabel>What changed & why</SectionLabel>
                  <ul className="mt-5 space-y-4">
                    {result.changes.map((c, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="flex gap-4"
                      >
                        <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/5 font-serif text-xs text-gold-300">
                          {i + 1}
                        </span>
                        <div>
                          <div className="font-serif text-base font-semibold text-ivory-100">
                            {c.added}
                          </div>
                          <div className="mt-1 text-sm text-ivory-400">{c.why}</div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </Glass>
              )}

              {activeTab === "compare" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <Glass className="p-5">
                    <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory-500">
                      Vague prompt result
                    </div>
                    <pre className="whitespace-pre-wrap font-mono text-xs text-ivory-400">
                      {running && !bothResult
                        ? "Running…"
                        : bothResult?.vague ?? "—"}
                    </pre>
                  </Glass>
                  <Glass className="p-5 ring-1 ring-gold-400/20">
                    <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-400">
                      Enhanced prompt result
                    </div>
                    <pre className="whitespace-pre-wrap font-mono text-xs text-ivory-200">
                      {running && !bothResult
                        ? "Running…"
                        : bothResult?.enhanced ?? "—"}
                    </pre>
                  </Glass>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function ChipRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { v: T; l: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory-500">
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <Chip key={o.v} active={value === o.v} onClick={() => onChange(o.v)}>
            {o.l}
          </Chip>
        ))}
      </div>
    </div>
  );
}
