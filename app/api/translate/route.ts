import { NextRequest, NextResponse } from "next/server";
import { SARVAM_LANG } from "@/lib/lang";
import type { Lang } from "@/lib/lang";

export async function POST(req: NextRequest) {
  if (!process.env.SARVAM_API_KEY) {
    return NextResponse.json({ error: "translate_unavailable" }, { status: 503 });
  }

  let body: { text?: string; targetLang?: Lang };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const text = (body.text ?? "").trim();
  const targetLang = body.targetLang ?? "en";

  if (!text) {
    return NextResponse.json({ error: "missing_text" }, { status: 400 });
  }

  // No translation needed for English
  if (targetLang === "en") {
    return NextResponse.json({ translated: text });
  }

  try {
    const res = await fetch("https://api.sarvam.ai/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": process.env.SARVAM_API_KEY,
      },
      body: JSON.stringify({
        input: text,
        source_language_code: "en-IN",
        target_language_code: SARVAM_LANG[targetLang],
        speaker_gender: "Female",
        mode: "formal",
        model: "mayura:v1",
        enable_preprocessing: false,
      }),
    });

    if (!res.ok) {
      // Silent fallback — return original text so TTS still works in English
      return NextResponse.json({ translated: text });
    }

    const data = await res.json();
    const translated: string = data.translated_text ?? text;
    return NextResponse.json({ translated });
  } catch {
    return NextResponse.json({ translated: text });
  }
}
