import { NextRequest, NextResponse } from "next/server";
import { ENHANCE_SCHEMA, FLASH_MODEL, getGemini } from "@/lib/gemini";
import {
  EnhanceRequest,
  EnhanceResponse,
  buildSystemPrompt,
  buildUserPrompt,
} from "@/lib/meta-prompt";
import { rateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 60;

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "anon";
}

function repairJson(text: string): string {
  let t = text.trim();
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fence) t = fence[1];
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) return t;
  return t.slice(start, end + 1);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<EnhanceRequest>;
    const prompt = String(body.prompt ?? "").trim();
    if (!prompt) return NextResponse.json({ error: "prompt required" }, { status: 400 });
    if (prompt.length > 4000)
      return NextResponse.json({ error: "prompt too long (max 4000)" }, { status: 400 });

    const ip = getClientIp(req);
    const limit = await rateLimit(`enhance:${ip}`, 10);
    if (!limit.success)
      return NextResponse.json(
        { error: "rate limit reached. come back later.", resetAt: limit.reset },
        { status: 429 },
      );

    const enhanceReq: EnhanceRequest = {
      prompt,
      mode: (body.mode ?? "text") as EnhanceRequest["mode"],
      target: (body.target ?? "any") as EnhanceRequest["target"],
      taskType: body.taskType,
      tone: body.tone,
      aspect: body.aspect,
      style: body.style,
      duration: body.duration,
      camera: body.camera,
      audio: body.audio,
    };

    const system = buildSystemPrompt(enhanceReq);
    const user = buildUserPrompt(enhanceReq);

    const gemini = getGemini();
    const model = gemini.getGenerativeModel({
      model: FLASH_MODEL,
      systemInstruction: system,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: ENHANCE_SCHEMA,
        temperature: 0.7,
        maxOutputTokens: 8192,
        // disable thinking on gemini-2.5-flash for fast deterministic JSON
        ...({ thinkingConfig: { thinkingBudget: 0 } } as Record<string, unknown>),
      },
    });

    const result = await model.generateContent(user);
    const text = result.response.text();

    let parsed: EnhanceResponse | null = null;
    try {
      parsed = JSON.parse(text) as EnhanceResponse;
    } catch {
      try {
        parsed = JSON.parse(repairJson(text)) as EnhanceResponse;
      } catch {
        return NextResponse.json(
          { error: "model returned malformed JSON", raw: text.slice(0, 500) },
          { status: 502 },
        );
      }
    }

    if (!parsed?.enhanced || !Array.isArray(parsed.changes))
      return NextResponse.json({ error: "incomplete response" }, { status: 502 });

    return NextResponse.json(parsed);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
