"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type MicState = "idle" | "recording" | "processing";

interface Props {
  sarvamLangCode: string;
  sttMode: "transcribe" | "codemix";
  onTranscript: (text: string) => void;
  onError?: (msg: string) => void;
  onRecordStart?: () => void;
  disabled?: boolean;
  idleLabel?: string;
}

const MAX_DURATION_MS = 29_500;
const BAR_COUNT = 8;
const BAR_DELAYS = ["0s", "0.1s", "0.2s", "0.15s", "0.3s", "0.05s", "0.25s", "0.1s"];

function getBestMimeType(): string {
  for (const mt of ["audio/webm;codecs=opus", "audio/webm", "audio/ogg"]) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(mt)) return mt;
  }
  return "";
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function MicButton({
  sarvamLangCode,
  sttMode,
  onTranscript,
  onError,
  onRecordStart,
  disabled,
  idleLabel = "Talk to Didi!",
}: Props) {
  const [micState, setMicState] = useState<MicState>("idle");
  const [supported, setSupported] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.MediaRecorder) setSupported(false);
    return () => {
      if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
      if (tickTimerRef.current) clearInterval(tickTimerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const stopRecording = useCallback(() => {
    if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
    if (tickTimerRef.current) { clearInterval(tickTimerRef.current); tickTimerRef.current = null; }
    recorderRef.current?.stop();
  }, []);

  const startRecording = useCallback(async () => {
    if (micState !== "idle" || disabled) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = getBestMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setElapsed(0);
        setMicState("processing");

        const blob = new Blob(chunksRef.current, { type: mimeType || "audio/webm" });
        if (blob.size < 100) {
          setMicState("idle");
          onError?.("Recording was too short. Please try again.");
          return;
        }

        const fd = new FormData();
        fd.append("audio", blob, "audio.webm");
        fd.append("language", sarvamLangCode);
        fd.append("mode", sttMode);

        try {
          const res = await fetch("/api/stt", { method: "POST", body: fd });
          const data = await res.json();
          setMicState("idle");
          if (data.transcript) {
            onTranscript(data.transcript);
          } else {
            onError?.("Couldn't understand the audio. Please try again.");
          }
        } catch {
          setMicState("idle");
          onError?.("Voice recognition failed. Please try again.");
        }
      };

      recorder.start(250);
      setMicState("recording");
      setElapsed(0);
      onRecordStart?.();

      // Elapsed timer
      tickTimerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
      // Auto-stop
      stopTimerRef.current = setTimeout(stopRecording, MAX_DURATION_MS);
    } catch {
      onError?.("Microphone not available. Please type your request instead.");
    }
  }, [micState, disabled, sarvamLangCode, sttMode, onTranscript, onError, onRecordStart, stopRecording]);

  if (!supported) return null;

  const isRecording = micState === "recording";
  const isProcessing = micState === "processing";

  // ── RECORDING STATE ──────────────────────────────────────
  if (isRecording) {
    return (
      <>
        <style>{`
          @keyframes fs-bar {
            0%, 100% { transform: scaleY(0.2); }
            50% { transform: scaleY(1); }
          }
        `}</style>
        <div className="flex flex-col items-center gap-3 w-full max-w-xs">
          {/* Header row */}
          <div className="flex items-center justify-between w-full px-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-semibold" style={{ color: "var(--accent)" }}>Listening…</span>
            </div>
            <span className="text-sm font-mono" style={{ color: "var(--muted)" }}>{formatTime(elapsed)}</span>
          </div>

          {/* Waveform bars */}
          <div
            className="flex items-center justify-center gap-1 px-6 py-4 rounded-2xl w-full"
            style={{ background: "rgba(232,84,26,0.07)", border: "1px solid rgba(232,84,26,0.18)" }}
          >
            {Array.from({ length: BAR_COUNT }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: "5px",
                  height: "32px",
                  background: "var(--accent)",
                  borderRadius: "3px",
                  transformOrigin: "center",
                  animation: `fs-bar 0.8s ease-in-out infinite`,
                  animationDelay: BAR_DELAYS[i],
                }}
              />
            ))}
          </div>

          {/* Stop button */}
          <button
            onClick={stopRecording}
            className="w-full py-3 rounded-2xl font-semibold text-white text-sm transition-all active:scale-95"
            style={{ background: "var(--accent)" }}
          >
            Tap to stop
          </button>
        </div>
      </>
    );
  }

  // ── PROCESSING STATE ─────────────────────────────────────
  if (isProcessing) {
    return (
      <div className="flex flex-col items-center gap-3 w-full max-w-xs">
        <div
          className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl w-full"
          style={{ background: "rgba(232,84,26,0.07)", border: "1px solid rgba(232,84,26,0.18)" }}
        >
          <svg className="animate-spin w-5 h-5 flex-shrink-0" style={{ color: "var(--accent)" }} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="text-sm font-medium" style={{ color: "var(--accent)" }}>Transcribing…</span>
        </div>
      </div>
    );
  }

  // ── IDLE STATE ───────────────────────────────────────────
  return (
    <button
      onClick={startRecording}
      disabled={disabled}
      aria-label="Start voice recording"
      className="relative flex flex-col items-center gap-3 focus:outline-none"
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
        style={{
          background: "linear-gradient(135deg, #1C1C2E, #2D1B69)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1a4 4 0 014 4v7a4 4 0 01-8 0V5a4 4 0 014-4zm0 2a2 2 0 00-2 2v7a2 2 0 004 0V5a2 2 0 00-2-2zM6.5 11a.75.75 0 01.75.75 4.75 4.75 0 009.5 0A.75.75 0 0118.25 11a.75.75 0 01.75.75 6.25 6.25 0 01-5.5 6.207V20h2.25a.75.75 0 010 1.5h-6a.75.75 0 010-1.5H12v-2.043A6.25 6.25 0 015.75 11.75.75.75 0 016.5 11z" />
        </svg>
      </div>
      <span className="text-sm font-semibold tracking-wide" style={{ color: disabled ? "var(--muted)" : "var(--foreground)" }}>
        {idleLabel}
      </span>
    </button>
  );
}
