# Unvague AI

Turn lazy, vague prompts into world-class, model-optimized prompts. Free.

## Features
- **Text mode** — optimize prompts for Claude, GPT, Gemini, Grok, Llama, or any LLM
- **Image mode** — Midjourney v6, Nano Banana, DALL-E 3, Flux 1.1, SDXL
- **Video mode** — Veo 3, Runway Gen-3, Kling 1.5, Sora, Pika 2.0
- **Side-by-side runner** — see vague vs enhanced output through Gemini Flash live
- **"Why it's better" panel** — every enhancement shows what changed and why
- **Deep links** — open enhanced prompt directly in Claude / ChatGPT / Gemini

## Stack
- Next.js 16 (App Router) + Tailwind v4 + TypeScript
- Google Gemini 2.0 Flash via `@google/generative-ai` (JSON mode + responseSchema)
- Framer Motion + GSAP + Lenis (motion stack)
- Optional: Supabase (history), Upstash (rate limit)
- Deploy: Vercel

## Setup
```bash
cp .env.local.example .env.local
# fill GEMINI_API_KEY from https://aistudio.google.com/app/apikey
npm install
npm run dev
```

Open http://localhost:3000.

## Optional integrations
- **Rate limiting**: add `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` from https://console.upstash.com
- **History (coming soon)**: add `NEXT_PUBLIC_SUPABASE_URL` + keys from https://supabase.com

If these env vars are absent the app runs without those features (no error).

## Architecture
- `app/page.tsx` — composes Hero → Tool → HowItWorks → Examples → Footer
- `app/api/enhance/route.ts` — POST handler, Gemini JSON mode
- `app/api/run-both/route.ts` — parallel-fires vague + enhanced for live proof
- `lib/meta-prompt.ts` — core IP: text + image + video meta-prompt builders
- `lib/gemini.ts` — SDK client + response schema
- `lib/ratelimit.ts` — Upstash wrapper, no-op without env
- `components/` — Hero, EnhanceTool, HowItWorks, ExamplesShowcase, Footer, ui primitives, CustomCursor, GodRays, SmoothScroll

## Deploy
1. Push to GitHub (already at github.com/ipm06jangids-cmd/unvague-ai)
2. Import to https://vercel.com/new
3. Set env var `GEMINI_API_KEY`
4. Deploy

## Security note
After first deploy, restrict your Gemini API key in Google Cloud Console to your deployed domain only. https://aistudio.google.com/app/apikey → key → Edit → Application restrictions.
