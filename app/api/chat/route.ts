import { NextRequest, NextResponse } from "next/server";
import { getAllServices, buildQASystemPrompt, getService } from "@/lib/services/data";
import type { Lang } from "@/lib/lang";

const VALID_SERVICE_IDS = getAllServices().map((s) => s.id);

async function callSarvamChat(messages: { role: string; content: string }[]): Promise<string> {
  const res = await fetch("https://api.sarvam.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-subscription-key": process.env.SARVAM_API_KEY!,
    },
    body: JSON.stringify({
      model: "sarvam-105b-conversations",
      messages,
      max_tokens: 512,
      temperature: 0.3,
    }),
  });
  if (!res.ok) throw new Error("chat_failed");
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

export async function POST(req: NextRequest) {
  if (!process.env.SARVAM_API_KEY) {
    return NextResponse.json({ error: "chat_unavailable" }, { status: 503 });
  }

  let body: {
    mode?: string;
    transcript?: string;
    serviceId?: string;
    lang?: Lang;
    question?: string;
    history?: { role: string; content: string }[];
    stepIndex?: number;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  if (body.mode === "intent") {
    const transcript = (body.transcript ?? "").trim();
    if (!transcript) {
      return NextResponse.json({ serviceId: "unknown" });
    }

    const serviceList = VALID_SERVICE_IDS.map((id) => {
      const s = getService(id)!;
      return `- ${id}: ${s.titles.en} / ${s.titles.hi} / ${s.titles.ta} / ${s.titles.te}`;
    }).join("\n");

    const systemPrompt = `You are a routing assistant for FormSaathi, a guide for Indian government processes.
Given a user's message, identify which service they want. Respond with ONLY the exact service ID.

Available services:
${serviceList}

If none match, respond with exactly: unknown`;

    try {
      const reply = await callSarvamChat([
        { role: "system", content: systemPrompt },
        { role: "user", content: transcript },
      ]);
      const cleaned = reply.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
      const matched = VALID_SERVICE_IDS.find((v) => cleaned.includes(v.replace(/-/g, "").replace(/[^a-z0-9]/g, "")) || cleaned === v);
      return NextResponse.json({ serviceId: matched ?? "unknown" });
    } catch {
      return NextResponse.json({ serviceId: "unknown" });
    }
  }

  if (body.mode === "qa") {
    const serviceId = body.serviceId ?? "";
    const lang = (body.lang ?? "en") as Lang;
    const question = (body.question ?? "").trim();
    const history = (body.history ?? []).slice(-6);
    const stepIndex = body.stepIndex;

    if (!question) {
      return NextResponse.json({ error: "missing_question" }, { status: 400 });
    }

    const service = getService(serviceId);
    if (!service) {
      return NextResponse.json({ error: "unknown_service" }, { status: 400 });
    }

    let systemPrompt = buildQASystemPrompt(service, lang);
    if (stepIndex !== undefined) {
      const step = service.steps[stepIndex];
      if (step) {
        systemPrompt += `\n\nThe user is currently on: Step ${stepIndex + 1} — ${step.title}: ${step.desc}`;
      }
    }

    const messages = [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: question },
    ];

    try {
      const reply = await callSarvamChat(messages);
      return NextResponse.json({ reply });
    } catch {
      return NextResponse.json({ error: "chat_failed" }, { status: 502 });
    }
  }

  return NextResponse.json({ error: "invalid_mode" }, { status: 400 });
}
