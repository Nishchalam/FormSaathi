"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage, HOME_LABELS, SARVAM_LANG, SARVAM_STT_MODE, saveLang } from "@/lib/lang";
import { getAllServices } from "@/lib/services/data";
import type { Lang } from "@/lib/lang";
import MicButton from "@/components/MicButton";

type HomeState = "idle" | "confirming" | "detecting" | "unknown" | "error";

const langOptions: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "hi", label: "HI" },
  { code: "ta", label: "TA" },
  { code: "te", label: "TE" },
];

export default function HomePage() {
  const router = useRouter();
  const { lang, setLang, mounted } = useLanguage();
  const [homeState, setHomeState] = useState<HomeState>("idle");
  const [transcript, setTranscript] = useState("");
  const [typedText, setTypedText] = useState("");
  const [showTypeBox, setShowTypeBox] = useState(false);

  const labels = HOME_LABELS[mounted ? lang : "en"];
  const services = getAllServices();

  const detectIntent = useCallback(async (text: string) => {
    setHomeState("detecting");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "intent", transcript: text }),
      });
      const data = await res.json();
      if (data.serviceId && data.serviceId !== "unknown") {
        router.push(`/guide/${data.serviceId}`);
      } else {
        setHomeState("unknown");
      }
    } catch {
      setHomeState("error");
    }
  }, [router]);

  // Called by MicButton after STT succeeds — show confirmation first
  const handleTranscript = useCallback((text: string) => {
    setTranscript(text);
    setHomeState("confirming");
  }, []);

  const handleConfirm = useCallback(() => {
    detectIntent(transcript);
  }, [detectIntent, transcript]);

  const handleRetry = useCallback(() => {
    setTranscript("");
    setHomeState("idle");
  }, []);

  const handleMicError = useCallback((msg: string) => {
    setTranscript(msg);
    setHomeState("error");
  }, []);

  const handleTextSubmit = () => {
    const text = typedText.trim();
    if (!text) return;
    setTypedText("");
    setShowTypeBox(false);
    setTranscript(text);
    detectIntent(text);
  };

  const handleLangChange = (l: Lang) => {
    setLang(l);
    saveLang(l);
    setHomeState("idle");
    setTranscript("");
  };

  const isBusy = homeState === "confirming" || homeState === "detecting";

  return (
    <main className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
      {/* Header */}
      <div
        className="px-4 pt-8 pb-6"
        style={{ background: "linear-gradient(135deg, #1C1C2E 0%, #2D1B69 100%)" }}
      >
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base" style={{ background: "var(--accent)" }}>
                🪷
              </div>
              <span className="font-bold text-white tracking-tight">FormSaathi</span>
            </div>
            <div className="flex gap-1">
              {langOptions.map((o) => (
                <button
                  key={o.code}
                  onClick={() => handleLangChange(o.code)}
                  className="px-2.5 py-1 rounded-full text-xs font-bold transition-all"
                  style={
                    (mounted ? lang : "en") === o.code
                      ? { background: "var(--accent)", color: "#fff" }
                      : { background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }
                  }
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <h1 className="text-lg font-semibold text-white leading-snug mb-1">
            {mounted ? labels.greeting : HOME_LABELS.en.greeting}
          </h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
            {mounted ? labels.prompt : HOME_LABELS.en.prompt}
          </p>
        </div>
      </div>

      {/* Service cards */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 pt-5 pb-4">
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--muted)" }}>
          {mounted ? labels.tapCard : HOME_LABELS.en.tapCard}
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {services.map((s) => (
            <Link
              key={s.id}
              href={`/guide/${s.id}`}
              className={`flex flex-col p-3.5 rounded-2xl border ${s.bg} ${s.border} transition-all active:scale-95 hover:shadow-md`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br ${s.gradient} shadow-sm mb-2`}>
                {s.icon}
              </div>
              <span className="text-[13px] font-semibold text-gray-900 leading-snug mb-1">
                {mounted ? s.titles[lang] : s.titles.en}
              </span>
              <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full self-start ${s.badge}`}>
                {s.meta}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Status + voice area */}
      <div
        className="sticky bottom-0 pb-8 pt-4 px-4"
        style={{ background: "linear-gradient(to top, var(--background) 80%, transparent)" }}
      >
        <div className="max-w-lg mx-auto flex flex-col items-center gap-4">

          {/* ── CONFIRMING: show transcript + confirm/retry ── */}
          {homeState === "confirming" && (
            <div
              className="w-full rounded-2xl p-4"
              style={{ background: "var(--card)", boxShadow: "var(--card-shadow)", border: "1px solid var(--border)" }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--muted)" }}>
                {labels.iHeard}
              </p>
              <p className="text-base font-semibold mb-4 leading-snug" style={{ color: "var(--foreground)" }}>
                ❝ {transcript} ❞
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-white text-sm transition-all active:scale-95"
                  style={{ background: "var(--accent)" }}
                >
                  {labels.confirmYes}
                </button>
                <button
                  onClick={handleRetry}
                  className="py-2.5 px-4 rounded-xl font-semibold text-sm transition-all active:scale-95"
                  style={{ background: "var(--accent-light)", color: "var(--accent)" }}
                >
                  {labels.tryAgain}
                </button>
              </div>
            </div>
          )}

          {/* ── DETECTING: spinner ── */}
          {homeState === "detecting" && (
            <div
              className="w-full rounded-2xl px-4 py-3 flex items-center gap-2"
              style={{ background: "rgba(232,84,26,0.07)", border: "1px solid rgba(232,84,26,0.2)" }}
            >
              <svg className="animate-spin w-4 h-4 flex-shrink-0" style={{ color: "var(--accent)" }} fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span className="text-sm" style={{ color: "var(--accent)" }}>{labels.processing}</span>
            </div>
          )}

          {/* ── UNKNOWN / ERROR ── */}
          {(homeState === "unknown" || homeState === "error") && (
            <div
              className="w-full rounded-2xl px-4 py-3"
              style={{ background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.2)" }}
            >
              <p className="text-xs text-gray-600 mb-1">{transcript && `❝ ${transcript} ❞`}</p>
              <p className="text-sm text-gray-700 mb-2">{labels.notUnderstood}</p>
              <button
                onClick={handleRetry}
                className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                style={{ background: "var(--accent)" }}
              >
                {labels.tryAgain}
              </button>
            </div>
          )}

          {/* ── MIC BUTTON (hidden while confirming or detecting) ── */}
          {!isBusy && homeState !== "unknown" && homeState !== "error" && (
            <MicButton
              sarvamLangCode={mounted ? SARVAM_LANG[lang] : "en-IN"}
              sttMode={mounted ? SARVAM_STT_MODE[lang] : "transcribe"}
              onTranscript={handleTranscript}
              onError={handleMicError}
              idleLabel="Talk to Didi!"
            />
          )}

          {/* ── Retry shows the mic again ── */}
          {(homeState === "unknown" || homeState === "error") && (
            <MicButton
              sarvamLangCode={mounted ? SARVAM_LANG[lang] : "en-IN"}
              sttMode={mounted ? SARVAM_STT_MODE[lang] : "transcribe"}
              onTranscript={handleTranscript}
              onError={handleMicError}
              idleLabel="Talk to Didi!"
            />
          )}

          {/* ── Or type (only in idle) ── */}
          {homeState === "idle" && (
            !showTypeBox ? (
              <button onClick={() => setShowTypeBox(true)} className="text-xs" style={{ color: "var(--muted)" }}>
                {labels.orType}
              </button>
            ) : (
              <div className="w-full flex gap-2">
                <input
                  autoFocus
                  type="text"
                  value={typedText}
                  onChange={(e) => setTypedText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
                  placeholder={labels.typePlaceholder}
                  className="flex-1 text-sm px-4 py-2.5 rounded-xl border outline-none"
                  style={{ background: "var(--card)", borderColor: "var(--border)" }}
                />
                <button
                  onClick={handleTextSubmit}
                  disabled={!typedText.trim()}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "var(--accent)" }}
                >
                  {labels.submit}
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
}
