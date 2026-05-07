import { NextRequest, NextResponse } from "next/server";
import { getAnthropic, HAIKU_MODEL } from "@/lib/anthropic";
import {
  buildMetaPrompt,
  EnhanceRequest,
  EnhanceResponse,
  TargetModel,
  TaskType,
  Tone,
} from "@/lib/meta-prompt";

export const runtime = "nodejs";

const VALID_TARGETS: TargetModel[] = ["any", "claude", "gpt", "gemini"];
const VALID_TASKS: TaskType[] = [
  "auto",
  "writing",
  "coding",
  "analysis",
  "marketing",
  "image",
  "research",
];
const VALID_TONES: Tone[] = ["neutral", "formal", "casual", "technical"];

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("no JSON object found");
  return JSON.parse(candidate.slice(start, end + 1));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = String(body.prompt ?? "").trim();
    if (!prompt) return NextResponse.json({ error: "prompt required" }, { status: 400 });
    if (prompt.length > 4000)
      return NextResponse.json({ error: "prompt too long (max 4000)" }, { status: 400 });

    const target = (VALID_TARGETS.includes(body.target) ? body.target : "any") as TargetModel;
    const taskType = (VALID_TASKS.includes(body.taskType) ? body.taskType : "auto") as TaskType;
    const tone = (VALID_TONES.includes(body.tone) ? body.tone : "neutral") as Tone;

    const enhanceReq: EnhanceRequest = { prompt, target, taskType, tone };
    const { system, user } = buildMetaPrompt(enhanceReq);

    const anthropic = getAnthropic();
    const result = await anthropic.messages.create({
      model: HAIKU_MODEL,
      max_tokens: 2000,
      system: [
        {
          type: "text",
          text: system,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: user }],
    });

    const textBlock = result.content.find((c) => c.type === "text");
    if (!textBlock || textBlock.type !== "text")
      return NextResponse.json({ error: "no text in response" }, { status: 502 });

    let parsed: EnhanceResponse;
    try {
      parsed = extractJson(textBlock.text) as EnhanceResponse;
    } catch {
      return NextResponse.json(
        { error: "model returned malformed JSON", raw: textBlock.text },
        { status: 502 },
      );
    }

    if (!parsed.enhanced || !Array.isArray(parsed.changes))
      return NextResponse.json({ error: "incomplete response" }, { status: 502 });

    return NextResponse.json(parsed);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
