"use client";

import { useRef, useCallback, useState } from "react";

interface UseAudioPlayerOptions {
  onEnded?: () => void;
  onError?: () => void;
}

export function useAudioPlayer({ onEnded, onError }: UseAudioPlayerOptions = {}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [playing, setPlaying] = useState(false);

  const load = useCallback((base64: string) => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);

    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: "audio/wav" });
    const url = URL.createObjectURL(blob);
    objectUrlRef.current = url;

    const audio = new Audio(url);
    audio.onended = () => {
      setPlaying(false);
      onEnded?.();
    };
    audio.onerror = () => {
      setPlaying(false);
      onError?.();
    };
    audioRef.current = audio;
  }, [onEnded, onError]);

  const play = useCallback(async () => {
    if (!audioRef.current) return;
    try {
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
      setPlaying(true);
    } catch {
      onError?.();
    }
  }, [onError]);

  const stop = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setPlaying(false);
  }, []);

  return { load, play, stop, playing };
}

interface AudioPlayButtonProps {
  base64?: string;
  label?: string;
  errorLabel?: string;
  className?: string;
}

export default function AudioPlayButton({
  base64,
  label = "🔊 Hear this step",
  errorLabel = "Audio unavailable",
  className = "",
}: AudioPlayButtonProps) {
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const { load, play, stop, playing } = useAudioPlayer({ onError: () => setFailed(true) });
  const loadedRef = useRef(false);

  const handleClick = async () => {
    if (failed) return;
    if (playing) { stop(); return; }
    if (!base64) return;

    if (!loadedRef.current) {
      setLoading(true);
      load(base64);
      loadedRef.current = true;
      setLoading(false);
    }
    await play();
  };

  if (failed) {
    return (
      <span className={`text-xs ${className}`} style={{ color: "var(--muted)" }}>
        {errorLabel}
      </span>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading || !base64}
      className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-all ${className}`}
      style={{
        background: playing ? "var(--accent)" : "var(--accent-light)",
        color: playing ? "#fff" : "var(--accent)",
      }}
    >
      {loading ? (
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : playing ? (
        "⏹ Stop"
      ) : (
        label
      )}
    </button>
  );
}
