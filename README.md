# Unvague AI

Turn lazy, vague prompts into world-class, model-optimized prompts.

## Stack
- Next.js 15 (App Router) + Tailwind v4 + TypeScript
- Claude Haiku 4.5 via `@anthropic-ai/sdk` (with prompt caching)
- Deploy: Vercel

## Setup
```bash
cp .env.local.example .env.local
# fill ANTHROPIC_API_KEY from https://console.anthropic.com/
npm install
npm run dev
```

Open http://localhost:3000.

## Architecture
- `app/page.tsx` — UI
- `app/api/enhance/route.ts` — POST handler, calls Claude
- `lib/meta-prompt.ts` — the core IP, system-prompt builder
- `lib/anthropic.ts` — SDK client

## Deploy
Push to GitHub, import to Vercel, set `ANTHROPIC_API_KEY` env var, deploy.

## Roadmap
- v2: image/video prompt modes (Midjourney, Nano Banana, Veo)
- v2: Google login + history (Supabase)
- v2: rate limiting (Upstash)
- v2: side-by-side runner (vague vs enhanced through real model)
