"use client";

import { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Wand2,
  ArrowRight,
} from "lucide-react";

type TargetModel = "any" | "claude" | "gpt" | "gemini";
type TaskType =
  | "auto"
  | "writing"
  | "coding"
  | "analysis"
  | "marketing"
  | "image"
  | "research";
type Tone = "neutral" | "formal" | "casual" | "technical";

interface ChangeNote {
  added: string;
  why: string;
}

interface EnhanceResponse {
  enhanced: string;
  detectedTaskType: string;
  changes: ChangeNote[];
}

const MODELS: { value: TargetModel; label: string }[] = [
  { value: "any", label: "Any model" },
  { value: "claude", label: "Claude" },
  { value: "gpt", label: "ChatGPT" },
  { value: "gemini", label: "Gemini" },
];

const TASKS: { value: TaskType; label: string }[] = [
  { value: "auto", label: "Auto-detect" },
  { value: "writing", label: "Writing" },
  { value: "coding", label: "Coding" },
  { value: "analysis", label: "Analysis" },
  { value: "marketing", label: "Marketing" },
  { value: "image", label: "Image prompt" },
  { value: "research", label: "Research" },
];

const TONES: { value: Tone; label: string }[] = [
  { value: "neutral", label: "Neutral" },
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
  { value: "technical", label: "Technical" },
];

const EXAMPLES = [
  "write me a poem about love",
  "code something for sales tracking",
  "help me with a marketing strategy",
  "summarize this article",
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [target, setTarget] = useState<TargetModel>("any");
  const [task, setTask] = useState<TaskType>("auto");
  const [tone, setTone] = useState<Tone>("neutral");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EnhanceResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  async function enhance() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setCopied(false);
    try {
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, target, taskType: task, tone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "request failed");
      setResult(data as EnhanceResponse);
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <header className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-1.5 text-xs text-zinc-400">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            Free. No signup. Powered by Claude Haiku 4.5
          </div>
          <h1 className="bg-gradient-to-br from-white via-zinc-200 to-zinc-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-6xl">
            Unvague AI
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-400">
            Turn lazy, vague prompts into world-class, model-optimized prompts
            that get dramatically better results.
          </p>
        </header>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 shadow-2xl backdrop-blur">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Paste your vague prompt here. e.g. 'write me a poem about love'"
            rows={4}
            maxLength={4000}
            className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <Select label="Target model" value={target} onChange={setTarget} options={MODELS} />
            <Select label="Task type" value={task} onChange={setTask} options={TASKS} />
            <Select label="Tone" value={tone} onChange={setTone} options={TONES} />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="text-zinc-500">Try:</span>
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setPrompt(ex)}
                  className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-zinc-400 transition hover:border-violet-500 hover:text-violet-300"
                >
                  {ex}
                </button>
              ))}
            </div>
            <button
              onClick={enhance}
              disabled={loading || !prompt.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Wand2 className="h-4 w-4 animate-pulse" />
                  Enhancing…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Enhance
                </>
              )}
            </button>
          </div>
        </section>

        {error && (
          <div className="mt-6 rounded-lg border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {result && (
          <section className="mt-8 space-y-5">
            <div className="rounded-2xl border border-violet-900/50 bg-zinc-900/60 p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-violet-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  Enhanced prompt
                  <span className="rounded-full border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[10px] normal-case tracking-normal text-zinc-400">
                    {result.detectedTaskType}
                  </span>
                </div>
                <button
                  onClick={copyEnhanced}
                  className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-violet-500 hover:text-violet-300"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="whitespace-pre-wrap rounded-lg bg-zinc-950 p-4 font-mono text-sm leading-relaxed text-zinc-100">
                {result.enhanced}
              </pre>
              <div className="mt-3 flex flex-wrap gap-2">
                <DeepLink href={deepLink("claude")} label="Open in Claude" />
                <DeepLink href={deepLink("chatgpt")} label="Open in ChatGPT" />
                <DeepLink href={deepLink("gemini")} label="Open in Gemini" />
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
              <h3 className="mb-3 text-xs uppercase tracking-wider text-zinc-400">
                What changed & why
              </h3>
              <ul className="space-y-3">
                {result.changes.map((c, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-[11px] font-bold text-violet-300">
                      {i + 1}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-zinc-200">{c.added}</div>
                      <div className="text-sm text-zinc-400">{c.why}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40">
              <button
                onClick={() => setShowOriginal((s) => !s)}
                className="flex w-full items-center justify-between p-5 text-left text-sm text-zinc-400 hover:text-zinc-200"
              >
                <span>Show original prompt</span>
                {showOriginal ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {showOriginal && (
                <pre className="whitespace-pre-wrap border-t border-zinc-800 p-5 font-mono text-sm text-zinc-500">
                  {prompt}
                </pre>
              )}
            </div>
          </section>
        )}

        <footer className="mt-20 border-t border-zinc-800 pt-8 text-center text-xs text-zinc-500">
          <p>
            Built with Claude Haiku 4.5. Your prompts are not stored. Free for everyone.
          </p>
        </footer>
      </div>
    </div>
  );
}

function Select<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] uppercase tracking-wider text-zinc-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 focus:border-violet-500 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function DeepLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-violet-500 hover:text-violet-300"
    >
      {label}
      <ArrowRight className="h-3 w-3" />
    </a>
  );
}
