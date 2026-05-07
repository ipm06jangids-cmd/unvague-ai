export type TargetModel = "any" | "claude" | "gpt" | "gemini";
export type TaskType =
  | "auto"
  | "writing"
  | "coding"
  | "analysis"
  | "marketing"
  | "image"
  | "research";
export type Tone = "neutral" | "formal" | "casual" | "technical";

export interface EnhanceRequest {
  prompt: string;
  target: TargetModel;
  taskType: TaskType;
  tone: Tone;
}

export interface ChangeNote {
  added: string;
  why: string;
}

export interface EnhanceResponse {
  enhanced: string;
  detectedTaskType: string;
  changes: ChangeNote[];
}

const MODEL_GUIDE: Record<TargetModel, string> = {
  any: "Universal best practices: clear role, explicit context, numbered steps, defined output format, success criteria.",
  claude:
    "Claude-optimized: wrap context/instructions/examples in XML tags like <context>, <task>, <output_format>, <examples>. Place long context near top, instructions near bottom. Use 'Think step by step' for reasoning tasks.",
  gpt:
    "GPT-optimized: lead with role assignment ('You are a...'), use numbered steps, end with explicit output format directive (markdown/JSON/etc). Use --- separators for sections.",
  gemini:
    "Gemini-optimized: structured sections with bold headers (## Context, ## Task, ## Constraints, ## Output). Be explicit about format. Gemini handles long context well — include relevant background.",
};

const TONE_GUIDE: Record<Tone, string> = {
  neutral: "professional, balanced",
  formal: "formal, precise, no contractions",
  casual: "conversational, approachable, light",
  technical: "technical, dense, jargon acceptable for expert audience",
};

export function buildMetaPrompt(req: EnhanceRequest): {
  system: string;
  user: string;
} {
  const system = `You are Unvague AI's prompt-enhancement engine. Your job: take a vague, lazy, or generic user prompt and rewrite it into a world-class, expert-level prompt that gets dramatically better results from LLMs.

# Core principles
- A great prompt has: clear ROLE, sufficient CONTEXT, explicit TASK, concrete CONSTRAINTS, defined OUTPUT FORMAT, and ideally SUCCESS CRITERIA or examples.
- Match enhancement depth to original ambiguity. A short clear prompt needs light polish. A vague one-liner needs full scaffolding.
- NEVER lengthen pointlessly. Every added word must earn its place.
- NEVER fabricate domain facts the user didn't provide. Use [BRACKETED_PLACEHOLDERS] for info the user must fill in.
- Preserve the user's original intent exactly. Do not change what they're asking for — only how they're asking.

# Target-model adaptation
${MODEL_GUIDE[req.target]}

# Tone for enhanced prompt
${TONE_GUIDE[req.tone]}

# Output requirement
Return ONLY a valid JSON object, no prose, no markdown fence, with this exact shape:
{
  "enhanced": "<the rewritten prompt, ready to paste into ${req.target === "any" ? "any LLM" : req.target.toUpperCase()}>",
  "detectedTaskType": "<one of: writing, coding, analysis, marketing, image-prompt, research, extraction, summarization, reasoning, other>",
  "changes": [
    {"added": "<short label of what you added>", "why": "<one-sentence reason>"},
    ... 3 to 7 items, ordered by impact
  ]
}

The "changes" array is critical — it teaches the user prompt engineering. Be specific. Bad: "Added more detail." Good: "Added explicit role 'senior data analyst with 10 years SaaS experience' — gives model a concrete perspective to reason from."`;

  const taskHint =
    req.taskType === "auto"
      ? "Detect task type from the prompt itself."
      : `User says this is a ${req.taskType} task — optimize accordingly.`;

  const user = `${taskHint}

<user_prompt>
${req.prompt}
</user_prompt>

Rewrite this into a world-class prompt and return the JSON.`;

  return { system, user };
}
