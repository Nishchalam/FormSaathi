import { NextRequest, NextResponse } from "next/server";

function truncateAtSentence(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  const slice = text.slice(0, maxLen);
  const lastStop = Math.max(
    slice.lastIndexOf(". "),
    slice.lastIndexOf("। "),
    slice.lastIndexOf("! "),
    slice.lastIndexOf("? "),
  );
  return lastStop > 0 ? slice.slice(0, lastStop + 1) : slice;
}

export async function POST(req: NextRequest) {
  if (!process.env.SARVAM_API_KEY) {
    return NextResponse.json({ error: "tts_unavailable" }, { status: 503 });
  }

  let body: { text?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const text = truncateAtSentence((body.text ?? "").trim(), 2500);
  if (!text) {
    return NextResponse.json({ error: "missing_text" }, { status: 400 });
  }

  try {
    const res = await fetch("https://api.sarvam.ai/text-to-speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": process.env.SARVAM_API_KEY,
      },
      body: JSON.stringify({
        inputs: [text],
        target_language_code: "en-IN",
        speaker: "shubh",
        pace: 1.0,
        model: "bulbul:v3",
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "tts_failed" }, { status: 502 });
    }

    const data = await res.json();
    const audio: string = data.audios?.[0] ?? "";
    if (!audio) {
      return NextResponse.json({ error: "tts_empty" }, { status: 502 });
    }
    return NextResponse.json({ audio });
  } catch {
    return NextResponse.json({ error: "tts_failed" }, { status: 502 });
  }
}
