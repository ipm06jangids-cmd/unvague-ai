import { NextRequest, NextResponse } from "next/server";
import { FLASH_MODEL, getGemini } from "@/lib/gemini";

export const runtime = "nodejs";

async function run(prompt: string): Promise<string> {
  const gemini = getGemini();
  const model = gemini.getGenerativeModel({
    model: FLASH_MODEL,
    generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
  });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const vague = String(body.vague ?? "").trim();
    const enhanced = String(body.enhanced ?? "").trim();
    if (!vague || !enhanced)
      return NextResponse.json({ error: "vague + enhanced required" }, { status: 400 });

    const [vRes, eRes] = await Promise.allSettled([run(vague), run(enhanced)]);

    return NextResponse.json({
      vague: vRes.status === "fulfilled" ? vRes.value : "(error generating output)",
      enhanced: eRes.status === "fulfilled" ? eRes.value : "(error generating output)",
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
