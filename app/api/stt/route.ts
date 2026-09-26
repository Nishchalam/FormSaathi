import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (!process.env.SARVAM_API_KEY) {
    return NextResponse.json({ error: "stt_unavailable" }, { status: 503 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const audio = formData.get("audio") as Blob | null;
  const language = (formData.get("language") as string) || "en-IN";
  const mode = (formData.get("mode") as string) || "transcribe";

  if (!audio || audio.size === 0) {
    return NextResponse.json({ error: "missing_audio" }, { status: 400 });
  }
  if (audio.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "audio_too_large" }, { status: 400 });
  }

  const upstream = new FormData();
  upstream.append("file", audio, "audio.webm");
  upstream.append("model", "saaras:v4");
  upstream.append("language_code", language);
  upstream.append("mode", mode);

  try {
    const res = await fetch("https://api.sarvam.ai/speech-to-text", {
      method: "POST",
      headers: { "api-subscription-key": process.env.SARVAM_API_KEY },
      body: upstream,
    });

    if (!res.ok) {
      return NextResponse.json({ error: "stt_failed" }, { status: 502 });
    }

    const data = await res.json();
    const transcript: string = data.transcript ?? data.text ?? "";
    return NextResponse.json({ transcript });
  } catch {
    return NextResponse.json({ error: "stt_failed" }, { status: 502 });
  }
}
