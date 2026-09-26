"use client";

import Link from "next/link";
import { useState } from "react";

type Lang = "en" | "ta" | "hi" | "te";

const copy: Record<Lang, {
  tagline: string;
  subtitle: string;
  prompt: string;
  footer: string;
}> = {
  en: {
    tagline: "Your elder sister for becoming an adult.",
    subtitle: "Turned 18? Here's what you need to know about your first government IDs — in plain language, step by step.",
    prompt: "What do you want to get done?",
    footer: "FormSaathi explains the process. You do the actual application on the official government website.",
  },
  ta: {
    tagline: "பெரியவராவதற்கான உங்கள் அக்கா.",
    subtitle: "18 ஆகிவிட்டீர்களா? உங்கள் முதல் அரசு அடையாளச் சான்றிதழ்களைப் பற்றி தெளிவாக புரிந்துகொள்ளுங்கள்.",
    prompt: "நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?",
    footer: "FormSaathi செயல்முறையை விளக்குகிறது. நீங்கள் அதிகாரப்பூர்வ அரசு இணையதளத்தில் விண்ணப்பிக்கவேண்டும்.",
  },
  hi: {
    tagline: "बड़े होने में आपकी बड़ी दीदी।",
    subtitle: "18 के हो गए? अपने पहले सरकारी ID के बारे में सब कुछ जानें — आसान भाषा में, कदम दर कदम।",
    prompt: "आप क्या करना चाहते हैं?",
    footer: "FormSaathi प्रक्रिया समझाता है। असली आवेदन आप खुद सरकारी वेबसाइट पर करेंगे।",
  },
  te: {
    tagline: "పెద్దవారు అవ్వడానికి మీ అక్క.",
    subtitle: "18 అయిందా? మీ తొలి ప్రభుత్వ గుర్తింపు పత్రాల గురించి సులభంగా అర్థం చేసుకోండి.",
    prompt: "మీరు ఏమి చేయాలనుకుంటున్నారు?",
    footer: "FormSaathi ప్రక్రియను వివరిస్తుంది. అసలు దరఖాస్తు మీరు అధికారిక వెబ్‌సైట్‌లో చేస్తారు.",
  },
};

const services = [
  {
    id: "driving-licence",
    icon: "🚗",
    titles: { en: "Driving Licence", ta: "ஓட்டுநர் உரிமம்", hi: "ड्राइविंग लाइसेंस", te: "డ్రైవింగ్ లైసెన్స్" },
    descs: {
      en: "Get your learner's licence or full driving licence.",
      ta: "உங்கள் கற்றல் உரிமம் அல்லது முழு ஓட்டுநர் உரிமம் பெறுங்கள்.",
      hi: "लर्नर लाइसेंस या पूरा ड्राइविंग लाइसेंस पाएं।",
      te: "లెర్నర్ లైసెన్స్ లేదా పూర్తి డ్రైవింగ్ లైసెన్స్ పొందండి.",
    },
    meta: "6 steps · Parivahan",
    gradient: "from-orange-400 to-red-500",
    bg: "bg-orange-50",
    border: "border-orange-100",
    badge: "bg-orange-100 text-orange-700",
  },
  {
    id: "voter-id",
    icon: "🗳️",
    titles: { en: "Voter ID", ta: "வாக்காளர் அட்டை", hi: "वोटर आईडी", te: "ఓటర్ గుర్తింపు" },
    descs: {
      en: "Register to vote for the first time.",
      ta: "முதல் முறையாக வாக்காளராக பதிவு செய்யுங்கள்.",
      hi: "पहली बार मतदाता के रूप में पंजीकरण करें।",
      te: "మొదటిసారి ఓటరుగా నమోదు చేసుకోండి.",
    },
    meta: "4 steps · ECI portal",
    gradient: "from-blue-400 to-indigo-500",
    bg: "bg-blue-50",
    border: "border-blue-100",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    id: "passport",
    icon: "🛂",
    titles: { en: "Passport", ta: "பாஸ்போர்ட்", hi: "पासपोर्ट", te: "పాస్‌పోర్ట్" },
    descs: {
      en: "Apply for your first passport or renew an existing one.",
      ta: "உங்கள் முதல் பாஸ்போர்ட்டிற்கு விண்ணப்பிக்கவும் அல்லது புதுப்பிக்கவும்.",
      hi: "पहली बार पासपोर्ट के लिए आवेदन करें या नवीनीकरण करें।",
      te: "మీ తొలి పాస్‌పోర్ట్ కోసం దరఖాస్తు చేయండి లేదా పునరుద్ధరించండి.",
    },
    meta: "7 steps · Passport Seva",
    gradient: "from-emerald-400 to-teal-500",
    bg: "bg-green-50",
    border: "border-green-100",
    badge: "bg-green-100 text-green-700",
  },
  {
    id: "aadhaar-update",
    icon: "🪪",
    titles: { en: "Aadhaar Update", ta: "ஆதார் புதுப்பிப்பு", hi: "आधार अपडेट", te: "ఆధార్ నవీకరణ" },
    descs: {
      en: "Update your address, name, phone number, or photo.",
      ta: "உங்கள் முகவரி, பெயர், தொலைபேசி எண் அல்லது புகைப்படத்தை புதுப்பிக்கவும்.",
      hi: "अपना पता, नाम, फोन नंबर या फोटो अपडेट करें।",
      te: "మీ చిరునామా, పేరు, ఫోన్ నంబర్ లేదా ఫోటో అప్‌డేట్ చేయండి.",
    },
    meta: "3–5 steps · UIDAI",
    gradient: "from-violet-400 to-purple-500",
    bg: "bg-purple-50",
    border: "border-purple-100",
    badge: "bg-purple-100 text-purple-700",
  },
];

const langs: { code: Lang; label: string; script: string }[] = [
  { code: "en", label: "English", script: "EN" },
  { code: "hi", label: "हिंदी", script: "HI" },
  { code: "ta", label: "தமிழ்", script: "TA" },
  { code: "te", label: "తెలుగు", script: "TE" },
];

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const t = copy[lang];

  return (
    <main className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Hero */}
      <div
        className="relative overflow-hidden px-4 pt-12 pb-10"
        style={{
          background: "linear-gradient(135deg, #1C1C2E 0%, #2D1B69 50%, #1C1C2E 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #E8541A, transparent)", transform: "translate(30%, -30%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #7C3AED, transparent)", transform: "translate(-30%, 30%)" }}
        />

        <div className="max-w-lg mx-auto relative">
          {/* Brand */}
          <div className="flex items-center gap-2 mb-6">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: "var(--accent)" }}
            >
              🪷
            </div>
            <span className="font-semibold text-white text-lg tracking-tight">FormSaathi</span>
          </div>

          {/* Language pills */}
          <div className="flex gap-2 flex-wrap mb-6">
            {langs.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={
                  lang === l.code
                    ? { background: "var(--accent)", color: "#fff" }
                    : { background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }
                }
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Headline */}
          <h1 className="text-2xl font-bold text-white leading-snug mb-3">
            {t.tagline}
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Service cards */}
      <div className="max-w-lg mx-auto px-4 pt-6 pb-16">
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--muted)" }}>
          {t.prompt}
        </p>

        <div className="flex flex-col gap-3">
          {services.map((s) => (
            <Link
              key={s.id}
              href={`/services/${s.id}?lang=${lang}`}
              className={`group flex items-center gap-4 p-4 rounded-2xl border ${s.bg} ${s.border} transition-all duration-200 hover:shadow-md active:scale-[0.98]`}
            >
              {/* Icon with gradient bg */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                }}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-gradient-to-br ${s.gradient} shadow-md`}>
                  {s.icon}
                </div>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-[15px] leading-tight">
                  {s.titles[lang]}
                </div>
                <div className="text-xs text-gray-500 mt-0.5 mb-1.5 leading-snug">
                  {s.descs[lang]}
                </div>
                <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${s.badge}`}>
                  {s.meta}
                </span>
              </div>

              {/* Arrow */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:translate-x-0.5"
                style={{ background: "rgba(0,0,0,0.05)" }}
              >
                <span className="text-gray-400 text-sm">›</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Info banner */}
        <div
          className="mt-6 rounded-2xl p-4 flex items-start gap-3"
          style={{ background: "rgba(232,84,26,0.06)", border: "1px solid rgba(232,84,26,0.15)" }}
        >
          <span className="text-lg flex-shrink-0 mt-0.5">ℹ️</span>
          <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
            {t.footer}
          </p>
        </div>
      </div>
    </main>
  );
}
