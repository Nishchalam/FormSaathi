"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getLang, saveLang, LANG_KEY } from "@/lib/lang";
import type { Lang } from "@/lib/lang";

const options: { code: Lang; native: string; english: string; sub: string }[] = [
  { code: "en", native: "English", english: "English", sub: "Continue in English" },
  { code: "hi", native: "हिंदी", english: "Hindi", sub: "हिंदी में जारी रखें" },
  { code: "ta", native: "தமிழ்", english: "Tamil", sub: "தமிழில் தொடரவும்" },
  { code: "te", native: "తెలుగు", english: "Telugu", sub: "తెలుగులో కొనసాగండి" },
];

const atmosphericLines = [
  "Your elder sister for becoming an adult.",
  "बड़े होने में आपकी बड़ी दीदी।",
  "பெரியவராவதற்கான உங்கள் அக்கா.",
  "పెద్దవారు అవ్వడానికి మీ అక్క.",
];

export default function LanguageSelect() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(LANG_KEY);
        if (stored) router.replace("/home");
      } catch {}
    }
  }, [router]);

  const pick = (code: Lang) => {
    saveLang(code);
    router.push("/home");
  };

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(160deg, #1C1C2E 0%, #2D1B69 55%, #1C1C2E 100%)" }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-6 pt-10 pb-2">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-lg"
          style={{ background: "var(--accent)" }}
        >
          🪷
        </div>
        <span className="text-white font-bold text-xl tracking-tight">FormSaathi</span>
      </div>

      {/* Atmospheric taglines */}
      <div className="px-6 pt-6 pb-4 flex flex-col gap-1.5">
        {atmosphericLines.map((line, i) => (
          <p
            key={i}
            className="text-sm leading-snug"
            style={{ color: i === 0 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)", fontSize: i === 0 ? "14px" : "12px" }}
          >
            {line}
          </p>
        ))}
      </div>

      {/* Language picker */}
      <div className="flex-1 flex flex-col justify-center px-6 py-6 max-w-sm mx-auto w-full">
        <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "rgba(255,255,255,0.4)" }}>
          Choose your language
        </p>
        <div className="grid grid-cols-2 gap-3">
          {options.map((opt) => (
            <button
              key={opt.code}
              onClick={() => pick(opt.code)}
              className="flex flex-col items-start p-4 rounded-2xl transition-all duration-150 active:scale-95 hover:scale-[1.02] text-left"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(8px)",
              }}
            >
              <span className="text-2xl font-bold text-white leading-none mb-1">{opt.native}</span>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{opt.sub}</span>
            </button>
          ))}
        </div>

        <p className="text-center text-xs mt-8" style={{ color: "rgba(255,255,255,0.25)" }}>
          You can change this anytime
        </p>
      </div>
    </main>
  );
}
