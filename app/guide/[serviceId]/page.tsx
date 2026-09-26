"use client";

import { useState, useEffect, useRef, useCallback, use } from "react";
import Link from "next/link";
import { useLanguage, GUIDE_LABELS, SARVAM_LANG, SARVAM_STT_MODE } from "@/lib/lang";
import type { Lang } from "@/lib/lang";
// SARVAM_LANG kept for STT language codes; TTS is English-only (shubh speaker) for now
import { getService } from "@/lib/services/data";
import MicButton from "@/components/MicButton";

type Phase = "docs" | "step" | "handoff";
type VoiceState = "idle" | "tts_playing" | "auto_listening" | "processing_response";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const ADVANCE_RE =
  /^(yes|next|ok|okay|go|sure|done|proceed|continue|हाँ|ha|han|aage|आगे|ठीक|theek|ஆம்|அடுத்து|aam|అవును|avunu|తర్వాత|tarvata)\b/i;

function isAdvanceIntent(text: string): boolean {
  return ADVANCE_RE.test(text.trim());
}

function useAutoTts(onTtsEnded?: () => void) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);
  const onEndedRef = useRef(onTtsEnded);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { onEndedRef.current = onTtsEnded; }, [onTtsEnded]);

  const load = useCallback(async (text: string, languageCode: string = "en-IN") => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    setFailed(false);
    setLoading(true);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language_code: languageCode }),
      });
      const data = await res.json();
      if (!data.audio) throw new Error("no_audio");

      const binary = atob(data.audio);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: "audio/wav" });
      const url = URL.createObjectURL(blob);
      urlRef.current = url;

      const audio = new Audio(url);
      audio.onended = () => {
        setPlaying(false);
        onEndedRef.current?.();
      };
      audio.onerror = () => { setPlaying(false); setFailed(true); };
      audioRef.current = audio;
      setLoading(false);
      return audio;
    } catch {
      setFailed(true);
      setLoading(false);
      return null;
    }
  }, []);

  const play = useCallback(async (audio: HTMLAudioElement) => {
    try {
      audio.currentTime = 0;
      await audio.play();
      setPlaying(true);
    } catch {
      // autoplay blocked
    }
  }, []);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) play(audioRef.current);
    else stop();
  }, [play, stop]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  return { load, play, stop, toggle, playing, loading, failed };
}

export default function GuidePage({ params }: { params: Promise<{ serviceId: string }> }) {
  const { serviceId } = use(params);
  const { lang, mounted } = useLanguage();
  const service = getService(serviceId);

  const [phase, setPhase] = useState<Phase>("docs");
  const [stepIndex, setStepIndex] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [lastTranscript, setLastTranscript] = useState("");

  const autoListenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const langRef = useRef<Lang>("en");

  // Keep langRef in sync for use inside stable callbacks
  useEffect(() => { langRef.current = (mounted ? lang : "en") as Lang; }, [lang, mounted]);

  const labels = GUIDE_LABELS[mounted ? lang : "en"];

  const clearAutoListenTimer = useCallback(() => {
    if (autoListenTimerRef.current) {
      clearTimeout(autoListenTimerRef.current);
      autoListenTimerRef.current = null;
    }
  }, []);

  const handleTtsEnded = useCallback(() => {
    setTimeout(() => {
      setVoiceState("auto_listening");
      autoListenTimerRef.current = setTimeout(() => setVoiceState("idle"), 8000);
    }, 800);
  }, []);

  const tts = useAutoTts(handleTtsEnded);


  const handleNextStep = useCallback(() => {
    if (!service) return;
    clearAutoListenTimer();
    setVoiceState("idle");
    setLastTranscript("");
    if (stepIndex < service.steps.length - 1) {
      setStepIndex((i) => i + 1);
      setChatOpen(false);
      setChatHistory([]);
    } else {
      setPhase("handoff");
    }
  }, [service, stepIndex, clearAutoListenTimer]);

  const sendChat = useCallback(async (question: string) => {
    if (!question.trim() || !service) return;
    clearAutoListenTimer();
    setVoiceState("processing_response");
    setChatInput("");
    setChatOpen(true);
    setChatLoading(true);
    const newHistory: ChatMessage[] = [...chatHistory, { role: "user", content: question }];
    setChatHistory(newHistory);

    let reply = "";
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "qa",
          serviceId: service.id,
          lang: langRef.current,
          question,
          history: chatHistory,
          stepIndex: phase === "step" ? stepIndex : undefined,
        }),
      });
      const data = await res.json();
      reply = data.reply ?? GUIDE_LABELS[langRef.current].chatError;
    } catch {
      reply = GUIDE_LABELS[langRef.current].chatError;
    }

    setChatHistory([...newHistory, { role: "assistant", content: reply }]);
    setChatLoading(false);

    // Only speak if the response is in English (TTS is English-only for now)
    if (langRef.current === "en") {
      const audio = await tts.load(reply);
      if (audio) await tts.play(audio);
    }
  }, [service, chatHistory, phase, stepIndex, clearAutoListenTimer, tts]);

  const handleVoiceTranscript = useCallback((text: string) => {
    clearAutoListenTimer();
    setLastTranscript(text);
    setVoiceState("processing_response");
    if (isAdvanceIntent(text)) {
      // Say "moving on" briefly then advance after a small delay
      handleNextStep();
    } else {
      sendChat(text);
    }
  }, [clearAutoListenTimer, handleNextStep, sendChat]);

  const handleSkipListen = useCallback(() => {
    clearAutoListenTimer();
    setVoiceState("idle");
  }, [clearAutoListenTimer]);

  // Auto-TTS when phase/step changes
  useEffect(() => {
    if (!service || !mounted) return;
    let cancelled = false;

    setVoiceState("tts_playing");
    setLastTranscript("");

    const fetchAndPlay = async () => {
      let text = "";
      if (phase === "docs") {
        const docNames = service.documents.map((d) => d.name).join(", ");
        text = `Before you start, keep these documents ready: ${docNames}.`;
      } else if (phase === "step") {
        const step = service.steps[stepIndex];
        if (step) text = `Step ${stepIndex + 1}: ${step.title}. ${step.desc}`;
      }

      if (!text) {
        if (!cancelled) setVoiceState("idle");
        return;
      }
      if (cancelled) return;

      const audio = await tts.load(text);
      if (audio && !cancelled) await tts.play(audio);
    };

    fetchAndPlay();
    return () => {
      cancelled = true;
      tts.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId, phase, stepIndex, mounted]);

  // Reset on service change
  useEffect(() => {
    setPhase("docs");
    setStepIndex(0);
    setChatHistory([]);
    setChatOpen(false);
    setVoiceState("idle");
    setLastTranscript("");
    clearAutoListenTimer();
  }, [serviceId, clearAutoListenTimer]);

  useEffect(() => () => clearAutoListenTimer(), [clearAutoListenTimer]);

  if (!service) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg font-semibold mb-3">Service not found.</p>
          <Link href="/home" className="text-sm" style={{ color: "var(--accent)" }}>{labels.backToHome}</Link>
        </div>
      </main>
    );
  }

  const totalSteps = service.steps.length;
  const currentStep = service.steps[stepIndex];
  const progress = phase === "handoff" ? 100 : ((stepIndex + 1) / totalSteps) * 100;
  const isAutoListening = voiceState === "auto_listening";
  const isProcessing = voiceState === "processing_response";
  const activeLang = (mounted ? lang : "en") as Lang;

  const TtsButton = () => {
    if (tts.failed) return <span className="text-xs" style={{ color: "var(--muted)" }}>{labels.ttsError}</span>;
    return (
      <button
        onClick={tts.toggle}
        disabled={tts.loading}
        className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-all"
        style={{
          background: tts.playing ? "var(--accent)" : "var(--accent-light)",
          color: tts.playing ? "#fff" : "var(--accent)",
        }}
      >
        {tts.loading ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Loading…
          </>
        ) : tts.playing ? "⏹ Stop" : labels.hearStep}
      </button>
    );
  };

  // Shows after Didi speaks — mic prompt + transcript + skip
  const VoiceInteractionPanel = () => {
    if (isProcessing && lastTranscript) {
      return (
        <div className="rounded-2xl p-4 mb-4" style={{ background: "var(--card)", boxShadow: "var(--card-shadow)", border: "1px solid rgba(232,84,26,0.15)" }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>
            {GUIDE_LABELS[activeLang].speakNow.replace("…", "")}
          </p>
          <p className="text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>❝ {lastTranscript} ❞</p>
          <div className="flex items-center gap-1.5">
            <svg className="animate-spin w-4 h-4 flex-shrink-0" style={{ color: "var(--accent)" }} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span className="text-xs" style={{ color: "var(--accent)" }}>Thinking…</span>
          </div>
        </div>
      );
    }

    if (!isAutoListening) return null;

    return (
      <div
        className="rounded-2xl p-4 mb-4 flex flex-col items-center gap-3"
        style={{ background: "var(--card)", boxShadow: "var(--card-shadow)", border: "1px solid rgba(232,84,26,0.25)" }}
      >
        <p className="text-sm font-medium" style={{ color: "var(--accent)" }}>
          {labels.speakNow}
        </p>
        <MicButton
          sarvamLangCode={SARVAM_LANG[activeLang]}
          sttMode={SARVAM_STT_MODE[activeLang]}
          onTranscript={handleVoiceTranscript}
          onRecordStart={clearAutoListenTimer}
          idleLabel={labels.speakNow}
        />
        <button onClick={handleSkipListen} className="text-xs" style={{ color: "var(--muted)" }}>
          🔇 {labels.skipListen}
        </button>
      </div>
    );
  };

  return (
    <main className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
      {/* Header */}
      <div className="px-4 pt-6 pb-5 sticky top-0 z-10" style={{ background: "linear-gradient(135deg, #1C1C2E 0%, #2D1B69 100%)" }}>
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link href="/home" className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
              {labels.backToHome}
            </Link>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base bg-gradient-to-br ${service.gradient}`}>
              {service.icon}
            </div>
          </div>
          <h1 className="text-lg font-bold text-white mb-1">
            {mounted ? service.titles[lang] : service.titles.en}
          </h1>
          {phase !== "docs" && (
            <div className="flex items-center gap-3 mt-2">
              <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: "var(--accent)" }} />
              </div>
              {phase === "step" && (
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {labels.step} {stepIndex + 1} {labels.of} {totalSteps}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-5">

        {/* ── DOCS PHASE ── */}
        {phase === "docs" && (
          <div>
            <div className="rounded-2xl p-4 mb-4" style={{ background: "var(--card)", boxShadow: "var(--card-shadow)" }}>
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-semibold text-base">{labels.beforeYouStart}</h2>
                <TtsButton />
              </div>
              <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>{labels.docsNeeded}</p>
              <div className="flex flex-col gap-3">
                {service.documents.map((doc, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{doc.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{doc.why}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {service.appointment && (
              <div className="rounded-xl p-3 mb-4 flex items-start gap-2" style={{ background: "rgba(232,84,26,0.07)", border: "1px solid rgba(232,84,26,0.2)" }}>
                <span className="text-sm flex-shrink-0">📅</span>
                <p className="text-xs" style={{ color: "var(--muted)" }}>{labels.appointment}</p>
              </div>
            )}

            <VoiceInteractionPanel />

            <button
              onClick={() => { clearAutoListenTimer(); setVoiceState("idle"); setPhase("step"); }}
              className="w-full py-3.5 rounded-2xl font-semibold text-white text-sm transition-all active:scale-95"
              style={{ background: "var(--accent)" }}
            >
              {labels.haveThese}
            </button>
          </div>
        )}

        {/* ── STEP PHASE ── */}
        {phase === "step" && currentStep && (
          <div>
            <div className="rounded-2xl p-5 mb-4" style={{ background: "var(--card)", boxShadow: "var(--card-shadow)" }}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>
                    {labels.step} {stepIndex + 1}
                  </p>
                  <h2 className="text-base font-bold leading-snug">{currentStep.title}</h2>
                </div>
                {currentStep.isGovt && (
                  <span className="flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(22,163,74,0.1)", color: "rgb(22,163,74)" }}>
                    {labels.onOfficialSite}
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--muted)" }}>
                {currentStep.desc}
              </p>
              <TtsButton />
            </div>

            <VoiceInteractionPanel />

            {/* Q&A */}
            <div className="rounded-2xl mb-4" style={{ background: "var(--card)", boxShadow: "var(--card-shadow)" }}>
              <button
                onClick={() => setChatOpen((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold"
              >
                <span>{labels.askQuestion}</span>
                <span style={{ color: "var(--muted)" }}>{chatOpen ? "▲" : "▼"}</span>
              </button>

              {chatOpen && (
                <div className="border-t px-4 pb-4 pt-3" style={{ borderColor: "var(--border)" }}>
                  {chatHistory.length > 0 && (
                    <div className="flex flex-col gap-2 mb-3">
                      {chatHistory.map((msg, i) => (
                        <div
                          key={i}
                          className={`text-sm rounded-xl px-3 py-2 ${msg.role === "user" ? "self-end ml-8" : "self-start mr-8"}`}
                          style={{
                            background: msg.role === "user" ? "var(--accent)" : "var(--accent-light)",
                            color: msg.role === "user" ? "#fff" : "var(--foreground)",
                          }}
                        >
                          {msg.content}
                        </div>
                      ))}
                      {chatLoading && (
                        <div className="self-start text-xs px-3 py-2 rounded-xl" style={{ background: "var(--accent-light)", color: "var(--muted)" }}>
                          Thinking…
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-2">
                    <MicButton
                      sarvamLangCode={SARVAM_LANG[activeLang]}
                      sttMode={SARVAM_STT_MODE[activeLang]}
                      onTranscript={(t) => { setLastTranscript(t); sendChat(t); }}
                      disabled={chatLoading}
                      idleLabel="Ask"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendChat(chatInput)}
                      placeholder={labels.askPlaceholder}
                      className="flex-1 text-sm px-3 py-2 rounded-xl border outline-none"
                      style={{ background: "var(--background)", borderColor: "var(--border)" }}
                    />
                    <button
                      onClick={() => sendChat(chatInput)}
                      disabled={!chatInput.trim() || chatLoading}
                      className="px-3 py-2 rounded-xl text-sm font-semibold text-white"
                      style={{ background: "var(--accent)", opacity: chatInput.trim() ? 1 : 0.5 }}
                    >
                      {labels.send}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleNextStep}
              className="w-full py-3.5 rounded-2xl font-semibold text-white text-sm transition-all active:scale-95"
              style={{ background: "var(--accent)" }}
            >
              {stepIndex < totalSteps - 1 ? labels.nextStep : `${labels.youreReady} →`}
            </button>
          </div>
        )}

        {/* ── HANDOFF PHASE ── */}
        {phase === "handoff" && (
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-5" style={{ background: "rgba(22,163,74,0.1)" }}>
              ✅
            </div>
            <h2 className="text-xl font-bold mb-2">{labels.youreReady}</h2>
            <p className="text-sm leading-relaxed mb-8 max-w-xs" style={{ color: "var(--muted)" }}>
              {labels.readyDesc}
            </p>

            <a
              href={service.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-2xl font-semibold text-white text-sm mb-3 block text-center transition-all active:scale-95"
              style={{ background: "var(--accent)" }}
            >
              {labels.openOfficial} {service.officialName} ↗
            </a>

            <Link href={`/services/${service.id}`} className="text-sm font-medium mb-2" style={{ color: "var(--accent)" }}>
              {labels.readFull}
            </Link>

            <Link href="/home" className="text-sm" style={{ color: "var(--muted)" }}>
              {labels.backToHome}
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
