export type Mode = "text" | "image" | "video";

export type TextTarget =
  | "any"
  | "claude"
  | "gpt"
  | "gemini"
  | "grok"
  | "llama";

export type ImageTarget =
  | "midjourney"
  | "nano-banana"
  | "dalle"
  | "flux"
  | "sdxl"
  | "generic-image";

export type VideoTarget =
  | "veo"
  | "runway"
  | "kling"
  | "sora"
  | "pika";

export type AnyTarget = TextTarget | ImageTarget | VideoTarget;

export type TaskType =
  | "auto"
  | "writing"
  | "coding"
  | "analysis"
  | "marketing"
  | "research"
  | "roleplay"
  | "extraction";

export type Tone =
  | "neutral"
  | "formal"
  | "casual"
  | "technical"
  | "persuasive"
  | "academic";

export type AspectRatio = "1:1" | "16:9" | "9:16" | "3:2" | "4:5";
export type ImageStyle =
  | "photo"
  | "cinematic"
  | "illustration"
  | "3d"
  | "anime"
  | "editorial";
export type Duration = "4s" | "8s" | "12s" | "30s";
export type CameraMove =
  | "static"
  | "dolly"
  | "pan"
  | "crane"
  | "orbit"
  | "handheld";

export interface EnhanceRequest {
  prompt: string;
  mode: Mode;
  target: AnyTarget;
  taskType?: TaskType;
  tone?: Tone;
  aspect?: AspectRatio;
  style?: ImageStyle;
  duration?: Duration;
  camera?: CameraMove;
  audio?: boolean;
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

const TEXT_GUIDE: Record<TextTarget, string> = {
  any: "Universal best practices: clear role, explicit context, numbered steps, defined output format, success criteria.",
  claude:
    "Claude-optimized: wrap context/instructions/examples in XML tags like <context>, <task>, <output_format>, <examples>. Place long context near top, instructions near bottom. Use 'Think step by step' for reasoning.",
  gpt: "GPT-optimized: lead with role assignment ('You are a...'), use numbered steps, end with explicit output format directive. Use --- separators between sections.",
  gemini:
    "Gemini-optimized: structured sections with bold markdown headers (## Context, ## Task, ## Constraints, ## Output Format). Be explicit about format. Gemini handles long context — include relevant background.",
  grok: "Grok-optimized: direct, casual register ok, but precise constraints. Grok responds best to conversational framing with sharp specificity. Avoid over-formatting.",
  llama:
    "Llama-optimized: clear system message style, numbered constraints, explicit format. Llama benefits from one-shot or few-shot examples for non-trivial tasks.",
};

const TONE_GUIDE: Record<Tone, string> = {
  neutral: "professional, balanced",
  formal: "formal, precise, no contractions",
  casual: "conversational, approachable, light",
  technical: "technical, dense, jargon acceptable for expert audience",
  persuasive: "persuasive, vivid, action-oriented",
  academic: "academic, rigorous, citation-friendly",
};

const IMAGE_GUIDE: Record<ImageTarget, string> = {
  midjourney:
    "Midjourney v6 grammar: comma-separated descriptors. Order: subject, action, environment, lighting, lens, style, mood. End with parameters: --ar <ratio> --style raw|--stylize <0-1000> --v 6. Avoid full sentences. Be visually concrete.",
  "nano-banana":
    "Gemini Nano Banana grammar: natural-language descriptive paragraphs. Strong with multi-subject scenes, text-in-image, edits. Describe scene like directing a photographer. Mention lighting, camera, mood. No flags.",
  dalle:
    "DALL-E 3 grammar: natural language, full sentences. Describe subject + setting + style + mood. DALL-E rewrites prompts internally — be specific about what you want preserved (e.g., 'do not add other people').",
  flux: "Flux 1.1 grammar: structured natural-language prompt with clear visual hierarchy. Strong with realism + typography. Use clauses: '[subject], [action], [environment], [style markers], [technical specs like camera/lens]'.",
  sdxl: "SDXL grammar: comma-separated tags + weights. Use (term:1.3) to emphasize, (term:0.7) to suppress. Front-load most important elements. Add quality boilerplate (masterpiece, 8k, sharp focus). Use negative prompt section.",
  "generic-image":
    "Universal image-prompt best practices: subject + action + environment + lighting + camera + style. Be visually concrete. Avoid vague adjectives like 'beautiful' — use specific ones like 'rim-lit', 'shallow depth of field'.",
};

const STYLE_HINT: Record<ImageStyle, string> = {
  photo: "photographic realism, real-camera look",
  cinematic: "cinematic, anamorphic, color-graded, filmic grain",
  illustration: "illustration, hand-drawn or vector aesthetic",
  "3d": "octane-rendered 3D, raytraced, physically-based shading",
  anime: "anime, cel-shaded, stylized linework",
  editorial: "editorial fashion photography, magazine spread",
};

const VIDEO_GUIDE: Record<VideoTarget, string> = {
  veo: "Veo 3 grammar: cinematic shot description with explicit camera move, subject action, environment, lighting, mood, audio cues if relevant. Veo handles native audio — describe diegetic + ambient sound. End with 'Filmed in [aesthetic], shot on [camera]'.",
  runway:
    "Runway Gen-3 grammar: subject + action + environment + camera move + style. Be motion-explicit. Mention what changes frame-to-frame. No flags.",
  kling:
    "Kling 1.5 grammar: structured natural language with clear scene description. Strong with realistic human motion. Specify movement direction, speed, and emotion.",
  sora: "Sora grammar: detailed scene description as if directing. Multiple shots possible — describe each. Strong with complex physics and continuity. Include duration cue.",
  pika: "Pika 2.0 grammar: concise scene + motion + style. Pika favors stylized over realistic. Describe motion explicitly.",
};

const CAMERA_HINT: Record<CameraMove, string> = {
  static: "static locked-off camera",
  dolly: "smooth dolly-in / dolly-out",
  pan: "horizontal pan",
  crane: "crane shot rising or descending",
  orbit: "360 orbit around subject",
  handheld: "handheld, organic micro-movement",
};

function buildTextSystem(req: EnhanceRequest): string {
  const target = req.target as TextTarget;
  return `You are Unvague AI's prompt-enhancement engine for TEXT prompts.
Take a vague, lazy, or generic user prompt and rewrite it into a world-class, expert-level prompt that gets dramatically better results from LLMs.

# Core principles
- Great prompts have: clear ROLE, sufficient CONTEXT, explicit TASK, concrete CONSTRAINTS, defined OUTPUT FORMAT, and ideally SUCCESS CRITERIA or examples.
- Match enhancement depth to original ambiguity. Short clear prompt → light polish. Vague one-liner → full scaffolding.
- NEVER lengthen pointlessly. Every added word must earn its place.
- NEVER fabricate domain facts the user didn't provide. Use [BRACKETED_PLACEHOLDERS] for info user must fill in.
- Preserve user's original intent exactly. Change how they ask, not what they ask.

# Target-model adaptation
${TEXT_GUIDE[target] ?? TEXT_GUIDE.any}

# Tone for enhanced prompt
${TONE_GUIDE[req.tone ?? "neutral"]}

# detectedTaskType options
writing, coding, analysis, marketing, research, roleplay, extraction, summarization, reasoning, other

# changes array
3 to 7 items, ordered by impact. Be specific. Bad: "Added more detail." Good: "Added explicit role 'senior data analyst with 10 years SaaS experience' — gives model concrete perspective to reason from."`;
}

function buildImageSystem(req: EnhanceRequest): string {
  const target = req.target as ImageTarget;
  const styleNote = req.style ? `\n# User-selected visual style\n${STYLE_HINT[req.style]}` : "";
  const aspectNote = req.aspect ? `\n# User-selected aspect ratio: ${req.aspect}` : "";
  return `You are Unvague AI's prompt-enhancement engine for IMAGE prompts.
Take a vague visual idea and rewrite it into a world-class image-generation prompt for the target model.

# Core principles
- Image prompts must be visually CONCRETE. Replace vague words with specific ones (not "nice lighting" → "low-key rim lighting from camera-right").
- Specify in order: subject → action → environment → lighting → camera/lens → style → mood/emotion.
- NEVER fabricate brand names, copyrighted characters, or specific real people unless user provided them.
- Match output grammar to target model exactly.

# Target-model grammar
${IMAGE_GUIDE[target] ?? IMAGE_GUIDE["generic-image"]}
${styleNote}${aspectNote}

# detectedTaskType
Always set to "image-prompt".

# changes array
3 to 7 items. Each names a specific addition (e.g. "Added lens spec: 85mm f/1.4") and why it lifts quality.`;
}

function buildVideoSystem(req: EnhanceRequest): string {
  const target = req.target as VideoTarget;
  const camNote = req.camera ? `\n# User-selected camera move\n${CAMERA_HINT[req.camera]}` : "";
  const durNote = req.duration ? `\n# Target duration: ${req.duration}` : "";
  const audioNote =
    req.audio && target === "veo"
      ? "\n# Audio: include diegetic + ambient sound description (Veo native audio)."
      : "";
  return `You are Unvague AI's prompt-enhancement engine for VIDEO prompts.
Take a vague motion idea and rewrite it into a world-class video-generation prompt for the target model.

# Core principles
- Video prompts must specify MOTION: what changes frame-to-frame, camera trajectory, subject action timing.
- Include: subject + action arc + environment + camera move + lighting + mood + style.
- NEVER fabricate copyrighted characters or specific real people unless user provided them.
- Match output grammar to target model.

# Target-model grammar
${VIDEO_GUIDE[target] ?? VIDEO_GUIDE.runway}
${camNote}${durNote}${audioNote}

# detectedTaskType
Always set to "video-prompt".

# changes array
3 to 7 items. Each names a specific addition (e.g. "Added camera move: slow 8-second dolly-in") and why it lifts quality.`;
}

export function buildSystemPrompt(req: EnhanceRequest): string {
  if (req.mode === "image") return buildImageSystem(req);
  if (req.mode === "video") return buildVideoSystem(req);
  return buildTextSystem(req);
}

export function buildUserPrompt(req: EnhanceRequest): string {
  const taskHint =
    req.mode === "text" && req.taskType && req.taskType !== "auto"
      ? `User says this is a ${req.taskType} task — optimize accordingly.`
      : req.mode === "text"
        ? "Detect task type from the prompt itself."
        : "";
  return `${taskHint}

<user_prompt>
${req.prompt}
</user_prompt>

Rewrite this into a world-class prompt and return the JSON.`;
}
